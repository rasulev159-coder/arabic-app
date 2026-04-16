import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';

const FEATURES = [
  { key: 'features_unlimited', icon: '\u221E' },
  { key: 'features_model', icon: '\uD83E\uDDE0' },
  { key: 'features_detailed', icon: '\uD83D\uDCDD' },
  { key: 'features_no_ads', icon: '\uD83D\uDEAB' },
  { key: 'features_support', icon: '\u2B50' },
];

interface SubscriptionData {
  plan: string;
  planExpiresAt: string | null;
  daysLeft: number;
  dailyUsed: number;
  dailyLimit: number | null;
  prices: {
    monthly: { UZS: number };
    yearly: { UZS: number };
  };
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    provider: string;
    status: string;
    planType: string;
    createdAt: string;
    completedAt: string | null;
  }>;
}

type PlanType = 'monthly' | 'yearly';
type Provider = 'payme' | 'click';

export function ProPage() {
  const { t } = useTranslation('common');
  const user = useAuthStore(s => s.user);
  const fetchMe = useAuthStore(s => s.fetchMe);
  const [searchParams] = useSearchParams();

  const [subData, setSubData] = useState<SubscriptionData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const isPro = subData?.plan === 'pro' || user?.plan === 'pro';

  const fetchSubscription = useCallback(async () => {
    try {
      const { data } = await api.get('/subscription');
      if (data.ok) setSubData(data.data);
    } catch {
      // not logged in or error
    }
  }, []);

  useEffect(() => {
    if (user) fetchSubscription();
  }, [user, fetchSubscription]);

  // Handle payment callback
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setPaymentSuccess(true);
      fetchMe();
      fetchSubscription();
    }
  }, [searchParams, fetchMe, fetchSubscription]);

  const handlePayment = async (provider: Provider) => {
    if (!user) return;
    setLoading(provider);
    setError(null);
    try {
      const { data } = await api.post('/subscription/create', {
        planType: selectedPlan,
        provider,
      });
      if (data.ok && data.data.redirectUrl) {
        window.location.href = data.data.redirectUrl;
      } else {
        setError(data.error || 'Failed to create payment');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment error');
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ru-RU');
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'paid': return { text: t('pro.status_paid', { defaultValue: 'Paid' }), cls: 'text-green-400' };
      case 'pending': return { text: t('pro.status_pending', { defaultValue: 'Pending' }), cls: 'text-yellow-400' };
      case 'cancelled': return { text: t('pro.status_cancelled', { defaultValue: 'Cancelled' }), cls: 'text-red-400' };
      default: return { text: status, cls: 'text-[#9a8a6a]' };
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-4xl block mb-3">{'\u26A1'}</span>
        <h1 className="font-cinzel text-2xl md:text-3xl tracking-widest text-[#e8c96d] uppercase">
          {t('pro.title', { defaultValue: 'Arab Alifbosi Pro' })}
        </h1>
        {isPro && (
          <div className="mt-3 inline-block px-4 py-1.5 rounded-full
                          bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] text-[#1a1408]
                          font-bold text-sm">
            {t('pro.current_plan', { defaultValue: 'Current plan' })} {'\u2714'}
          </div>
        )}
      </div>

      {/* Payment success banner */}
      {paymentSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-green-900/30 border border-green-700/50 text-green-300 text-center text-sm">
          {t('pro.payment_success', { defaultValue: 'Payment successful! Your Pro plan is now active.' })}
        </div>
      )}

      {/* Current plan status */}
      {user && subData && (
        <div className="mb-6 bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9a8a6a] text-xs uppercase tracking-wider">
              {t('pro.current_status', { defaultValue: 'Current plan' })}
            </span>
            <span className={`text-sm font-bold ${isPro ? 'text-[#e8c96d]' : 'text-[#9a8a6a]'}`}>
              {isPro ? 'PRO' : 'FREE'}
            </span>
          </div>
          {isPro && subData.planExpiresAt && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#6a5a3a] text-xs">
                {t('pro.expires', { defaultValue: 'Expires' })}
              </span>
              <span className="text-[#c8b88a] text-xs">
                {formatDate(subData.planExpiresAt)} ({subData.daysLeft} {t('pro.days_left', { defaultValue: 'days left' })})
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[#6a5a3a] text-xs">
              {t('pro.ai_usage', { defaultValue: 'AI usage today' })}
            </span>
            <span className="text-[#c8b88a] text-xs">
              {subData.dailyUsed}{subData.dailyLimit ? `/${subData.dailyLimit}` : ' / \u221E'}
            </span>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Monthly */}
        <div
          onClick={() => setSelectedPlan('monthly')}
          className={`bg-[rgba(201,168,76,0.05)] border rounded-2xl p-6 cursor-pointer
                      transition-all ${selectedPlan === 'monthly'
                        ? 'border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.1)]'
                        : 'border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.3)]'}`}
        >
          <h3 className="font-cinzel text-sm tracking-widest text-[#c9a84c] uppercase mb-2">
            {t('pro.monthly', { defaultValue: 'Monthly' })}
          </h3>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-[#f0e6cc]">30,000</span>
            <span className="text-[#9a8a6a] text-sm">UZS{t('pro.per_month', { defaultValue: '/mo' })}</span>
          </div>
          <p className="text-[#6a5a3a] text-xs">~ $3 USD</p>
        </div>

        {/* Yearly */}
        <div
          onClick={() => setSelectedPlan('yearly')}
          className={`border rounded-2xl p-6 relative overflow-hidden cursor-pointer
                      transition-all ${selectedPlan === 'yearly'
                        ? 'border-2 border-[rgba(201,168,76,0.5)] bg-[rgba(201,168,76,0.12)]'
                        : 'border-2 border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.08)] hover:border-[rgba(201,168,76,0.5)]'}`}
        >
          {/* Save badge */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full
                          bg-[#c9a84c] text-[#1a1408] text-[0.6rem] font-bold uppercase">
            {t('pro.savings', { percent: 30, defaultValue: 'save 30%' })}
          </div>
          <h3 className="font-cinzel text-sm tracking-widest text-[#e8c96d] uppercase mb-2">
            {t('pro.yearly', { defaultValue: 'Yearly' })}
          </h3>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-[#f0e6cc]">250,000</span>
            <span className="text-[#9a8a6a] text-sm">UZS{t('pro.per_year', { defaultValue: '/yr' })}</span>
          </div>
          <p className="text-[#6a5a3a] text-xs">~ $25 USD</p>
        </div>
      </div>

      {/* Features */}
      <div className="bg-[rgba(201,168,76,0.03)] border border-[rgba(201,168,76,0.1)] rounded-2xl p-6 mb-8">
        <div className="space-y-3">
          {FEATURES.map(f => (
            <div key={f.key} className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.15)]
                              flex items-center justify-center text-sm flex-shrink-0">
                {f.icon}
              </span>
              <span className="text-[#c8b88a] text-sm">
                {t(`pro.${f.key}`, { defaultValue: f.key })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-center text-sm">
          {error}
        </div>
      )}

      {/* Payment methods */}
      {user ? (
        <div className="space-y-3 mb-8">
          <button
            onClick={() => handlePayment('payme')}
            disabled={loading !== null}
            className="w-full py-3 rounded-xl font-bold text-sm
                       bg-[#00CCCC] text-white hover:bg-[#00b3b3] transition-colors
                       disabled:opacity-50 disabled:cursor-wait"
          >
            {loading === 'payme' ? t('pro.redirecting', { defaultValue: 'Redirecting...' }) : `Payme - ${formatAmount(PLANS[selectedPlan].price.UZS)} UZS`}
          </button>
          <button
            onClick={() => handlePayment('click')}
            disabled={loading !== null}
            className="w-full py-3 rounded-xl font-bold text-sm
                       bg-[#23B34A] text-white hover:bg-[#1ea040] transition-colors
                       disabled:opacity-50 disabled:cursor-wait"
          >
            {loading === 'click' ? t('pro.redirecting', { defaultValue: 'Redirecting...' }) : `Click - ${formatAmount(PLANS[selectedPlan].price.UZS)} UZS`}
          </button>
        </div>
      ) : (
        <div className="mb-8 text-center">
          <Link
            to="/login"
            className="inline-block px-8 py-3 rounded-xl font-cinzel text-sm tracking-widest uppercase
                       bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] text-[#1a1408]
                       hover:opacity-90 transition-all"
          >
            {t('pro.login_to_buy', { defaultValue: 'Log in to subscribe' })}
          </Link>
        </div>
      )}

      {/* Payment history */}
      {subData && subData.payments.length > 0 && (
        <div className="bg-[rgba(201,168,76,0.03)] border border-[rgba(201,168,76,0.1)] rounded-2xl p-4 mb-8">
          <h3 className="font-cinzel text-xs tracking-widest text-[#c9a84c] uppercase mb-3">
            {t('pro.payment_history', { defaultValue: 'Payment history' })}
          </h3>
          <div className="space-y-2">
            {subData.payments.map(p => {
              const st = statusLabel(p.status);
              return (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-[rgba(201,168,76,0.08)] last:border-0">
                  <div>
                    <span className="text-[#c8b88a] text-xs">{formatAmount(p.amount)} {p.currency}</span>
                    <span className="text-[#6a5a3a] text-xs ml-2">
                      {p.provider.charAt(0).toUpperCase() + p.provider.slice(1)} / {p.planType}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs ${st.cls}`}>{st.text}</span>
                    <div className="text-[#6a5a3a] text-[0.65rem]">{formatDate(p.createdAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Telegram contact */}
      <div className="text-center">
        <p className="text-[#9a8a6a] text-xs mb-2">
          {t('pro.contact_telegram', { defaultValue: 'Contact via Telegram' })}
        </p>
        <a
          href="https://t.me/arabalifbosi"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 rounded-full font-cinzel text-xs tracking-widest uppercase
                     bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.25)]
                     text-[#c9a84c] hover:bg-[rgba(201,168,76,0.2)] transition-all"
        >
          Telegram {'\u2197'}
        </a>
      </div>

      {/* Back link */}
      <div className="text-center mt-8">
        <Link
          to="/learn"
          className="text-[#6a5a3a] text-xs hover:text-[#9a8a6a] transition-colors"
        >
          {'\u2190'} {t('nav.dashboard', { defaultValue: 'Dashboard' })}
        </Link>
      </div>
    </div>
  );
}

// Plan prices imported for button labels
const PLANS = {
  monthly: { price: { UZS: 30000 } },
  yearly: { price: { UZS: 250000 } },
};
