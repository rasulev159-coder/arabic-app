import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm }          from 'react-hook-form';
import { zodResolver }      from '@hookform/resolvers/zod';
import { z }                from 'zod';
import { useTranslation }   from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore }     from '../store/authStore';
import { Button }           from '../components/ui/Button';
import { Input }            from '../lib/utils';
import { LanguageSwitcher } from '../components/ui/Badges';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

const loginSchema = z.object({
  email:    z.string().email('Неверный email'),
  password: z.string().min(1, 'Введите пароль'),
});

const registerSchema = z.object({
  name:     z.string().min(2, 'Минимум 2 символа'),
  email:    z.string().email('Неверный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
});

type LoginForm    = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function LoginPage() {
  const [mode, setMode]   = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const { login, register, loginGoogle, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { t }    = useTranslation('common');

  const handleGoogleLogin = useCallback(async (response: any) => {
    setError('');
    try {
      await loginGoogle(response.credential);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Google login error');
    }
  }, [loginGoogle, navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      (window as any).google?.accounts?.id?.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [handleGoogleLogin]);

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const regForm   = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onLogin = async (data: LoginForm) => {
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? t('error'));
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setError('');
    try {
      await register(data.email, data.name, data.password);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? t('error'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="absolute top-4 right-4"><LanguageSwitcher /></div>

      <Link to="/" className="mb-8 text-center">
        <p className="font-scheherazade text-5xl text-gold">الأبجدية</p>
        <p className="font-cinzel text-[0.6rem] tracking-[4px] text-[#9a8a6a] uppercase mt-1">
          {t('app_name')}
        </p>
      </Link>

      <motion.div
        className="w-full max-w-sm bg-gradient-to-br from-[#201808] to-[#140f05]
                   border border-[#3a2d10] rounded-3xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Tabs */}
        <div className="flex bg-[rgba(255,255,255,0.03)] rounded-full p-1 mb-6">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 font-cinzel text-[0.65rem] tracking-widest uppercase py-2 rounded-full transition-all
                ${mode === m
                  ? 'bg-[rgba(201,168,76,0.15)] text-gold-light border border-[rgba(201,168,76,0.25)]'
                  : 'text-[#9a8a6a]'}`}
            >
              {m === 'login' ? t('auth.login') : t('auth.register')}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="flex flex-col gap-3"
            >
              <Input placeholder={t('auth.email')} type="email" {...loginForm.register('email')} />
              {loginForm.formState.errors.email && (
                <p className="text-[#c95050] text-xs font-cinzel">{loginForm.formState.errors.email.message}</p>
              )}
              <Input placeholder={t('auth.password')} type="password" {...loginForm.register('password')} />
              {loginForm.formState.errors.password && (
                <p className="text-[#c95050] text-xs font-cinzel">{loginForm.formState.errors.password.message}</p>
              )}
              {error && <p className="text-[#c95050] text-xs font-cinzel text-center">{error}</p>}
              <Button type="submit" size="lg" className="mt-2 w-full" disabled={isLoading}>
                {isLoading ? '...' : t('auth.login')}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={regForm.handleSubmit(onRegister)}
              className="flex flex-col gap-3"
            >
              <Input placeholder={t('auth.name')} {...regForm.register('name')} />
              {regForm.formState.errors.name && (
                <p className="text-[#c95050] text-xs font-cinzel">{regForm.formState.errors.name.message}</p>
              )}
              <Input placeholder={t('auth.email')} type="email" {...regForm.register('email')} />
              <Input placeholder={t('auth.password')} type="password" {...regForm.register('password')} />
              {regForm.formState.errors.password && (
                <p className="text-[#c95050] text-xs font-cinzel">{regForm.formState.errors.password.message}</p>
              )}
              {error && <p className="text-[#c95050] text-xs font-cinzel text-center">{error}</p>}
              <Button type="submit" size="lg" className="mt-2 w-full" disabled={isLoading}>
                {isLoading ? '...' : t('auth.register')}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
          <span className="font-cinzel text-[0.6rem] tracking-widest text-[#9a8a6a] uppercase">
            {t('auth.or_google').split(' ').slice(0, 1).join(' ')}
          </span>
          <div className="flex-1 h-px bg-[rgba(201,168,76,0.15)]" />
        </div>

        {/* Google sign-in button */}
        {GOOGLE_CLIENT_ID && (
          <button
            onClick={() => {
              (window as any).google?.accounts?.id?.prompt((notification: any) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                  // Fallback: render the button
                  (window as any).google?.accounts?.id?.renderButton(
                    document.getElementById('google-btn-container'),
                    { theme: 'filled_black', size: 'large', width: '100%', text: 'signin_with' }
                  );
                }
              });
            }}
            className="mt-4 w-full flex items-center justify-center gap-3 py-3 px-4
                       bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.15)]
                       rounded-full font-cinzel text-[0.65rem] tracking-widest uppercase
                       text-[#9a8a6a] hover:text-gold-light hover:border-[rgba(201,168,76,0.3)]
                       hover:bg-[rgba(201,168,76,0.05)] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 48 48" className="flex-shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {t('auth.or_google')}
          </button>
        )}
        <div id="google-btn-container" className="mt-2 flex justify-center" />
      </motion.div>
    </div>
  );
}
