import React from 'react';
import { ChevronDown } from 'lucide-react';

const normalizeOptions = (options) =>
  options.map((option) => (typeof option === 'string' ? { label: option, value: option } : option));

const CustomDropdown = ({
  label,
  options = [],
  value,
  onChange,
  error,
  placeholder = 'Select option',
  className = '',
  required = false,
  helperText,
  name,
  ...props
}) => {
  const normalizedOptions = normalizeOptions(options);

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
        className={`control-shell relative group ${
          error ? 'border-[var(--color-danger)] focus-within:shadow-[0_0_0_4px_rgba(241,65,108,0.08)]' : ''
        }`}
      >
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="h-11 w-full appearance-none bg-transparent px-4 pr-11 text-sm font-semibold text-[var(--table-text)] outline-none"
          {...props}
        >
          <option value="">{placeholder}</option>
          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] transition-colors group-focus-within:text-[var(--color-primary)]"
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

export default CustomDropdown;
