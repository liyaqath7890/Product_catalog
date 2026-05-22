import React from 'react';
import { Sparkles } from 'lucide-react';
import AppLogo from '../../components/layout/AppLogo';
import CatalogShowcase from './CatalogShowcase';

const BRAND_COPY = {
  signin: {
    badge: 'Catalog Admin',
    title: 'Welcome Back!',
    description: 'Manage products, categories, brands, and inventory in one place.',
  },
  signup: {
    badge: 'Catalog Admin',
    title: 'Create Your Account',
    description: 'Set up your product catalog workspace in a few quick steps.',
  },
  forgot: {
    badge: 'Password Reset',
    title: 'Reset Your Password',
    description: 'Request a secure reset link and get back into your catalog account.',
  },
  'check-email': {
    badge: 'Email Sent',
    title: 'Check Your Inbox',
    description: 'Open the reset link we sent to continue back to the dashboard.',
  },
};

const AuthBrandPanel = ({ variant = 'signin' }) => {
  const copy = BRAND_COPY[variant] || BRAND_COPY.signin;

  return (
    <section className="relative hidden overflow-hidden bg-[linear-gradient(155deg,#0f8b8d_0%,#0f9ba0_38%,#18b6cf_74%,#b8f4ef_120%)] px-4 py-4 text-white sm:px-6 sm:py-5 lg:flex lg:min-h-0 lg:flex-col lg:justify-center lg:px-6 lg:py-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_25%),linear-gradient(180deg,rgba(5,45,68,0.08)_0%,transparent_35%,rgba(5,45,68,0.12)_100%)]" />
      <div className="relative mx-auto flex w-full max-w-[500px] flex-col gap-2 lg:mx-0 lg:max-w-[480px]">
        <div className="inline-flex w-fit rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm shadow-[0_16px_30px_rgba(5,45,68,0.12)]">
          <AppLogo compact />
        </div>

        <div className="max-w-xl space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
            <Sparkles size={13} />
            {copy.badge}
          </div>
          <h2 className="text-[1.8rem] font-bold tracking-tight text-white sm:text-[2.3rem]">
            {copy.title}
          </h2>
          <p className="max-w-lg text-sm leading-7 text-white/88">{copy.description}</p>
        </div>

        <div className="pt-0">
          <CatalogShowcase compact />
        </div>
      </div>
    </section>
  );
};

export default AuthBrandPanel;
