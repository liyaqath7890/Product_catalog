import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ProductForm from './ProductForm';

const ProductFormModal = ({ isOpen, onClose, product = null, mode = 'create', onSave }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-[var(--color-dark)]/45 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-[860px] flex-col overflow-hidden bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-[var(--table-grid)] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-gray-900)]">
              {mode === 'edit' ? 'Edit Product' : 'New Product'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-gray-700)]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[var(--surface-page)] p-6 custom-scrollbar">
          <ProductForm
            initialValues={product}
            mode={mode}
            onCancel={onClose}
            onSubmit={(values) => {
              onSave(values);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
