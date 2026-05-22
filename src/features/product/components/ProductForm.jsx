import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { ImagePlus, Plus, Star, Trash2, X } from 'lucide-react';
import { useCategoryContext } from '../../../context/CategoryContext';
import { useProductContext } from '../../../context/ProductContext';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDropdown from '../../../components/custom/CustomDropdown';
import CustomInput from '../../../components/custom/CustomInput';
import CustomTextarea from '../../../components/custom/CustomTextarea';
import ProductFormSection from './ProductFormSection';
import {
  createDefaultVariant,
  createProductInitialValues,
  PRODUCT_BRAND_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  productValidationSchema,
} from './productFormSchema';
import { generateProductBarcode, generateProductSku } from '../utils/productCodeUtils';
import { fileToDataUrl } from '../../../utils/fileUtils';

const formatCategoryOptions = (categories) =>
  categories.map((category) => ({ label: category.name, value: category.name }));

const ProductForm = ({ initialValues, onSubmit, onCancel, mode = 'create' }) => {
  const { categories, subcategories } = useCategoryContext();
  const { products } = useProductContext();
  const [tagValue, setTagValue] = useState('');
  const [galleryValue, setGalleryValue] = useState('');
  const imageInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const lastGeneratedSkuRef = useRef('');
  const lastGeneratedBarcodeRef = useRef('');

  const categoryOptions = useMemo(() => formatCategoryOptions(categories), [categories]);

  const formik = useFormik({
    initialValues: createProductInitialValues(initialValues),
    validationSchema: productValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const normalizedVariants = values.variants.map((variant) => ({
        ...variant,
        price: Number(variant.price),
        onHand: Number(variant.onHand),
        available: Number(variant.onHand) > 0,
      }));

      onSubmit({
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
        variants: normalizedVariants,
        image: values.image || values.imageGallery[0] || '',
      });
    },
  });

  const subcategoryOptions = useMemo(
    () =>
      subcategories
        .filter((subcategory) => !formik.values.category || subcategory.categoryName === formik.values.category)
        .map((subcategory) => ({ label: subcategory.name, value: subcategory.name })),
    [formik.values.category, subcategories],
  );

  useEffect(() => {
    lastGeneratedSkuRef.current = initialValues?.sku ?? '';
    lastGeneratedBarcodeRef.current = initialValues?.barcode ?? '';
  }, [initialValues?.barcode, initialValues?.sku, initialValues?.id]);

  useEffect(() => {
    if (mode !== 'create') {
      return;
    }

    const nextSku = generateProductSku({
      name: formik.values.name,
      category: formik.values.category,
      existingProducts: products,
      currentProductId: formik.values.id,
    });
    const shouldReplaceSku = !formik.values.sku || formik.values.sku === lastGeneratedSkuRef.current;

    if (shouldReplaceSku && formik.values.sku !== nextSku) {
      formik.setFieldValue('sku', nextSku, false);
    }

    lastGeneratedSkuRef.current = nextSku;
  }, [mode, products, formik.values.name, formik.values.category, formik.values.sku, formik.values.id]);

  useEffect(() => {
    if (mode !== 'create') {
      return;
    }

    const nextBarcode = generateProductBarcode({
      existingProducts: products,
      currentProductId: formik.values.id,
    });
    const shouldReplaceBarcode =
      !formik.values.barcode || formik.values.barcode === lastGeneratedBarcodeRef.current;

    if (shouldReplaceBarcode && formik.values.barcode !== nextBarcode) {
      formik.setFieldValue('barcode', nextBarcode, false);
    }

    lastGeneratedBarcodeRef.current = nextBarcode;
  }, [mode, products, formik.values.barcode, formik.values.id]);

  useEffect(() => {
    if (
      formik.values.subcategory &&
      !subcategories.some(
        (subcategory) =>
          subcategory.name === formik.values.subcategory &&
          subcategory.categoryName === formik.values.category,
      )
    ) {
      formik.setFieldValue('subcategory', '', false);
    }
  }, [formik.values.category, formik.values.subcategory, subcategories]);

  const addTag = () => {
    const nextTag = tagValue.trim().replace(/,$/, '');

    if (!nextTag || formik.values.tags.includes(nextTag)) {
      setTagValue('');
      return;
    }

    formik.setFieldValue('tags', [...formik.values.tags, nextTag]);
    setTagValue('');
  };

  const addGalleryImage = () => {
    const nextImage = galleryValue.trim();
    if (!nextImage || formik.values.imageGallery.includes(nextImage)) {
      setGalleryValue('');
      return;
    }

    const nextGallery = [...formik.values.imageGallery, nextImage];
    formik.setFieldValue('imageGallery', nextGallery);
    if (!formik.values.image) {
      formik.setFieldValue('image', nextImage);
    }
    setGalleryValue('');
  };

  const removeGalleryImage = (imageToRemove) => {
    const nextGallery = formik.values.imageGallery.filter((image) => image !== imageToRemove);
    formik.setFieldValue('imageGallery', nextGallery);
    if (formik.values.image === imageToRemove) {
      formik.setFieldValue('image', nextGallery[0] || '');
    }
  };

  const handlePrimaryImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const image = await fileToDataUrl(file);
    formik.setFieldValue('image', image);
    if (!formik.values.imageGallery.includes(image)) {
      formik.setFieldValue('imageGallery', [image, ...formik.values.imageGallery]);
    }
  };

  const handleGalleryUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const uploaded = (await Promise.all(files.map((file) => fileToDataUrl(file)))).filter(Boolean);
    const nextGallery = [...formik.values.imageGallery];

    uploaded.forEach((image) => {
      if (!nextGallery.includes(image)) {
        nextGallery.push(image);
      }
    });

    formik.setFieldValue('imageGallery', nextGallery);
    if (!formik.values.image && uploaded[0]) {
      formik.setFieldValue('image', uploaded[0]);
    }
  };

  const updateVariant = (variantId, key, value) => {
    formik.setFieldValue(
      'variants',
      formik.values.variants.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              [key]: value,
              ...(key === 'onHand' ? { available: Number(value) > 0 } : {}),
            }
          : variant,
      ),
    );
  };

  const addVariant = () => {
    formik.setFieldValue('variants', [
      ...formik.values.variants,
      createDefaultVariant({ price: formik.values.price || '', onHand: 0, available: false }),
    ]);
  };

  const removeVariant = (variantId) => {
    formik.setFieldValue('variants', formik.values.variants.filter((variant) => variant.id !== variantId));
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="rounded-[1.35rem] border border-[var(--table-grid)] bg-[var(--surface-muted)] p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-[180px]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gray-500)]">
              Product Status
            </p>
            <CustomDropdown
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              options={PRODUCT_STATUS_OPTIONS}
              placeholder="Select Status"
              error={formik.touched.status && formik.errors.status}
              className="min-w-[180px]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <CustomButton type="button" variant="outline" onClick={onCancel} className="h-11 rounded-xl px-5">
              Cancel
            </CustomButton>
            <CustomButton type="submit" variant="dark" className="h-11 rounded-xl px-5">
              {mode === 'edit' ? 'Save Changes' : 'Create Product'}
            </CustomButton>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2.1fr)_minmax(300px,0.95fr)]">
        <div className="space-y-6">
          <ProductFormSection
            title="Basic Info"
            action={
              <label className="flex items-center gap-2 text-xs font-semibold text-[var(--color-gray-600)]">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formik.values.featured}
                  onChange={formik.handleChange}
                  className="h-4 w-4 rounded border-[var(--color-gray-300)] accent-[var(--color-primary)]"
                />
                Featured
              </label>
            }
          >
            <div className="space-y-5">
              <CustomInput
                label="Product Name"
                name="name"
                placeholder="Product name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && formik.errors.name}
                required
              />

              <div className="grid gap-5 md:grid-cols-2">
                <CustomInput
                  label="SKU"
                  name="sku"
                  placeholder="SKU"
                  value={formik.values.sku}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sku && formik.errors.sku}
                  helperText={mode === 'create' ? 'Auto-generated from category and product name.' : undefined}
                  required
                />
                <CustomInput
                  label="Barcode"
                  name="barcode"
                  placeholder="Barcode"
                  value={formik.values.barcode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.barcode && formik.errors.barcode}
                  helperText={mode === 'create' ? 'Auto-generated unique barcode.' : undefined}
                />
              </div>

              <CustomTextarea
                label="Product Description"
                name="description"
                placeholder="Describe the product"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && formik.errors.description}
                required
              />
            </div>
          </ProductFormSection>

          <ProductFormSection title="Category & Brand">
            <div className="grid gap-5 md:grid-cols-2">
              <CustomDropdown
                label="Product Category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={categoryOptions}
                placeholder="Select category"
                error={formik.touched.category && formik.errors.category}
                required
              />
              <CustomDropdown
                label="Subcategory"
                name="subcategory"
                value={formik.values.subcategory}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={subcategoryOptions}
                placeholder={formik.values.category ? 'Select subcategory' : 'Select category first'}
                error={formik.touched.subcategory && formik.errors.subcategory}
                disabled={!formik.values.category}
              />
              <div className="md:col-span-2">
                <CustomDropdown
                  label="Product Brand"
                  name="brand"
                  value={formik.values.brand}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  options={PRODUCT_BRAND_OPTIONS}
                  placeholder="Select brand"
                  error={formik.touched.brand && formik.errors.brand}
                  required
                />
              </div>
            </div>
          </ProductFormSection>

          <ProductFormSection
            title="Variants"
            action={
              <button
                type="button"
                onClick={addVariant}
                className="text-xs font-semibold text-[var(--color-primary)]"
              >
                Add Variant
              </button>
            }
          >
            {formik.values.variants.length === 0 ? (
              <div className="rounded-xl border border-[var(--table-grid)] bg-white px-8 py-10 text-center">
                <p className="text-lg font-semibold text-[var(--color-gray-900)]">No variants added yet</p>
                <CustomButton
                  type="button"
                  variant="dark"
                  onClick={addVariant}
                  className="mt-5 h-10 rounded-xl px-4 text-sm font-semibold"
                >
                  <Plus size={16} /> Add Variant
                </CustomButton>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[var(--table-grid)] bg-white shadow-sm">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-[var(--color-primary-light)] text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--table-head)]">
                    <tr>
                      <th className="border-r border-[var(--table-grid)] px-3 py-2.5">Size</th>
                      <th className="border-r border-[var(--table-grid)] px-3 py-2.5">Color</th>
                      <th className="border-r border-[var(--table-grid)] px-3 py-2.5">Price</th>
                      <th className="border-r border-[var(--table-grid)] px-3 py-2.5">Available</th>
                      <th className="border-r border-[var(--table-grid)] px-3 py-2.5">On Hand</th>
                      <th className="px-3 py-2.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formik.values.variants.map((variant) => (
                      <tr key={variant.id} className="border-t border-[var(--table-grid)] text-[13px]">
                        <td className="border-r border-[var(--table-grid)] px-3 py-2.5">
                          <input
                            type="text"
                            value={variant.size}
                            onChange={(event) => updateVariant(variant.id, 'size', event.target.value)}
                            className="h-9 w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 outline-none focus:border-[var(--table-grid)]"
                          />
                        </td>
                        <td className="border-r border-[var(--table-grid)] px-3 py-2.5">
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(event) => updateVariant(variant.id, 'color', event.target.value)}
                            className="h-9 w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 outline-none focus:border-[var(--table-grid)]"
                          />
                        </td>
                        <td className="border-r border-[var(--table-grid)] px-3 py-2.5">
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(event) => updateVariant(variant.id, 'price', event.target.value)}
                            className="h-9 w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 outline-none focus:border-[var(--table-grid)]"
                          />
                        </td>
                        <td className="border-r border-[var(--table-grid)] px-3 py-2.5 text-center">
                          <input type="checkbox" checked={Number(variant.onHand) > 0} readOnly className="h-4 w-4 accent-[var(--color-primary)]" />
                        </td>
                        <td className="border-r border-[var(--table-grid)] px-3 py-2.5">
                          <input
                            type="number"
                            value={variant.onHand}
                            onChange={(event) => updateVariant(variant.id, 'onHand', event.target.value)}
                            className="h-9 w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 outline-none focus:border-[var(--table-grid)]"
                          />
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => removeVariant(variant.id)}
                            className="rounded-lg p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[#FFF5F8] hover:text-[var(--color-danger)]"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {typeof formik.errors.variants === 'string' ? (
              <p className="mt-3 text-[11px] font-semibold text-[var(--color-danger)]">{formik.errors.variants}</p>
            ) : null}
          </ProductFormSection>

          <ProductFormSection title="Pricing & Inventory">
            <div className="grid gap-5 md:grid-cols-2">
              <CustomInput
                label="Price"
                name="price"
                type="number"
                placeholder="0.00"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && formik.errors.price}
                required
              />
              <CustomInput
                label="Stock Quantity"
                name="stock"
                type="number"
                placeholder="0"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.stock && formik.errors.stock}
                required
              />
            </div>
          </ProductFormSection>
        </div>

        <div className="space-y-6">
          <ProductFormSection title="Gallery">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {formik.values.imageGallery.slice(0, 4).map((image) => (
                  <div key={image} className="group relative overflow-hidden rounded-2xl border border-[var(--table-grid)] bg-[var(--surface-muted)] p-2">
                    <img src={image} alt="Product" className="h-28 w-full rounded-xl object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(image)}
                      className="absolute right-3 top-3 rounded-full bg-white/90 p-1 text-[var(--color-gray-500)] opacity-0 transition group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex min-h-[170px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--table-grid)] bg-[var(--surface-muted)] px-6 py-8 text-center">
                <div className="mb-3 rounded-2xl bg-white p-3 text-[var(--color-primary)] shadow-sm">
                  <ImagePlus size={22} />
                </div>
                <p className="text-sm font-semibold text-[var(--color-gray-800)]">Choose a file or paste an image URL.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <CustomButton type="button" variant="dark" onClick={() => galleryInputRef.current?.click()} className="h-10 rounded-xl px-4 text-sm font-semibold">
                    Upload Gallery
                  </CustomButton>
                  <CustomButton type="button" variant="outline" onClick={() => imageInputRef.current?.click()} className="h-10 rounded-xl px-4 text-sm font-semibold">
                    Upload Cover
                  </CustomButton>
                </div>
                <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handlePrimaryImageUpload} />
              </div>

              <CustomInput
                label="Primary Image URL"
                name="image"
                placeholder="https://example.com/product-image.jpg"
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.image && formik.errors.image}
              />

              <div className="flex gap-3">
                <CustomInput
                  placeholder="Add another gallery image URL"
                  value={galleryValue}
                  onChange={(event) => setGalleryValue(event.target.value)}
                  className="flex-1"
                />
                <CustomButton type="button" variant="outline" onClick={addGalleryImage} className="h-11 rounded-xl px-4">
                  <Plus size={16} />
                  Add
                </CustomButton>
              </div>
            </div>
          </ProductFormSection>

          <ProductFormSection title="Tags">
            <div className="space-y-4">
              <div className="flex gap-3">
                <CustomInput
                  placeholder="Add tags"
                  value={tagValue}
                  onChange={(event) => setTagValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ',') {
                      event.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1"
                />
                <CustomButton type="button" variant="outline" onClick={addTag} className="h-11 rounded-xl px-4">
                  <Plus size={16} />
                  Add
                </CustomButton>
              </div>

              <div className="flex flex-wrap gap-2">
                {formik.values.tags.length > 0 ? (
                  formik.values.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-light)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)]"
                    >
                      <Star size={12} />
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          formik.setFieldValue(
                            'tags',
                            formik.values.tags.filter((currentTag) => currentTag !== tag),
                          )
                        }
                        className="text-[var(--color-primary)]"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[var(--color-gray-500)]">No tags added yet.</p>
                )}
              </div>
            </div>
          </ProductFormSection>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
