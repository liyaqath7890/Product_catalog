import React from 'react';
import { Search } from 'lucide-react';

const CustomSearchBar = ({
  placeholder,
  value,
  onChange,
  className = '',
  shortcutLabel,
  ...props
}) => {
  return (
    <div className={`control-shell relative group ${className}`}>
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] transition-colors group-focus-within:text-[var(--color-primary)]"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-11 w-full bg-transparent pl-12 pr-4 text-sm font-semibold text-[var(--table-text)] outline-none placeholder:text-[var(--color-gray-400)]"
        {...props}
      />
      {shortcutLabel ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-[var(--color-gray-200)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-gray-400)] group-focus-within:hidden">
          {shortcutLabel}
        </div>
      ) : null}
    </div>
  );
};

export default CustomSearchBar;
