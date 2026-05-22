import React from 'react';

const CustomInput = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  className = '',
  required = false,
  name,
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="pl-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)] flex items-center gap-1"
        >
          {label}
          {required && <span className="text-[var(--color-danger)]">*</span>}
        </label>
      )}
      <div
        className={`control-shell relative group ${
          error ? 'border-[var(--color-danger)] focus-within:shadow-[0_0_0_4px_rgba(241,65,108,0.08)]' : ''
        }`}
      >
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] group-focus-within:text-[var(--color-primary)] transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-11 w-full bg-transparent ${Icon ? 'pl-11 pr-4' : 'px-4'} text-sm font-semibold text-[var(--table-text)] outline-none placeholder:text-[var(--color-gray-400)]`}
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


export default CustomInput;
