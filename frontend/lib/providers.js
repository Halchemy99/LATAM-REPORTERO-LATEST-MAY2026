'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en, es, pt } from './translations';
import { createClient } from './supabase/client';
import { demoUsers } from './mock-data';

// ============ I18n Provider ============
const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-detect language
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale) {
      setLocale(savedLocale);
      return;
    }

    // Check timezone for Latin America
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.startsWith('America/') && !timezone.includes('New_York') && !timezone.includes('Los_Angeles') && !timezone.includes('Chicago')) {
      setLocale('es');
      return;
    }

    // Check browser language
    const browserLang = navigator.language?.split('-')[0];
    if (browserLang === 'es') {
      setLocale('es');
    }
  }, []);

  const changeLocale = useCallback((newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  const t = useCallback((key) => {
    const translations = locale === 'es' ? es : locale === 'pt' ? pt : en;
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }, [locale]);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
}

// ============ User Role Provider with Supabase ============
const UserRoleContext = createContext();

export function UserRoleProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState('checking'); // 'supabase', 'demo', 'checking'
  const [authError, setAuthError] = useState(null);

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && key && url !== 'your-project-url' && key !== 'your-anon-key';
  };

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;
    
    const initAuth = async () => {
      // First check localStorage for cached auth state - use immediately for fast loading
      const cachedRole = localStorage.getItem('supabaseUserRole');
      const cachedUser = localStorage.getItem('supabaseUser');
      
      // If we have cached data, use it immediately
      if (cachedUser && cachedRole) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          if (isMounted) {
            setUser(parsedUser);
            setRole(cachedRole);
            setAuthMode('supabase');
            setIsLoading(false);
          }
        } catch (e) {
          console.error('Error parsing cached user:', e);
        }
      }
      
      if (isSupabaseConfigured()) {
        try {
          // Try Supabase auth
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (!isMounted) return;
          
          if (error) {
            console.error('Supabase auth error:', error);
            // Fall back to demo mode or cached state
            if (!cachedUser || !cachedRole) {
              loadDemoUser();
            }
            setIsLoading(false);
            return;
          }

          if (session?.user) {
            // User is authenticated with Supabase
            setAuthMode('supabase');
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
            };
            setUser(userData);
            
            // Fetch user role from database
            try {
              const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('role, name')
                .eq('id', session.user.id)
                .single();
              
              if (!isMounted) return;
              
              if (profileError) {
                console.error('Profile fetch error:', profileError);
                // Use cached role if available
                if (cachedRole) {
                  setRole(cachedRole);
                } else {
                  setRole('free');
                }
              } else if (profile) {
                setRole(profile.role);
                // Cache the role for faster loads
                localStorage.setItem('supabaseUserRole', profile.role);
                if (profile.name) {
                  userData.name = profile.name;
                  setUser(userData);
                }
                localStorage.setItem('supabaseUser', JSON.stringify(userData));
              } else {
                setRole(cachedRole || 'free');
              }
            } catch (err) {
              console.error('Error fetching profile:', err);
              if (isMounted) {
                setRole(cachedRole || 'free');
              }
            }
          } else {
            // No Supabase session, clear cache and check for demo user
            localStorage.removeItem('supabaseUserRole');
            localStorage.removeItem('supabaseUser');
            loadDemoUser();
          }
        } catch (err) {
          console.error('Auth initialization error:', err);
          if (isMounted) {
            loadDemoUser();
          }
        }
      } else {
        // Supabase not configured, use demo mode
        loadDemoUser();
      }
      
      if (isMounted) {
        setIsLoading(false);
      }
    };

    const loadDemoUser = () => {
      const savedUser = localStorage.getItem('user');
      const savedRole = localStorage.getItem('demoUserRole');
      
      if (savedUser && savedRole) {
        try {
          setUser(JSON.parse(savedUser));
          setRole(savedRole);
          setAuthMode('demo');
        } catch (e) {
          console.error('Error parsing demo user:', e);
        }
      }
      setAuthMode('demo');
    };

    // Set a timeout to ensure loading doesn't hang forever
    const timeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.warn('Auth initialization timed out');
        setIsLoading(false);
      }
    }, 5000);

    initAuth();
    
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  // Login function - supports both Supabase and demo mode
  const login = useCallback(async (credentials, demoRole = null) => {
    const supabase = createClient();
    
    if (demoRole) {
      // Demo mode login
      setUser(credentials);
      setRole(demoRole);
      setAuthMode('demo');
      localStorage.setItem('user', JSON.stringify(credentials));
      localStorage.setItem('demoUserRole', demoRole);
      return { success: true, mode: 'demo' };
    }

    // Supabase login
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        // Check if it's a demo account
        const demoUser = demoUsers[credentials.email];
        if (demoUser && demoUser.password === credentials.password) {
          // Fall back to demo login
          setUser({ email: credentials.email, name: demoUser.name });
          setRole(demoUser.role);
          setAuthMode('demo');
          localStorage.setItem('user', JSON.stringify({ email: credentials.email, name: demoUser.name }));
          localStorage.setItem('demoUserRole', demoUser.role);
          return { success: true, mode: 'demo' };
        }
        return { success: false, error: error.message };
      }

      // Login successful - set user immediately
      if (data.user) {
        setAuthMode('supabase');
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0]
        };
        setUser(userData);
        
        // Try to fetch role from database, default to 'free' if fails
        try {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('role, name')
            .eq('id', data.user.id)
            .single();
          
          if (!profileError && profile) {
            setRole(profile.role);
            // Cache for faster loads on next page
            localStorage.setItem('supabaseUserRole', profile.role);
            if (profile.name) {
              userData.name = profile.name;
              setUser(userData);
            }
            localStorage.setItem('supabaseUser', JSON.stringify(userData));
          } else {
            // Profile doesn't exist - create it
            console.log('Profile not found, creating one...');
            const { error: insertError } = await supabase
              .from('users')
              .upsert({
                id: data.user.id,
                email: data.user.email,
                name: userData.name,
                role: 'free',
                is_suspended: false,
                subscription_status: 'none',
                created_at: new Date().toISOString()
              }, { onConflict: 'id' });
            
            if (insertError) {
              console.error('Error creating user profile:', insertError);
            }
            
            setRole('free');
            localStorage.setItem('supabaseUserRole', 'free');
            localStorage.setItem('supabaseUser', JSON.stringify(userData));
          }
        } catch (err) {
          console.error('Error fetching profile after login:', err);
          setRole('free');
          localStorage.setItem('supabaseUserRole', 'free');
          localStorage.setItem('supabaseUser', JSON.stringify(userData));
        }
      }

      return { success: true, mode: 'supabase', user: data.user };
    }

    return { success: false, error: 'Authentication not configured' };
  }, []);

  // Signup function
  const signup = useCallback(async (email, password, name) => {
    const supabase = createClient();
    
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // If we have a session, user is auto-confirmed - set up their state
      if (data.session && data.user) {
        setAuthMode('supabase');
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: name || data.user.email?.split('@')[0]
        };
        setUser(userData);
        setRole('free'); // New users start as 'free'
        
        // Create record in public.users table
        try {
          const { error: insertError } = await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              name: name || data.user.email?.split('@')[0],
              role: 'free',
              is_suspended: false,
              subscription_status: 'none',
              created_at: new Date().toISOString()
            }, { onConflict: 'id' });
          
          if (insertError) {
            console.error('Error creating user profile:', insertError);
          }
        } catch (err) {
          console.error('Error inserting user into public.users:', err);
        }
        
        // Cache for faster loads
        localStorage.setItem('supabaseUserRole', 'free');
        localStorage.setItem('supabaseUser', JSON.stringify(userData));
        
        return { success: true, user: data.user, needsConfirmation: false, autoLoggedIn: true };
      }

      return { success: true, user: data.user, needsConfirmation: !data.session };
    }

    // Demo mode signup
    const userData = { email, name };
    setUser(userData);
    setRole('free');
    setAuthMode('demo');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('demoUserRole', 'free');
    return { success: true, mode: 'demo' };
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    const supabase = createClient();
    
    if (authMode === 'supabase') {
      await supabase.auth.signOut();
    }
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('demoUserRole');
    localStorage.removeItem('supabaseUser');
    localStorage.removeItem('supabaseUserRole');
  }, [authMode]);

  // Permission checks based on role hierarchy
  const isSubscribed = role && ['paid', 'subscriber', 'contributor', 'editor', 'admin'].includes(role);
  const canAccessHumanContent = role && ['paid', 'subscriber', 'contributor', 'editor', 'admin'].includes(role);
  const canSubmitStories = role && ['contributor', 'editor', 'admin'].includes(role);
  const canEditStories = role && ['editor', 'admin'].includes(role);
  const canAccessAdminDashboard = role === 'admin';
  const canManageUsers = role === 'admin';

  return (
    <UserRoleContext.Provider value={{
      user,
      role,
      isLoading,
      authMode,
      login,
      signup,
      logout,
      isSubscribed,
      canAccessHumanContent,
      canSubmitStories,
      canEditStories,
      canAccessAdminDashboard,
      canManageUsers
    }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within UserRoleProvider');
  }
  return context;
}

// ============ Content Mode Provider ============
const ContentModeContext = createContext();

export function ContentModeProvider({ children }) {
  const [mode, setModeState] = useState('all'); // 'all', 'ai', 'human'

  useEffect(() => {
    const saved = localStorage.getItem('contentMode');
    if (saved) setModeState(saved);
  }, []);

  const setMode = useCallback((newMode) => {
    setModeState(newMode);
    localStorage.setItem('contentMode', newMode);
  }, []);

  const toggleMode = useCallback(() => {
    const newMode = mode === 'ai' ? 'human' : mode === 'human' ? 'all' : 'ai';
    setMode(newMode);
  }, [mode, setMode]);

  return (
    <ContentModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ContentModeContext.Provider>
  );
}

export function useContentMode() {
  const context = useContext(ContentModeContext);
  if (!context) {
    throw new Error('useContentMode must be used within ContentModeProvider');
  }
  return context;
}
