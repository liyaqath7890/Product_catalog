import React from 'react';
import { BriefcaseBusiness, Mail } from 'lucide-react';
import CustomButton from '../../components/custom/CustomButton';

const options = [
  { label: 'Email', icon: Mail },
  { label: 'Workspace', icon: BriefcaseBusiness },
];

const AuthSocialOptions = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gray-400)]">
        <span className="h-px flex-1 bg-[var(--table-grid)]" />
        <span>Quick Access</span>
        <span className="h-px flex-1 bg-[var(--table-grid)]" />
      </div>

      <div className="flex items-center justify-center gap-3">
        {options.map(({ label, icon: Icon }) => (
          <CustomButton
            key={label}
            type="button"
            variant="outline"
            className="h-10 w-10 rounded-2xl px-0 text-[var(--color-gray-600)] shadow-sm hover:-translate-y-0.5 hover:text-[var(--color-primary)]"
            aria-label={label}
          >
            <Icon size={18} />
          </CustomButton>
        ))}
      </div>
    </div>
  );
};

export default AuthSocialOptions;
