import React, { useEffect, useMemo, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomDropdown from '../../../components/custom/CustomDropdown';
import CustomInput from '../../../components/custom/CustomInput';
import CustomTextarea from '../../../components/custom/CustomTextarea';

const SUBCATEGORY_INITIAL_VALUES = {
  name: '',
  categoryId: '',
  description: '',
  status: 'Active',
  image: '',
};

export const createSubcategoryInitialValues = (subcategory) => ({
  ...SUBCATEGORY_INITIAL_VALUES,
  ...subcategory,
  categoryId: subcategory?.categoryId ? String(subcategory.categoryId) : '',
});

const SubcategoryDrawer = ({ isOpen, categories, mode = 'create', subcategory = null, onClose, onSave }) => {
  const [formValues, setFormValues] = useState(SUBCATEGORY_INITIAL_VALUES);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormValues(createSubcategoryInitialValues(subcategory));
  }, [isOpen, subcategory]);

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

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ label: category.name, value: String(category.id) })),
    [categories],
  );

  const updateField = (key, value) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = formValues.name.trim();
    const description = formValues.description.trim();
    const image = formValues.image.trim();

    if (!name || !formValues.categoryId) {
      window.alert('Please enter a subcategory name and select a parent category.');
      return;
    }

    const matchedCategory = categories.find((category) => String(category.id) === String(formValues.categoryId));
    if (!matchedCategory) {
      window.alert('Please select a valid parent category.');
      return;
    }

    onSave({
      ...formValues,
      name,
      description,
      image,
      categoryId: Number(formValues.categoryId),
      categoryName: matchedCategory.name,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-[var(--color-dark)]/35 backdrop-blur-sm" onClick={onClose} />

      <aside className="relative z-10 flex h-full w-full max-w-[540px] flex-col overflow-hidden bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--table-grid)] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-gray-900)]">
              {mode === 'edit' ? 'Edit Subcategory' : 'Add Subcategory'}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-gray-500)]">
              Link each subcategory to a parent category so it can later be assigned to products.
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
          <div className="custom-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto bg-[var(--surface-page)] px-6 py-6">
            <section className="space-y-5 rounded-2xl border border-[var(--table-grid)] bg-white p-5">
              <div className="border-b border-[var(--table-grid)] pb-3">
                <h3 className="text-sm font-semibold tracking-wide text-[var(--color-gray-900)]">Subcategory Details</h3>
              </div>

              <CustomInput
                label="Subcategory Name"
                name="name"
                placeholder="Enter subcategory name"
                value={formValues.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
              />

              <CustomDropdown
                label="Parent Category"
                name="categoryId"
                value={formValues.categoryId}
                onChange={(event) => updateField('categoryId', event.target.value)}
                options={categoryOptions}
                placeholder="Select category"
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

              <CustomInput
                label="Image URL"
                name="image"
                placeholder="https://example.com/subcategory-image.jpg"
                value={formValues.image}
                onChange={(event) => updateField('image', event.target.value)}
              />

              <div className="space-y-2">
                <label className="pl-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">
                  Image Preview
                </label>
                <div className="flex min-h-[170px] items-center justify-center rounded-2xl border border-dashed border-[var(--table-grid)] bg-[var(--surface-muted)] p-5">
                  {formValues.image ? (
                    <img
                      src={formValues.image}
                      alt={formValues.name || 'Subcategory preview'}
                      className="max-h-28 max-w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--color-primary)] shadow-sm">
                        <ImagePlus size={18} />
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-gray-800)]">
                        Subcategory preview appears here
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-gray-500)]">Adding an image is optional.</p>
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
                  onClick={() => updateField('status', formValues.status === 'Active' ? 'Inactive' : 'Active')}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-standard ${
                    formValues.status === 'Active'
                      ? 'border-[#B9F5CC] bg-[#E8FFF3] text-[#0F9F45]'
                      : 'border-[#F1D0D7] bg-[#FFF5F8] text-[#D9214E]'
                  }`}
                >
                  <span>{formValues.status === 'Active' ? 'Subcategory is active' : 'Subcategory is inactive'}</span>
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
              {mode === 'edit' ? 'Save Changes' : 'Create Subcategory'}
            </CustomButton>
          </div>
        </form>
      </aside>
    </div>
  );
};

export default SubcategoryDrawer;
