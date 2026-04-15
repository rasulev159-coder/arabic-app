import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation }  from 'react-i18next';
import { Link }            from 'react-router-dom';
import { motion }          from 'framer-motion';
import { GraduationCap, Send } from 'lucide-react';
import { api }             from '../lib/api';
import { useAuthStore }    from '../store/authStore';
import { Language }        from '@arabic/shared';

interface ChatMessage {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

interface ChatStatus {
  plan: string;
  dailyUsed: number;
  dailyLimit: number | null;
  model: string;
  planExpiresAt: string | null;
}

const SUGGESTION_CHIPS: Record<Language, string[]> = {
  uz: ['Maslahat', "O'xshash harflar", 'Harakat nima?', 'Nima qilishim kerak?'],
  ru: ['Совет', 'Похожие буквы', 'Что такое огласовки?', 'Что мне делать?'],
  en: ['Advice', 'Similar letters', 'What are vowel marks?', 'What should I do?'],
};

export function ChatPage() {
  const { t, i18n } = useTranslation('common');
  const lang = (i18n.language || 'uz') as Language;
  const user = useAuthStore(s => s.user);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [msgId, setMsgId] = useState(0);
  const [status, setStatus] = useState<ChatStatus | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch status on mount
  useEffect(() => {
    api.get('/chat/status').then(({ data }) => {
      if (data?.ok) setStatus(data.data);
    }).catch(() => {});
  }, []);

  // Add greeting on mount
  useEffect(() => {
    const greeting = t('teacher.greeting');
    setMessages([{ id: 1, role: 'bot', text: greeting }]);
    setMsgId(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || typing || limitReached) return;

    const trimmed = text.trim();
    setInput('');

    const userMsgId = msgId + 1;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: trimmed }]);
    setMsgId(userMsgId);
    setTyping(true);

    const history = messages.slice(-6).map(m => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text,
    }));

    try {
      const { data } = await api.post('/chat', { message: trimmed, history });
      const botMsgId = userMsgId + 1;
      const reply = data?.data?.reply || (lang === 'uz' ? 'Kechirasiz, hozir javob bera olmayapman.' : lang === 'ru' ? 'Извините, не могу ответить сейчас.' : 'Sorry, I cannot respond right now.');
      setMessages(prev => [...prev, { id: botMsgId, role: 'bot', text: reply }]);
      setMsgId(botMsgId);

      if (data?.data?.usage) {
        setStatus(prev => prev ? {
          ...prev,
          dailyUsed: data.data.usage.dailyUsed,
          dailyLimit: data.data.usage.dailyLimit,
          plan: data.data.usage.plan,
        } : prev);
      }
    } catch (err: any) {
      const botMsgId = userMsgId + 1;
      if (err?.response?.status === 429) {
        setLimitReached(true);
        setMessages(prev => [...prev, { id: botMsgId, role: 'bot', text: t('pro.limit_reached') }]);
      } else {
        setMessages(prev => [...prev, { id: botMsgId, role: 'bot', text: lang === 'uz' ? 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.' : lang === 'ru' ? 'Произошла ошибка. Попробуйте ещё раз.' : 'An error occurred. Please try again.' }]);
      }
      setMsgId(botMsgId);
    } finally {
      setTyping(false);
    }
  }, [msgId, typing, lang, messages, limitReached, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const chips = SUGGESTION_CHIPS[lang] ?? SUGGESTION_CHIPS.uz;
  const isPro = status?.plan === 'pro';
  const usageText = isPro
    ? 'PRO \u221E'
    : status
      ? `${status.dailyUsed}/${status.dailyLimit ?? 10}`
      : '';

  return (
    <div className="flex flex-col h-[100dvh] md:h-screen bg-bg">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(201,168,76,0.1)]
                      bg-[rgba(201,168,76,0.03)]">
        <GraduationCap size={24} className="text-[#c9a84c]" />
        <div className="flex-1">
          <p className="font-cinzel text-sm tracking-widest text-[#f0e6cc] uppercase">
            {t('teacher.title')}
          </p>
        </div>
        {usageText && (
          <span className={`text-[0.65rem] px-2.5 py-1 rounded-full border
            ${isPro
              ? 'bg-[rgba(201,168,76,0.15)] border-[rgba(201,168,76,0.3)] text-[#e8c96d] font-bold'
              : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#9a8a6a]'
            }`}>
            {usageText}
          </span>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.2)]
                              flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <GraduationCap size={16} className="text-[#c9a84c]" />
              </div>
            )}
            <div
              className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line
                ${msg.role === 'user'
                  ? 'bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.25)] text-[#f0e6cc]'
                  : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[#c8b88a]'
                }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.2)]
                            flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
              <GraduationCap size={16} className="text-[#c9a84c]" />
            </div>
            <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]
                            rounded-2xl px-4 py-3">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      {!limitReached && messages.length <= 2 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-[rgba(201,168,76,0.06)]">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              disabled={typing}
              className="flex-shrink-0 px-4 py-2 rounded-full text-[0.75rem]
                         bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)]
                         text-[#c9a84c] hover:bg-[rgba(201,168,76,0.15)]
                         hover:border-[rgba(201,168,76,0.3)] transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed
                         whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Limit reached */}
      {limitReached && (
        <div className="px-4 py-4 border-t border-[rgba(201,168,76,0.1)] bg-[rgba(201,168,76,0.04)]
                        text-center space-y-2">
          <p className="text-[#e8c96d] text-sm font-semibold">
            {t('pro.limit_reached')}
          </p>
          <Link
            to="/pro"
            className="inline-block px-6 py-2 rounded-full text-xs font-bold
                       bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] text-[#1a1408]
                       hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all"
          >
            {t('pro.upgrade')}
          </Link>
        </div>
      )}

      {/* Input */}
      {!limitReached && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 py-3 border-t border-[rgba(201,168,76,0.1)]
                     bg-[rgba(201,168,76,0.02)]"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t('teacher.placeholder')}
            disabled={typing}
            className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.12)]
                       rounded-xl px-4 py-3 text-sm text-[#f0e6cc]
                       placeholder:text-[#6a5a3a] outline-none
                       focus:border-[rgba(201,168,76,0.35)] transition-colors
                       disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="w-11 h-11 rounded-xl flex items-center justify-center
                       bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.2)]
                       text-[#c9a84c] hover:bg-[rgba(201,168,76,0.2)]
                       transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      )}
    </div>
  );
}
