import React, { useEffect, useState } from 'react';
import { Scale, X } from 'lucide-react';
import CustomButton from '../../../components/custom/CustomButton';
import CustomInput from '../../../components/custom/CustomInput';
import CustomTextarea from '../../../components/custom/CustomTextarea';
import { generateUnitCode } from '../utils/unitCodeUtils';

const UNIT_INITIAL_STATE = {
  name: '',
  shortCode: '',
  usedIn: '',
  description: '',
  status: 'Active',
};

export const createUnitInitialValues = (unit) => ({
  ...UNIT_INITIAL_STATE,
  ...unit,
});

const UnitDrawer = ({ isOpen, mode = 'create', unit = null, onClose, onSave }) => {
  const [formValues, setFormValues] = useState(UNIT_INITIAL_STATE);
  const isViewMode = mode === 'view';

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormValues(createUnitInitialValues(unit));
  }, [isOpen, unit]);

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

  const updateField = (key, value) => {
    setFormValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isViewMode) {
      onClose?.();
      return;
    }

    const name = formValues.name.trim();
    const shortCode = generateUnitCode(formValues.name);
    const usedIn = formValues.usedIn.trim();
    const description = formValues.description.trim();

    if (!name || !usedIn) {
      window.alert('Please fill in unit name and used in fields.');
      return;
    }

    onSave({
      ...formValues,
      name,
      shortCode,
      usedIn,
      description,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-[var(--color-dark)]/35 backdrop-blur-sm" onClick={onClose} />

      <aside className="relative z-10 flex h-full w-full max-w-[520px] flex-col overflow-hidden bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--table-grid)] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-gray-900)]">
              {mode === 'edit' ? 'Edit Unit' : isViewMode ? 'View Unit' : 'Add Unit'}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-gray-500)]">
              {isViewMode
                ? 'Review the unit details in read-only mode.'
                : 'Create or update the unit details from this side drawer.'}
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
                <h3 className="text-sm font-semibold tracking-wide text-[var(--color-gray-900)]">Unit Details</h3>
              </div>

              <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-[var(--table-grid)] bg-[var(--surface-muted)] p-6">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--color-primary)] shadow-sm">
                    <Scale size={18} />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-gray-800)]">Unit configuration</p>
                </div>
              </div>

              <CustomInput
                label="Unit Name"
                name="name"
                placeholder="Enter unit name"
                value={formValues.name}
                onChange={(event) => {
                  if (isViewMode) return;
                  const value = event.target.value;
                  updateField('name', value);
                  updateField('shortCode', generateUnitCode(value));
                }}
                readOnly={isViewMode}
                required
              />

              <div className="grid gap-5 md:grid-cols-2">
                <CustomInput
                  label="Code"
                  name="shortCode"
                  placeholder="Auto generated"
                  value={generateUnitCode(formValues.name)}
                  readOnly
                  helperText="Auto-generated from the unit name."
                />
                <CustomInput
                  label="Used In"
                  name="usedIn"
                  placeholder="Shoes"
                  value={formValues.usedIn}
                  onChange={(event) => updateField('usedIn', event.target.value)}
                  readOnly={isViewMode}
                  required
                />
              </div>

              <CustomTextarea
                label="Description"
                name="description"
                rows={4}
                placeholder="Write a short note about where this unit is used"
                value={formValues.description}
                onChange={(event) => updateField('description', event.target.value)}
                readOnly={isViewMode}
              />

              <div className="space-y-2">
                <label className="pl-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">
                  Status
                </label>

                <button
                  type="button"
                  onClick={() => {
                    if (isViewMode) return;
                    updateField('status', formValues.status === 'Active' ? 'Inactive' : 'Active');
                  }}
                  disabled={isViewMode}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-standard ${
                    formValues.status === 'Active'
                      ? 'border-[#B9F5CC] bg-[#E8FFF3] text-[#0F9F45]'
                      : 'border-[#F1D0D7] bg-[#FFF5F8] text-[#D9214E]'
                  }`}
                >
                  <span>{formValues.status === 'Active' ? 'Unit is active' : 'Unit is inactive'}</span>
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
              {isViewMode ? 'Close' : 'Cancel'}
            </CustomButton>
            {!isViewMode ? (
              <CustomButton type="submit" className="h-11 rounded-xl px-5">
                {mode === 'edit' ? 'Save Changes' : 'Create Unit'}
              </CustomButton>
            ) : null}
          </div>
        </form>
      </aside>
    </div>
  );
};

export default UnitDrawer;
