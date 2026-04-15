import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Language } from '@arabic/shared';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { Link } from 'react-router-dom';

const SUGGESTION_CHIPS: Record<Language, string[]> = {
  uz: ['Maslahat', "O'xshash harflar", 'Harakat nima?', 'Nima qilishim kerak?'],
  ru: ['Совет', 'Похожие буквы', 'Что такое огласовки?', 'Что мне делать?'],
  en: ['Advice', 'Similar letters', 'What are vowel marks?', 'What should I do?'],
};

export function TeacherChat() {
  const { t, i18n } = useTranslation('common');
  const lang = (i18n.language || 'uz') as Language;
  const user = useAuthStore(s => s.user);

  const messages = useChatStore(s => s.messages);
  const addMessage = useChatStore(s => s.addMessage);
  const status = useChatStore(s => s.status);
  const setStatus = useChatStore(s => s.setStatus);
  const updateStatus = useChatStore(s => s.updateStatus);
  const limitReached = useChatStore(s => s.limitReached);
  const setLimitReached = useChatStore(s => s.setLimitReached);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch chat status when chat opens
  useEffect(() => {
    if (open) {
      api.get('/chat/status').then(({ data }) => {
        if (data?.ok) setStatus(data.data);
      }).catch(() => {});
    }
  }, [open, setStatus]);

  // Add greeting when chat opens for the first time
  useEffect(() => {
    if (open && messages.length === 0) {
      addMessage('bot', t('teacher.greeting'));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || typing || limitReached) return;

    const trimmed = text.trim();
    setInput('');

    addMessage('user', trimmed);
    setTyping(true);

    const history = messages.slice(-6).map(m => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text,
    }));

    try {
      const { data } = await api.post('/chat', { message: trimmed, history });
      const reply = data?.data?.reply || (lang === 'uz' ? 'Kechirasiz, hozir javob bera olmayapman.' : lang === 'ru' ? 'Извините, не могу ответить сейчас.' : 'Sorry, I cannot respond right now.');
      addMessage('bot', reply);

      if (data?.data?.usage) {
        updateStatus({
          dailyUsed: data.data.usage.dailyUsed,
          dailyLimit: data.data.usage.dailyLimit,
          plan: data.data.usage.plan,
        });
      }
    } catch (err: any) {
      if (err?.response?.status === 429) {
        setLimitReached(true);
        addMessage('bot', t('pro.limit_reached', { defaultValue: lang === 'uz' ? 'Bugungi limit tugadi' : lang === 'ru' ? 'Лимит на сегодня исчерпан' : 'Daily limit reached' }));
      } else {
        addMessage('bot', lang === 'uz' ? 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.' : lang === 'ru' ? 'Произошла ошибка. Попробуйте ещё раз.' : 'An error occurred. Please try again.');
      }
    } finally {
      setTyping(false);
    }
  }, [typing, lang, messages, limitReached, t, addMessage, updateStatus, setLimitReached]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const chips = SUGGESTION_CHIPS[lang] ?? SUGGESTION_CHIPS.uz;

  const isPro = status?.plan === 'pro';
  const usageText = isPro
    ? `PRO \u221E`
    : status
      ? `${status.dailyUsed}/${status.dailyLimit ?? 10}`
      : '';

  return (
    <>
      {/* Floating button - bottom left */}
      <motion.button
        onClick={() => setOpen(prev => !prev)}
        className="fixed left-4 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 z-50
                   w-12 h-12 rounded-full
                   bg-[rgba(30,22,10,0.85)] border border-[rgba(201,168,76,0.2)]
                   backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                   flex items-center justify-center
                   hover:border-[rgba(201,168,76,0.5)] hover:shadow-[0_0_15px_rgba(201,168,76,0.15)]
                   active:scale-95 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        title={t('teacher.title', { defaultValue: 'AI Teacher' })}
      >
        <span className="text-xl">{open ? '\u2715' : '\uD83C\uDF93'}</span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop (mobile only) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[48]"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed z-[49]
                         left-4 bottom-[calc(8rem+env(safe-area-inset-bottom,0px))] md:bottom-20
                         w-[calc(100vw-2rem)] md:w-[380px]
                         max-h-[70vh] flex flex-col
                         bg-gradient-to-br from-[#1e160a] to-[#140f05]
                         border border-[rgba(201,168,76,0.2)] rounded-2xl
                         shadow-[0_8px_40px_rgba(0,0,0,0.6)]
                         overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(201,168,76,0.1)]
                              bg-[rgba(201,168,76,0.04)]">
                <span className="text-lg">{'\uD83C\uDF93'}</span>
                <p className="font-cinzel text-xs tracking-widest text-gold-light uppercase flex-1">
                  {t('teacher.title', { defaultValue: 'AI Teacher' })}
                </p>
                {/* Usage counter */}
                {usageText && (
                  <span className={`text-[0.65rem] px-2 py-0.5 rounded-full border
                    ${isPro
                      ? 'bg-[rgba(201,168,76,0.15)] border-[rgba(201,168,76,0.3)] text-[#e8c96d] font-bold'
                      : 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#9a8a6a]'
                    }`}>
                    {usageText} {isPro ? '' : '\uD83D\uDD0B'}
                  </span>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-[#9a8a6a] hover:text-gold transition-colors text-sm p-1"
                >
                  {'\u2715'}
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.2)]
                                      flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        <span className="text-xs">{'\uD83C\uDF93'}</span>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[0.82rem] leading-relaxed whitespace-pre-line
                        ${msg.role === 'user'
                          ? 'bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.25)] text-[#f0e6cc]'
                          : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] text-[#c8b88a]'
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-full bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.2)]
                                    flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <span className="text-xs">{'\uD83C\uDF93'}</span>
                    </div>
                    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]
                                    rounded-2xl px-4 py-3 text-[#9a8a6a] text-[0.8rem]">
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
              {!limitReached && (
                <div className="px-3 py-2 flex gap-1.5 overflow-x-auto border-t border-[rgba(201,168,76,0.06)]
                                scrollbar-hide">
                  {chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      disabled={typing}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full text-[0.7rem]
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

              {/* Limit reached upgrade prompt */}
              {limitReached && (
                <div className="px-4 py-4 border-t border-[rgba(201,168,76,0.1)] bg-[rgba(201,168,76,0.04)]
                                text-center space-y-2">
                  <p className="text-[#e8c96d] text-sm font-semibold">
                    {t('pro.limit_reached', { defaultValue: lang === 'uz' ? 'Bugungi limit tugadi' : lang === 'ru' ? '\u041B\u0438\u043C\u0438\u0442 \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u0438\u0441\u0447\u0435\u0440\u043F\u0430\u043D' : 'Daily limit reached' })} {'\u26A1'}
                  </p>
                  <p className="text-[#9a8a6a] text-xs">
                    {lang === 'uz' ? 'Pro bilan \u2014 cheksiz savollar!' : lang === 'ru' ? '\u0421 Pro \u2014 \u0431\u0435\u0437\u043B\u0438\u043C\u0438\u0442\u043D\u044B\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B!' : 'With Pro \u2014 unlimited questions!'}
                  </p>
                  <Link
                    to="/pro"
                    onClick={() => setOpen(false)}
                    className="inline-block px-6 py-2 rounded-full text-xs font-bold
                               bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] text-[#1a1408]
                               hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all"
                  >
                    {t('pro.upgrade', { defaultValue: lang === 'uz' ? 'Pro ga o\'tish' : lang === 'ru' ? '\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043D\u0430 Pro' : 'Upgrade to Pro' })}
                  </Link>
                  <p className="text-[#6a5a3a] text-[0.65rem]">
                    {t('pro.wait_tomorrow', { defaultValue: lang === 'uz' ? 'Yoki ertaga qaytadan' : lang === 'ru' ? '\u0418\u043B\u0438 \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435 \u0434\u043E \u0437\u0430\u0432\u0442\u0440\u0430' : 'Or wait until tomorrow' })}
                  </p>
                </div>
              )}

              {/* Input */}
              {!limitReached && (
                <form
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 px-3 py-3 border-t border-[rgba(201,168,76,0.1)]
                             bg-[rgba(201,168,76,0.02)]"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={t('teacher.placeholder', { defaultValue: 'Type your question...' })}
                    disabled={typing}
                    className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(201,168,76,0.12)]
                               rounded-xl px-3 py-2.5 text-[0.82rem] text-[#f0e6cc]
                               placeholder:text-[#6a5a3a] outline-none
                               focus:border-[rgba(201,168,76,0.35)] transition-colors
                               disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || typing}
                    className="w-10 h-10 rounded-xl flex items-center justify-center
                               bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.2)]
                               text-[#c9a84c] hover:bg-[rgba(201,168,76,0.2)]
                               transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
