import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  clearStoredSession,
  createUserProfile,
  getInitials,
  getStoredSession,
  getStoredUsers,
  maskEmail,
  storeSession,
  storeUsers,
} from '../api/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStoredSession());

  const login = useCallback(({ email, phone = '', password }) => {
    const users = getStoredUsers();
    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password.trim() &&
        (!phone || user.phone.trim() === phone.trim()),
    );

    const activeUser = existingUser || createUserProfile({ email, phone, password });
    const nextSession = {
      user: {
        id: activeUser.id,
        email: activeUser.email,
        phone: activeUser.phone,
        name: activeUser.name,
        initials: getInitials(activeUser.name),
      },
      authenticatedAt: new Date().toISOString(),
    };

    storeSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }, []);

  const signup = useCallback(({ email, phone = '', password }) => {
    const users = getStoredUsers();
    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() || (phone && user.phone.trim() === phone.trim()),
    );

    const registeredUser = existingUser || createUserProfile({ email, phone, password });
    const nextUsers = existingUser
      ? users.map((user) =>
          user.id === existingUser.id
            ? { ...user, email: email.trim(), phone: phone.trim() || user.phone || '', password: password.trim() }
            : user,
        )
      : [registeredUser, ...users];

    storeUsers(nextUsers);
    return login({ email, phone, password });
  }, [login]);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  const requestPasswordReset = useCallback(({ email, phone = '' }) => {
    const users = getStoredUsers();
    const matchedUser =
      users.find(
        (user) =>
          user.email.toLowerCase() === email.trim().toLowerCase() || (phone && user.phone.trim() === phone.trim()),
      ) || createUserProfile({ email, phone, password: 'catalog123' });

    return {
      email: matchedUser.email || email.trim(),
      maskedEmail: maskEmail(matchedUser.email || email.trim()),
    };
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      isAuthenticated: Boolean(session?.user),
      login,
      signup,
      logout,
      requestPasswordReset,
    }),
    [session, login, signup, logout, requestPasswordReset],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
