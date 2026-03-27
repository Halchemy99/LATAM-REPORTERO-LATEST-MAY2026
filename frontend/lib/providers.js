'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en, es, pt } from './translations';

// ============ I18n Provider ============
const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      setLocale(savedLocale);
      return;
    }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.startsWith('America/') && !timezone.includes('New_York') && !timezone.includes('Los_Angeles') && !timezone.includes('Chicago')) {
      setLocale('es');
      return;
    }
    const browserLang = navigator.language?.split('-')[0];
    if (browserLang === 'es') setLocale('es');
    else if (browserLang === 'pt') setLocale('pt');
  }, []);

  const changeLocale = useCallback((newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  const t = useCallback((key) => {
    const translations = locale === 'es' ? es : locale === 'pt' ? pt : en;
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) value = value?.[k];
    return value || key;
  }, [locale]);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useTranslation must be used within I18nProvider');
  return context;
}

// ============ User Role Provider (MongoDB + JWT) ============
const UserRoleContext = createContext();

const API_URL = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_BASE_URL || '') : '';

export function UserRoleProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize from stored token
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          const resp = await fetch(`${API_URL}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${storedToken}` }
          });
          if (resp.ok) {
            const data = await resp.json();
            setUser(data.user);
            setRole(data.user.role);
            setToken(storedToken);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const resp = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password })
      });
      
      if (resp.ok) {
        const data = await resp.json();
        setUser(data.user);
        setRole(data.user.role);
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
        return { success: true, user: data.user };
      } else {
        const err = await resp.json();
        return { success: false, error: err.detail || 'Invalid credentials' };
      }
    } catch (err) {
      return { success: false, error: 'Connection error. Please try again.' };
    }
  }, []);

  const signup = useCallback(async (email, password, name) => {
    try {
      const resp = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      if (resp.ok) {
        const data = await resp.json();
        setUser(data.user);
        setRole(data.user.role);
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
        return { success: true, user: data.user };
      } else {
        const err = await resp.json();
        return { success: false, error: err.detail || 'Signup failed' };
      }
    } catch (err) {
      return { success: false, error: 'Connection error. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  }, []);

  const isSubscribed = role && ['paid', 'subscriber', 'contributor', 'editor', 'admin'].includes(role);
  const canAccessHumanContent = isSubscribed;
  const canAccessAdminDashboard = role === 'admin';

  return (
    <UserRoleContext.Provider value={{
      user,
      role,
      token,
      isLoading,
      login,
      signup,
      logout,
      isSubscribed,
      canAccessHumanContent,
      canAccessAdminDashboard
    }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (!context) throw new Error('useUserRole must be used within UserRoleProvider');
  return context;
}

// ============ Content Mode Provider ============
const ContentModeContext = createContext();

export function ContentModeProvider({ children }) {
  const [mode, setMode] = useState('all');
  
  useEffect(() => {
    const saved = localStorage.getItem('contentMode');
    if (saved) setMode(saved);
  }, []);
  
  const changeMode = useCallback((newMode) => {
    setMode(newMode);
    localStorage.setItem('contentMode', newMode);
  }, []);
  
  return (
    <ContentModeContext.Provider value={{ mode, setMode: changeMode }}>
      {children}
    </ContentModeContext.Provider>
  );
}

export function useContentMode() {
  const context = useContext(ContentModeContext);
  if (!context) throw new Error('useContentMode must be used within ContentModeProvider');
  return context;
}
