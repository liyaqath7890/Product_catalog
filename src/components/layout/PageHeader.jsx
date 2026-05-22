import React from 'react';
import { ArrowLeft } from 'lucide-react';
import CustomButton from '../custom/CustomButton';

const PageHeader = ({
  title,
  description,
  backLabel = 'Back',
  onBack,
  actions,
  eyebrow,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`}>
      <div className="flex min-w-0 items-start gap-3">
        {onBack ? (
          <CustomButton
            type="button"
            variant="outline"
            onClick={onBack}
            aria-label={backLabel}
            title={backLabel}
            className="h-11 w-11 shrink-0 rounded-xl px-0 text-sm font-semibold normal-case tracking-normal"
          >
            <ArrowLeft size={18} />
          </CustomButton>
        ) : null}

        <div className="min-w-0 space-y-1">
          {eyebrow ? (
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--color-gray-400)]">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-gray-900)]">{title}</h1>
          {description ? <p className="max-w-2xl text-sm leading-6 text-[var(--color-gray-500)]">{description}</p> : null}
        </div>
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-3 sm:justify-end">{actions}</div> : null}
    </div>
  );
};

export default PageHeader;
