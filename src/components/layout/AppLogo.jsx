import React from 'react';

const AppLogo = ({ collapsed = false, compact = false }) => {
  const iconSize = compact ? 'h-9 w-9 rounded-xl' : 'h-10 w-10 rounded-2xl';
  const textSize = compact ? 'text-base' : 'text-lg';

  return (
    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
      <div
        className={`relative flex ${iconSize} items-center justify-center border border-[var(--color-primary-border)] bg-[var(--color-primary-light)] text-[var(--color-primary)]`}
      >
        <span className="absolute left-[10px] h-4 w-1.5 rounded-full bg-current opacity-90" />
        <span className="absolute left-[16px] h-5 w-1.5 rounded-full bg-current" />
        <span className="absolute left-[22px] h-4 w-1.5 rounded-full bg-current opacity-75" />
      </div>
      {!collapsed ? (
        <div className="min-w-0">
          <span className={`block font-bold tracking-tight text-[var(--color-gray-900)] ${textSize}`}>Catalog</span>
        </div>
      ) : null}
    </div>
  );
};

export default AppLogo;
