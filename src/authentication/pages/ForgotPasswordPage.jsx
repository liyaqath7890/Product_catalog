import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Mail } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import AuthBrandPanel from '../components/AuthBrandPanel';
import CustomButton from '../../components/custom/CustomButton';
import InputField from '../components/InputField';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setError('');
    setLoading(true);

    window.setTimeout(() => {
      const resetRequest = requestPasswordReset({ email });
      navigate('/auth/check-email', { state: resetRequest });
      setLoading(false);
    }, 450);
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(15,139,141,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_24%),linear-gradient(180deg,#f7fbff_0%,#edf5fb_100%)] px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1400px] overflow-hidden rounded-[2.2rem] border border-[rgba(15,139,141,0.16)] bg-white/90 shadow-[0_30px_90px_rgba(16,42,67,0.12)] backdrop-blur-sm lg:grid-cols-[0.98fr_1.02fr]">
        <AuthBrandPanel variant="forgot" />

        <section className="relative flex min-h-0 items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfd_100%)] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <div className="flex w-full max-w-[540px] flex-col justify-center">
            <div className="rounded-[1.8rem] border border-[var(--table-grid)] bg-white p-4 shadow-[0_18px_50px_rgba(16,42,67,0.08)] sm:p-5 dark:border-white/10 dark:bg-[rgba(10,15,25,0.88)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
                      Password reset
                    </p>
                    <h3 className="mt-3 text-[1.95rem] font-bold tracking-tight text-[var(--color-gray-900)] dark:text-white">
                      Forgot Password?
                    </h3>
                  </div>
                  <Link to="/auth/login" className="text-sm font-semibold text-[var(--color-primary)] transition-standard hover:text-[var(--color-primary-hover)]">
                    Back to sign in
                  </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <InputField
                    label="Email"
                    name="forgotEmail"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    icon={Mail}
                    autoComplete="email"
                    required
                    error={error}
                    hint="We will send a reset link to this inbox."
                  />

                  <div className="rounded-[1.2rem] bg-[var(--surface-muted)] px-4 py-3 text-sm leading-6 text-[var(--color-gray-600)]">
                    Enter the email linked to your catalog admin account and we&apos;ll send a secure link to set a new password.
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1">
                    <p className="text-sm text-[var(--color-gray-500)]">
                      Use the link in your inbox to continue.
                    </p>
                    <CustomButton type="submit" className="h-9 min-w-[150px] px-4 text-[12px] sm:min-w-[170px]" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send reset link'
                      )}
                    </CustomButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
