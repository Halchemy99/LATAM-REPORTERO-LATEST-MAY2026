'use client';

import React, {
  createContext, useContext, useState, useEffect,
  useCallback, useMemo, useRef
} from 'react';
import { en, es, pt } from './translations';

// ============ I18n Provider ============
// ONE rule: t('Any English string') → translated string.
//
// How it works:
//   1. At startup, walk translations.js and build a pre-warm map:
//      EN leaf value → ES/PT leaf value  (e.g. 'Log In' → 'Iniciar Sesión')
//      Pre-warmed strings translate INSTANTLY — no API call, no flash.
//   2. Dot-notation keys (e.g. t('nav.login')) are also supported as a
//      fast static lookup for legacy callsites.
//   3. Anything not pre-warmed goes to DeepL via /api/translate, cached
//      in localStorage (ltm_rt_es / ltm_rt_pt) so subsequent loads are instant.
//
// Result: switch language → everything changes immediately.

const I18nContext = createContext();

const STATIC_KEY = /^[a-zA-Z_][\w]*(\.[a-zA-Z_][\w-]*)+$/;
const CACHE_PREFIX = 'ltm_rt_';

function loadCache(locale) {
  try { return JSON.parse(localStorage.getItem(CACHE_PREFIX + locale) || '{}'); }
  catch { return {}; }
}

function saveCache(locale, cache) {
  try { localStorage.setItem(CACHE_PREFIX + locale, JSON.stringify(cache)); }
  catch {}
}

// Walk EN and target trees in parallel; build { 'English value': 'Translated value' }
function buildPrewarm(enObj, targetObj) {
  const map = {};
  function walk(e, tgt) {
    if (typeof e === 'string' && typeof tgt === 'string' && e && tgt && e !== tgt) {
      map[e] = tgt;
    } else if (e && tgt && typeof e === 'object' && typeof tgt === 'object') {
      for (const k of Object.keys(e)) {
        if (k in tgt) walk(e[k], tgt[k]);
      }
    }
  }
  walk(enObj, targetObj);
  return map;
}

// Computed once at module load — zero cost at runtime
const PREWARM_ES = buildPrewarm(en, es);
const PREWARM_PT = buildPrewarm(en, pt);

