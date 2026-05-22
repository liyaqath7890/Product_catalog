import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDropdown from '../../../components/custom/CustomDropdown';
import CustomInput from '../../../components/custom/CustomInput';
import CustomTextarea from '../../../components/custom/CustomTextarea';
import { useCategoryContext } from '../../../context/CategoryContext';
import { fileToDataUrl } from '../../../utils/fileUtils';

const STATUS_OPTIONS = ['Active', 'Inactive', 'Scheduled'];

const CreateEditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory } = useCategoryContext();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    status: 'Active',
    iconName: 'LayoutGrid',
    image: '',
  });

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const category = categories.find((item) => item.id === parseInt(id, 10));
    if (!category) {
      return;
    }

    setFormData({
      name: category.name || '',
      description: category.description || '',
      slug: category.slug || '',
      status: category.status || 'Active',
      iconName: category.iconName || 'LayoutGrid',
      image: category.image || '',
    });
  }, [categories, id, isEdit]);

  const updateField = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const image = await fileToDataUrl(file);
    updateField('image', image);
  };

  const handleSave = () => {
    if (isEdit) {
      updateCategory({ ...formData, id: parseInt(id, 10) });
    } else {
      addCategory(formData);
    }

    navigate('/categories');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-4 border-b border-[var(--table-grid)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-gray-900)]">
            {isEdit ? 'Edit Category' : 'Create New Category'}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-gray-500)]">
            Add the category details, image, and status in one reusable form.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CustomButton
            type="button"
            variant="outline"
            onClick={() => navigate('/categories')}
            className="h-11 rounded-xl px-5"
          >
            Cancel
          </CustomButton>
          <CustomButton type="button" onClick={handleSave} className="h-11 rounded-xl px-5">
            {isEdit ? 'Update Category' : 'Create Category'}
          </CustomButton>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_320px]">
        <div className="space-y-6">
          <section className="space-y-5 rounded-2xl border border-[var(--table-grid)] bg-white p-6">
            <div className="border-b border-[var(--table-grid)] pb-3">
              <h2 className="text-sm font-semibold tracking-wide text-[var(--color-gray-900)]">Category Details</h2>
            </div>

            <CustomInput
              label="Category Name"
              name="name"
              placeholder="e.g. Shoes, Beauty, Bags"
              value={formData.name}
              onChange={(event) => updateField('name', event.target.value)}
            />

            <CustomInput
              label="Slug"
              name="slug"
              placeholder="e.g. shoes"
              value={formData.slug}
              onChange={(event) => updateField('slug', event.target.value)}
            />

            <CustomTextarea
              label="Description"
              name="description"
              rows={6}
              placeholder="Describe the category and what products belong here"
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="space-y-5 rounded-2xl border border-[var(--table-grid)] bg-white p-6">
            <div className="border-b border-[var(--table-grid)] pb-3">
              <h2 className="text-sm font-semibold tracking-wide text-[var(--color-gray-900)]">Image & Status</h2>
            </div>

            <button
              type="button"
              onClick={() => document.getElementById('category-image-upload')?.click()}
              className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--table-grid)] bg-[var(--surface-muted)] px-5 py-6 text-center transition-standard hover:border-[var(--color-primary)]/30"
            >
              {formData.image ? (
                <img src={formData.image} alt="Category preview" className="h-36 w-full rounded-2xl object-cover" />
              ) : (
                <>
                  <div className="mb-3 rounded-2xl bg-white p-3 text-[var(--color-primary)] shadow-sm">
                    <ImagePlus size={20} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-gray-800)]">Upload category image</p>
                  <p className="mt-1 text-sm text-[var(--color-gray-500)]">PNG, JPG, or WEBP image for the category tile.</p>
                </>
              )}
            </button>

            <input
              id="category-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            <CustomDropdown
              label="Status"
              name="status"
              value={formData.status}
              onChange={(event) => updateField('status', event.target.value)}
              options={STATUS_OPTIONS}
              placeholder="Select status"
            />

            <CustomInput
              label="Fallback Icon"
              name="iconName"
              placeholder="LayoutGrid"
              value={formData.iconName}
              onChange={(event) => updateField('iconName', event.target.value)}
              helperText="Used when no uploaded category image is available."
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreateEditCategory;
