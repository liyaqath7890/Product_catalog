import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MailOpen } from 'lucide-react';
import { maskEmail } from '../api/authStorage';
import AuthBrandPanel from '../components/AuthBrandPanel';
import CustomButton from '../../components/custom/CustomButton';

const CheckEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'support@catalog.app';
  const maskedEmail = location.state?.maskedEmail || maskEmail(email);

  return (
    <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(15,139,141,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_24%),linear-gradient(180deg,#f7fbff_0%,#edf5fb_100%)] px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1400px] overflow-hidden rounded-[2.2rem] border border-[rgba(15,139,141,0.16)] bg-white/90 shadow-[0_30px_90px_rgba(16,42,67,0.12)] backdrop-blur-sm lg:grid-cols-[0.98fr_1.02fr]">
        <AuthBrandPanel variant="check-email" />

        <section className="relative flex min-h-0 items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfd_100%)] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <div className="flex w-full max-w-[540px] flex-col justify-center">
            <div className="rounded-[1.8rem] border border-[var(--table-grid)] bg-white p-4 shadow-[0_18px_50px_rgba(16,42,67,0.08)] sm:p-5 dark:border-white/10 dark:bg-[rgba(10,15,25,0.88)]">
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                      Password reset
                    </p>
                    <h3 className="mt-3 text-[1.95rem] font-bold tracking-tight text-[var(--color-gray-900)] dark:text-white">
                      Check your email
                    </h3>
                  </div>
                  <Link to="/auth/forgot-password" className="text-sm font-semibold text-[var(--color-primary)] transition-standard hover:text-[var(--color-primary-hover)]">
                    Resend
                  </Link>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[linear-gradient(180deg,#4ea3ff_0%,#2e89ef_100%)] text-white shadow-[0_20px_40px_rgba(46,137,239,0.24)]">
                    <MailOpen size={36} />
                  </div>

                  <p className="max-w-md text-sm leading-7 text-[var(--color-gray-500)]">
                    We&apos;ve sent a password reset link to <span className="font-semibold text-[var(--color-gray-800)]">{maskedEmail}</span>.
                  </p>

                  <div className="mt-5 rounded-[1.2rem] bg-[var(--surface-muted)] px-5 py-4 text-sm leading-6 text-[var(--color-gray-600)]">
                    Open the reset link, update your password, then come back to sign in and continue to your dashboard.
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                  <p className="text-sm text-[var(--color-gray-500)]">
                    Didn&apos;t get the email? Check spam or try again.
                  </p>
                  <CustomButton type="button" className="h-9 min-w-[150px] px-4 text-[12px] sm:min-w-[170px]" onClick={() => navigate('/auth/login')}>
                    Back to sign in
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CheckEmailPage;
