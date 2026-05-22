import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import CheckEmailPage from '../pages/CheckEmailPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="sign-in" element={<LoginPage />} />
      <Route path="sign-up" element={<SignupPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="check-email" element={<CheckEmailPage />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default AuthRoutes;
