import { useState }        from 'react';
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
  const { login, register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { t }    = useTranslation('common');

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const regForm   = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onLogin = async (data: LoginForm) => {
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Ошибка входа');
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setError('');
    try {
      await register(data.email, data.name, data.password);
      navigate('/dashboard');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Ошибка регистрации');
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
      </motion.div>
    </div>
  );
}
