import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react';
import CustomButton from '../../components/custom/CustomButton';
import InputField from './InputField';

const AuthCard = ({
  mode,
  values,
  onChange,
  onSubmit,
  loading,
  passwordVisible,
  onTogglePasswordVisibility,
  errors = {},
}) => {
  const isSignin = mode === 'signin';
  const alternateRoute = isSignin ? '/auth/sign-up' : '/auth/login';
  const alternateLabel = isSignin ? 'Create account' : 'Sign in';

  return (
    <div className="rounded-[1.8rem] border border-[var(--table-grid)] bg-white p-4 shadow-[0_18px_50px_rgba(16,42,67,0.08)] sm:p-5 dark:border-white/10 dark:bg-[rgba(10,15,25,0.88)]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              Secure access
            </p>
            <h3 className="mt-3 text-[1.95rem] font-bold tracking-tight text-[var(--color-gray-900)] dark:text-white">
              {isSignin ? 'Sign In' : 'Create Account'}
            </h3>
          </div>
          <Link to={alternateRoute} className="text-sm font-semibold text-[var(--color-primary)] transition-standard hover:text-[var(--color-primary-hover)]">
            {alternateLabel}
          </Link>
        </div>

        <form key={mode} onSubmit={onSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {isSignin ? (
            <>
              <InputField
                label="Email"
                name="signinEmail"
                type="email"
                value={values.email}
                onChange={(event) => onChange('email', event.target.value)}
                icon={Mail}
                autoComplete="email"
                required
                error={errors.email}
              />

              <InputField
                label="Password"
                name="signinPassword"
                type={passwordVisible ? 'text' : 'password'}
                value={values.password}
                onChange={(event) => onChange('password', event.target.value)}
                icon={Lock}
                autoComplete="current-password"
                required
                error={errors.password}
                rightElement={
                  <button
                    type="button"
                    onClick={onTogglePasswordVisibility}
                    className="rounded-full p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  >
                    {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <div className="flex flex-col gap-3 rounded-[1.2rem] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--color-gray-600)] sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    checked={values.rememberMe}
                    onChange={(event) => onChange('rememberMe', event.target.checked)}
                    className="h-4 w-4 rounded border-[var(--color-gray-300)] accent-[var(--color-primary)]"
                  />
                  Keep me signed in
                </label>
                <Link to="/auth/forgot-password" className="text-sm font-semibold text-[var(--color-primary)]">
                  Forgot password?
                </Link>
              </div>
            </>
          ) : (
            <>
              <InputField
                label="Name"
                name="signupName"
                type="text"
                value={values.name}
                onChange={(event) => onChange('name', event.target.value)}
                icon={User}
                autoComplete="name"
                required
                error={errors.name}
              />

              <InputField
                label="Email"
                name="signupEmail"
                type="email"
                value={values.email}
                onChange={(event) => onChange('email', event.target.value)}
                icon={Mail}
                autoComplete="email"
                required
                error={errors.email}
              />

              <InputField
                label="Password"
                name="signupPassword"
                type={passwordVisible ? 'text' : 'password'}
                value={values.password}
                onChange={(event) => onChange('password', event.target.value)}
                icon={Lock}
                autoComplete="new-password"
                required
                error={errors.password}
                rightElement={
                  <button
                    type="button"
                    onClick={onTogglePasswordVisibility}
                    className="rounded-full p-2 text-[var(--color-gray-400)] transition-standard hover:bg-[var(--surface-muted)] hover:text-[var(--color-primary)]"
                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  >
                    {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <InputField
                label="Confirm Password"
                name="signupConfirmPassword"
                type={passwordVisible ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={(event) => onChange('confirmPassword', event.target.value)}
                icon={Lock}
                autoComplete="new-password"
                required
                error={errors.confirmPassword}
              />
            </>
          )}

          <div className="flex items-center justify-between gap-4 pt-1">
            <p className="text-sm text-[var(--color-gray-500)]">
              {isSignin ? 'Open the dashboard securely.' : 'Create a clean, catalog-ready admin profile.'}
            </p>
            <CustomButton type="submit" className="h-9 min-w-[132px] px-4 text-[12px] sm:min-w-[148px]" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isSignin ? 'Signing In' : 'Creating...'}
                </>
              ) : (
                <>
                  {isSignin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthCard;
