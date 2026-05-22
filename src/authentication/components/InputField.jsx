import React from 'react';

const InputField = ({
  label,
  icon: Icon,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = ' ',
  autoComplete,
  required = false,
  rightElement,
  hint,
  error,
}) => {
  const hasIcon = Boolean(Icon);
  const hasRightElement = Boolean(rightElement);

  return (
    <div className="space-y-2">
      <div className="relative">
        {hasIcon ? (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] transition-standard peer-focus-within:text-[var(--color-primary)]">
            <Icon size={18} />
          </div>
        ) : null}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          className={`peer h-14 w-full rounded-[1rem] border border-[var(--table-grid)] bg-white px-4 pt-5 text-[15px] font-medium text-[var(--color-gray-900)] outline-none transition-standard placeholder-transparent focus:border-[var(--color-primary)] focus:shadow-[0_0_0_4px_rgba(15,139,141,0.12)] dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-[var(--color-primary)] ${
            hasIcon ? 'pl-11' : 'pl-4'
          } ${hasRightElement ? 'pr-12' : 'pr-4'} ${error ? 'border-[var(--color-danger)]' : ''}`}
        />

        <label
          htmlFor={name}
          className={`pointer-events-none absolute ${hasIcon ? 'left-11' : 'left-4'} top-3 text-[11px] font-semibold tracking-[0.08em] text-[var(--color-gray-500)] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-[var(--color-gray-400)] peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:tracking-[0.08em] peer-focus:text-[var(--color-primary)]`}
        >
          {label}
        </label>

        {hasRightElement ? <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div> : null}
      </div>

      {hint ? <p className="pl-1 text-xs text-[var(--color-gray-500)]">{hint}</p> : null}
      {error ? <p className="pl-1 text-xs font-medium text-[var(--color-danger)]">{error}</p> : null}
    </div>
  );
};

export default InputField;