export function I18nProvider({ children }) {
  const [locale, setLocale]     = useState('en');
  const [mounted, setMounted]   = useState(false);
  const [rtCache, setRtCache]   = useState({ es: {}, pt: {} });
  const [translating, setTranslating] = useState(false);

  const queue = useRef(new Set());
  const timer = useRef(null);

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    try {
      // Merge: pre-warm from translations.js + any DeepL strings saved to localStorage
      setRtCache({
        es: { ...PREWARM_ES, ...loadCache('es') },
        pt: { ...PREWARM_PT, ...loadCache('pt') },
      });

      const saved = localStorage.getItem('locale');
      if (saved && ['en', 'es', 'pt'].includes(saved)) {
        setLocale(saved);
      } else {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const LATAM_TZ = [
          'America/Bogota','America/Lima','America/Santiago','America/Buenos_Aires',
          'America/Caracas','America/La_Paz','America/Guayaquil','America/Montevideo',
          'America/Asuncion','America/Mexico_City','America/Managua','America/Costa_Rica',
          'America/Panama','America/Tegucigalpa','America/El_Salvador','America/Guatemala',
          'America/Havana','America/Santo_Domingo','America/Port-au-Prince',
          'America/Puerto_Rico','America/Sao_Paulo','America/Manaus','America/Fortaleza',
        ];
        if (LATAM_TZ.some(z => tz.startsWith(z) || tz === z)) {
          setLocale('es');
        } else {
          const lang = navigator.language?.split('-')[0];
          if (lang === 'es') setLocale('es');
          else if (lang === 'pt') setLocale('pt');
        }
      }
    } catch {}
  }, []);

  // ── DeepL flush ───────────────────────────────────────────────────────────
  const flushQueue = useCallback(async (lang) => {
    if (!queue.current.size || lang === 'en') return;
    const texts = [...queue.current];
    queue.current = new Set();
    setTranslating(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, targetLang: lang }),
      });
      if (!res.ok) return;
      const { translations } = await res.json();
      setRtCache(prev => {
        const updated = { ...prev, [lang]: { ...prev[lang] } };
        texts.forEach((text, i) => { updated[lang][text] = translations[i]; });
        // Only persist runtime-translated strings, not the prewarm
        const prewarm = lang === 'es' ? PREWARM_ES : PREWARM_PT;
        const runtimeOnly = {};
        for (const [k, v] of Object.entries(updated[lang])) {
          if (prewarm[k] !== v) runtimeOnly[k] = v;
        }
        saveCache(lang, runtimeOnly);
        return updated;
      });
    } catch (err) {
      console.warn('Translation fetch failed:', err);
    } finally {
      setTranslating(false);
    }
  }, []);

  const scheduleFlush = useCallback((lang) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => flushQueue(lang), 80);
  }, [flushQueue]);

  // ── Change locale ──────────────────────────────────────────────────────────
  const changeLocale = useCallback((newLocale) => {
    setLocale(newLocale);
    try { localStorage.setItem('locale', newLocale); } catch {}
    queue.current = new Set();
    clearTimeout(timer.current);
  }, []);

  // ── t() — ONE rule ────────────────────────────────────────────────────────
  const t = useCallback((input) => {
    if (!input) return input;

    // Fast path: dot-notation key (backward compat with any t('nav.login') calls)
    if (STATIC_KEY.test(input)) {
      const dict = locale === 'es' ? es : locale === 'pt' ? pt : en;
      const parts = input.split('.');
      let val = dict;
      for (const k of parts) val = val?.[k];
      if (val && typeof val === 'string') return val;
      // key not found → fall through
    }

    // English — return as-is
    if (locale === 'en') return input;

    // Cache hit (pre-warm or previously DeepL-translated) → instant
    if (rtCache[locale]?.[input]) return rtCache[locale][input];

    // Queue for DeepL, show English in the meantime
    queue.current.add(input);
    scheduleFlush(locale);
    return input;
  }, [locale, rtCache, scheduleFlush]);

  const contextValue = useMemo(() => ({
    locale, setLocale: changeLocale, t, translating,
  }), [locale, changeLocale, t, translating]);

  if (!mounted) return <div className="min-h-screen bg-[#F9F6F6]" />;

  return (
    <I18nContext.Provider value={contextValue}>
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
      try {
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
      } catch (e) {
        // localStorage not available
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
        try {
          localStorage.setItem('auth_token', data.token);
        } catch (e) {
          // localStorage not available
        }
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
        try {
          localStorage.setItem('auth_token', data.token);
        } catch (e) {
          // localStorage not available
        }
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
    try {
      localStorage.removeItem('auth_token');
    } catch (e) {
      // localStorage not available
    }
  }, []);

  const isSubscribed = role && ['paid', 'subscriber', 'contributor', 'editor', 'admin'].includes(role);
  const canAccessHumanContent = isSubscribed;
  const canAccessAdminDashboard = role === 'admin';

  const contextValue = useMemo(() => ({
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
  }), [user, role, token, isLoading, login, signup, logout, isSubscribed, canAccessHumanContent, canAccessAdminDashboard]);

  return (
    <UserRoleContext.Provider value={contextValue}>
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
    try {
      const saved = localStorage.getItem('contentMode');
      if (saved) setMode(saved);
    } catch (e) {
      // localStorage not available
    }
  }, []);
  
  const changeMode = useCallback((newMode) => {
    setMode(newMode);
    try {
      localStorage.setItem('contentMode', newMode);
    } catch (e) {
      // localStorage not available
    }
  }, []);

  const contextValue = useMemo(() => ({
    mode,
    setMode: changeMode
  }), [mode, changeMode]);
  
  return (
    <ContentModeContext.Provider value={contextValue}>
      {children}
    </ContentModeContext.Provider>
  );
}

export function useContentMode() {
  const context = useContext(ContentModeContext);
  if (!context) throw new Error('useContentMode must be used within ContentModeProvider');
  return context;
}
