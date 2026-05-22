import React from 'react';

const AuthInputField = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon: Icon,
  name,
  required = false,
  helperText,
}) => {
  return (
    <div className="space-y-2.5">
      <label
        htmlFor={name}
        className="pl-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-gray-500)]"
      >
        {label}
        {required ? <span className="ml-1 text-[var(--color-danger)]">*</span> : null}
      </label>

      <div className="auth-field-shell group">
        <div className="auth-field-inner">
          {Icon ? (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] transition-colors group-focus-within:text-[#ff9b67]">
              <Icon size={18} />
            </div>
          ) : null}
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`h-11 w-full rounded-[1.15rem] border-none bg-transparent text-sm font-semibold text-[var(--table-text)] outline-none placeholder:text-[var(--color-gray-400)] sm:h-[52px] ${
              Icon ? 'pl-11 pr-4' : 'px-4'
            }`}
            required={required}
          />
        </div>
      </div>

      {helperText ? <p className="pl-1 text-xs text-[var(--color-gray-500)]">{helperText}</p> : null}
    </div>
  );
};

export default AuthInputField;
