import React, { useEffect, useMemo, useState } from 'react';
import {
  Gem,
  Headphones,
  Heart,
  Laptop,
  LayoutGrid,
  ShoppingBag,
  Shirt,
  Smartphone,
  Sparkles,
  Speaker,
  Tablet,
  Watch,
  X,
} from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDropdown from '../../../components/custom/CustomDropdown';
import CustomInput from '../../../components/custom/CustomInput';
import CustomTextarea from '../../../components/custom/CustomTextarea';

const CATEGORY_INITIAL_VALUES = {
  name: '',
  description: '',
  slug: '',
  status: 'Active',
  iconName: 'LayoutGrid',
  image: '',
};

const ICON_COMPONENTS = {
  Laptop,
  Smartphone,
  Speaker,
  Watch,
  Tablet,
  Headphones,
  LayoutGrid,
  Gem,
  Shirt,
  Sparkles,
  ShoppingBag,
  Heart,
  Handbag: ShoppingBag,
};

const ICON_OPTIONS = [
  'LayoutGrid',
  'Gem',
  'Shirt',
  'Sparkles',
  'ShoppingBag',
  'Heart',
  'Laptop',
  'Smartphone',
  'Speaker',
  'Watch',
  'Tablet',
  'Headphones',
  'Handbag',
];

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const createCategoryInitialValues = (category) => ({
  ...CATEGORY_INITIAL_VALUES,
  ...category,
});

const CategoryDrawer = ({ isOpen, mode = 'create', category = null, onClose, onSave }) => {
  const [formValues, setFormValues] = useState(CATEGORY_INITIAL_VALUES);
  const [isSlugDirty, setIsSlugDirty] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormValues(createCategoryInitialValues(category));
    setIsSlugDirty(Boolean(category?.slug));
  }, [category, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'unset';
      return undefined;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const previewIconName = formValues.iconName || 'LayoutGrid';
  const PreviewIcon = useMemo(
    () => ICON_COMPONENTS[previewIconName] || LayoutGrid,
    [previewIconName],
  );

  const updateField = (key, value) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const handleNameChange = (event) => {
    const nextName = event.target.value;
    setFormValues((current) => ({
      ...current,
      name: nextName,
      slug: !isSlugDirty ? slugify(nextName) : current.slug,
    }));
  };

  const handleSlugChange = (event) => {
    setIsSlugDirty(true);
    updateField('slug', slugify(event.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = formValues.name.trim();
    const slug = slugify(formValues.slug || formValues.name);
    const description = formValues.description.trim();
    const image = formValues.image.trim();
    const iconName = formValues.iconName || 'LayoutGrid';

    if (!name || !slug) {
      window.alert('Please enter a category name and slug.');
      return;
    }

    onSave({
      ...formValues,
      name,
      slug,
      description,
      image,
      iconName,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-[var(--color-dark)]/35 backdrop-blur-sm" onClick={onClose} />

      <aside className="relative z-10 flex h-full w-full max-w-[560px] flex-col overflow-hidden bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--table-grid)] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-gray-900)]">
              {mode === 'edit' ? 'Edit Category' : 'Create Category'}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-gray-500)]">
              Add the main category details in the same right-side flow used for subcategories.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-700)]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto bg-[var(--surface-page)] px-6 py-6 custom-scrollbar">
            <section className="space-y-5 rounded-2xl border border-[var(--table-grid)] bg-white p-5">
              <div className="border-b border-[var(--table-grid)] pb-3">
                <h3 className="text-sm font-semibold tracking-wide text-[var(--color-gray-900)]">Category Details</h3>
              </div>

              <CustomInput
                label="Category Name"
                name="name"
                placeholder="Enter category name"
                value={formValues.name}
                onChange={handleNameChange}
                required
              />

              <CustomInput
                label="Slug"
                name="slug"
                placeholder="category-slug"
                value={formValues.slug}
                onChange={handleSlugChange}
                helperText="The slug is generated from the name, but you can adjust it."
                required
              />

              <CustomTextarea
                label="Description"
                name="description"
                rows={4}
                placeholder="Write a short description"
                value={formValues.description}
                onChange={(event) => updateField('description', event.target.value)}
              />

              <CustomDropdown
                label="Fallback Icon"
                name="iconName"
                value={formValues.iconName}
                onChange={(event) => updateField('iconName', event.target.value)}
                options={ICON_OPTIONS}
                placeholder="Select icon"
                required
              />

              <CustomInput
                label="Image URL"
                name="image"
                placeholder="https://example.com/category-image.jpg"
                value={formValues.image}
                onChange={(event) => updateField('image', event.target.value)}
              />

              <div className="space-y-2">
                <label className="pl-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">
                  Preview
                </label>
                <div className="flex min-h-[190px] items-center justify-center rounded-2xl border border-dashed border-[var(--table-grid)] bg-[var(--surface-muted)] p-5">
                  {formValues.image ? (
                    <img
                      src={formValues.image}
                      alt={formValues.name || 'Category preview'}
                      className="max-h-36 max-w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--color-primary)] shadow-sm">
                        <PreviewIcon size={22} />
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-gray-800)]">Category preview appears here</p>
                      <p className="mt-1 text-sm text-[var(--color-gray-500)]">
                        Add an image or use the fallback icon.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="pl-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">
                  Status
                </label>

                <button
                  type="button"
                  onClick={() =>
                    updateField('status', formValues.status === 'Active' ? 'Inactive' : 'Active')
                  }
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-standard ${
                    formValues.status === 'Active'
                      ? 'border-[#B9F5CC] bg-[#E8FFF3] text-[#0F9F45]'
                      : 'border-[#F1D0D7] bg-[#FFF5F8] text-[#D9214E]'
                  }`}
                >
                  <span>{formValues.status === 'Active' ? 'Category is active' : 'Category is inactive'}</span>
                  <span
                    className={`relative h-6 w-11 rounded-full transition-standard ${
                      formValues.status === 'Active' ? 'bg-[#17C653]' : 'bg-[var(--color-gray-300)]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-standard ${
                        formValues.status === 'Active' ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </span>
                </button>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[var(--table-grid)] bg-white px-6 py-4">
            <CustomButton type="button" variant="outline" onClick={onClose} className="h-11 rounded-xl px-5">
              Cancel
            </CustomButton>
            <CustomButton type="submit" className="h-11 rounded-xl px-5">
              {mode === 'edit' ? 'Save Changes' : 'Create Category'}
            </CustomButton>
          </div>
        </form>
      </aside>
    </div>
  );
};

export default CategoryDrawer;
