import React from 'react';
import ProductForm from '../../features/product/components/ProductForm';

const CreateEditProductModal = ({ isOpen, onClose, product = null, mode = 'create', onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-[var(--color-dark)]/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl max-h-[95vh] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col bg-white">
        <ProductForm 
          initialValues={product}
          onSubmit={(values) => {
             onSave(values);
             onClose();
          }}
          onCancel={onClose}
          mode={mode}
        />
      </div>
    </div>
  );
};

export default CreateEditProductModal;

