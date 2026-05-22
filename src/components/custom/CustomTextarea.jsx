import React from 'react';

const CustomTextarea = ({
  label,
  error,
  helperText,
  className = '',
  required = false,
  name,
  rows = 4,
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label ? (
        <label
          htmlFor={name}
          className="pl-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)] flex items-center gap-1"
        >
          {label}
          {required ? <span className="text-[var(--color-danger)]">*</span> : null}
        </label>
      ) : null}

      <div
        className={`control-shell ${
          error ? 'border-[var(--color-danger)] focus-within:shadow-[0_0_0_4px_rgba(241,65,108,0.08)]' : ''
        }`}
      >
        <textarea
          id={name}
          name={name}
          rows={rows}
          className="w-full resize-none bg-transparent px-4 py-3 text-sm font-medium text-[var(--table-text)] outline-none placeholder:text-[var(--color-gray-400)]"
          {...props}
        />
      </div>

      {error ? (
        <p className="pl-1 text-[11px] font-semibold text-[var(--color-danger)]">{error}</p>
      ) : helperText ? (
        <p className="pl-1 text-[11px] text-[var(--color-gray-500)]">{helperText}</p>
      ) : null}
    </div>
  );
};

export default CustomTextarea;
