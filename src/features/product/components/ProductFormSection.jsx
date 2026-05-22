import React from 'react';

const ProductFormSection = ({ title, action, children, className = '' }) => {
  return (
    <section className={`space-y-4 rounded-[1.35rem] border border-[var(--table-grid)] bg-white/95 p-4 md:p-5 ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-[var(--table-grid)] pb-2.5">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--color-gray-900)]">{title}</h2>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
};

export default ProductFormSection;
