const AUTH_SESSION_KEY = 'catalog.auth.session';
const AUTH_USERS_KEY = 'catalog.auth.users';

const DEFAULT_USERS = [
  {
    id: 1,
    email: 'admin@catalog.app',
    phone: '+91 98765 43210',
    password: 'catalog123',
    name: 'Catalog Admin',
  },
];

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage;
};

export const getStoredUsers = () => {
  const storage = getStorage();
  if (!storage) return DEFAULT_USERS;

  const users = safeParse(storage.getItem(AUTH_USERS_KEY), null);
  if (Array.isArray(users) && users.length > 0) {
    return users;
  }

  storage.setItem(AUTH_USERS_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
};

export const storeUsers = (users) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
};

export const getStoredSession = () => {
  const storage = getStorage();
  if (!storage) return null;
  return safeParse(storage.getItem(AUTH_SESSION_KEY), null);
};

export const storeSession = (session) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(AUTH_SESSION_KEY);
};

export const createUserProfile = ({ email, phone, password }) => {
  const localPart = email.split('@')[0]?.trim() || 'catalog user';
  const name = localPart
    .split(/[.\-_ ]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    id: Date.now(),
    email: email.trim(),
    phone: phone ? phone.trim() : '',
    password: password.trim(),
    name: name || 'Catalog User',
  };
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'CA';

export const maskEmail = (email = '') => {
  const [localPart = '', domain = 'mail.com'] = email.split('@');
  if (!localPart) return `s***@${domain}`;
  const start = localPart.slice(0, 2);
  return `${start}***@${domain}`;
};
