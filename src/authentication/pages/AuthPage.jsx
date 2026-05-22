import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import AuthBrandPanel from '../components/AuthBrandPanel';
import AuthCard from '../components/AuthCard';

const AuthPage = ({ initialMode = 'signin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: true,
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.email.trim()) nextErrors.email = 'Email is required';
    if (!values.password.trim()) nextErrors.password = 'Password is required';

    if (mode === 'signup') {
      if (!values.name.trim()) nextErrors.name = 'Name is required';
      if (values.password !== values.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      if (mode === 'signin') {
        login({ email: values.email, password: values.password });
        navigate(location.state?.from || '/', { replace: true });
      } else {
        signup({ email: values.email, password: values.password });
        navigate('/', { replace: true });
      }
      setLoading(false);
    }, 450);
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(15,139,141,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_24%),linear-gradient(180deg,#f7fbff_0%,#edf5fb_100%)] px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1400px] overflow-hidden rounded-[2.2rem] border border-[rgba(15,139,141,0.16)] bg-white/90 shadow-[0_30px_90px_rgba(16,42,67,0.12)] backdrop-blur-sm lg:grid-cols-[0.98fr_1.02fr]">
        <AuthBrandPanel variant={mode === 'signup' ? 'signup' : 'signin'} />

        <section className="relative flex min-h-0 items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfd_100%)] px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <div className="flex w-full max-w-[540px] flex-col justify-center">
            <AuthCard
              mode={mode}
              values={values}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
              passwordVisible={showPassword}
              onTogglePasswordVisibility={() => setShowPassword((current) => !current)}
              errors={errors}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
