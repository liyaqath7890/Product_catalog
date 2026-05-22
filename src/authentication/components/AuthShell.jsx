import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppLogo from '../../components/layout/AppLogo';
import AuthSidePanel from './AuthSidePanel';
import CatalogShowcase from './CatalogShowcase';

const AuthShell = ({
  title,
  description,
  children,
  helper,
  panelTitle,
  panelDescription,
  panelActionLabel,
  panelActionTo,
  footnote,
  topLinkLabel,
  topLinkTo,
}) => {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(15,139,141,0.11),transparent_26%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.08),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#edf5fb_100%)] px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1320px] overflow-hidden rounded-[2.2rem] border border-[rgba(15,139,141,0.16)] bg-white/95 shadow-[0_30px_90px_rgba(16,42,67,0.12)] backdrop-blur-sm lg:grid-cols-[0.72fr_1.28fr]">
        <AuthSidePanel
          align="left"
          title={panelTitle}
          description={panelDescription}
          actionLabel={panelActionLabel}
          actionTo={panelActionTo}
          footnote={footnote}
        />

        <section className="flex min-h-0 items-start justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfd_100%)] px-4 py-4 sm:px-6 sm:py-5 lg:order-2 lg:px-8 lg:pt-6">
          <div className="w-full max-w-[500px] space-y-4 sm:space-y-5">
            <div className="lg:hidden">
              <Link to="/auth/login" className="inline-flex">
                <div className="rounded-2xl border border-[var(--table-grid)] bg-white px-4 py-3 shadow-sm">
                  <AppLogo compact />
                </div>
              </Link>
            </div>

            <div className="space-y-3">
              {topLinkLabel && topLinkTo ? (
                <div className="flex justify-end">
                  <Link
                    to={topLinkTo}
                    className="text-sm font-semibold text-[var(--color-primary)] transition-standard hover:text-[var(--color-primary-active)]"
                  >
                    {topLinkLabel}
                  </Link>
                </div>
              ) : null}
              <div className="rounded-[1.35rem] border border-[var(--table-grid)] bg-white px-5 py-4 shadow-sm">
                <h2 className="text-[1.55rem] font-bold tracking-tight text-[var(--color-gray-900)] sm:text-[2rem]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-gray-500)]">{description}</p>
              </div>
            </div>

            <div className="lg:hidden">
              <CatalogShowcase compact />
            </div>

            <div className="rounded-[1.7rem] border border-[var(--table-grid)] bg-white/92 p-4 shadow-[0_18px_40px_rgba(16,42,67,0.06)] sm:p-6">
              <div className="space-y-4">{children}</div>
            </div>

            {helper ? <div className="text-center text-sm text-[var(--color-gray-500)]">{helper}</div> : null}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthShell;
