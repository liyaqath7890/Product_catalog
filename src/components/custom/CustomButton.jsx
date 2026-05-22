import React from 'react';

const CustomButton = ({ children, variant = 'primary', onClick, className = '', ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 rounded-[0.95rem] border px-4 py-2.5 text-[13px] font-semibold transition-standard cursor-pointer outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-[1px]";
  
  const variants = {
    primary:
      "app-button-solid text-white focus:ring-[var(--color-primary)]/20 shadow-[0_14px_30px_rgba(15,139,141,0.18)] hover:shadow-[0_18px_34px_rgba(15,139,141,0.24)]",
    outline:
      "app-button-outline bg-white text-[var(--color-primary)] focus:ring-[var(--color-primary)]/10 hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary-active)]",
    light:
      "border-transparent bg-[var(--color-primary-light)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]/10 shadow-[0_10px_22px_rgba(15,139,141,0.08)] hover:bg-[var(--color-primary-light)]/80",
    danger:
      "border-transparent bg-[var(--color-danger)] text-white focus:ring-[var(--color-danger)]/20 shadow-lg shadow-[var(--color-danger)]/15 hover:bg-[var(--color-danger)]/90",
    ghost:
      "border-transparent bg-transparent text-[var(--color-gray-600)] focus:ring-[var(--color-gray-200)] hover:bg-[var(--color-gray-100)]",
    dark:
      "app-button-solid text-white focus:ring-[var(--color-primary)]/20 shadow-[0_14px_30px_rgba(15,139,141,0.18)] hover:shadow-[0_18px_34px_rgba(15,139,141,0.24)]",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`} 
      onClick={onClick} 
      {...props}
    >
      {children}
    </button>
  );
};


export default CustomButton;
