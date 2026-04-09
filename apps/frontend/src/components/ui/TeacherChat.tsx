import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Language } from '@arabic/shared';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
interface ChatMessage {
  id: number;
  role: 'bot' | 'user';
  text: string;
}

const SUGGESTION_CHIPS: Record<Language, string[]> = {
  uz: ['Maslahat', "O'xshash harflar", 'Harakat nima?', 'Nima qilishim kerak?'],
  ru: ['Совет', 'Похожие буквы', 'Что такое огласовки?', 'Что мне делать?'],
  en: ['Advice', 'Similar letters', 'What are vowel marks?', 'What should I do?'],
};

export function TeacherChat() {
  const { t, i18n } = useTranslation('common');
  const lang = (i18n.language || 'uz') as Language;
  const user = useAuthStore(s => s.user);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [msgId, setMsgId] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add greeting when chat opens for the first time
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting = t('teacher.greeting');
      setMsgId(prev => prev + 1);
      setMessages([{ id: 1, role: 'bot', text: greeting }]);
      setMsgId(1);
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
    if (!text.trim() || typing) return;

    const trimmed = text.trim();
    setInput('');

    // Add user message
    const userMsgId = msgId + 1;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: trimmed }]);
    setMsgId(userMsgId);

    // Show typing indicator
    setTyping(true);

    // Build history for context
    const history = messages.slice(-6).map(m => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text,
    }));

    // Call AI API
    try {
      const { data } = await api.post('/chat', { message: trimmed, history });
      const botMsgId = userMsgId + 1;
      const reply = data?.data?.reply || (lang === 'uz' ? 'Kechirasiz, hozir javob bera olmayapman.' : lang === 'ru' ? 'Извините, не могу ответить сейчас.' : 'Sorry, I cannot respond right now.');
      setMessages(prev => [...prev, { id: botMsgId, role: 'bot', text: reply }]);
      setMsgId(botMsgId);
    } catch {
      const botMsgId = userMsgId + 1;
      setMessages(prev => [...prev, { id: botMsgId, role: 'bot', text: lang === 'uz' ? 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.' : lang === 'ru' ? 'Произошла ошибка. Попробуйте ещё раз.' : 'An error occurred. Please try again.' }]);
      setMsgId(botMsgId);
    } finally {
      setTyping(false);
    }
  }, [msgId, typing, lang, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const chips = SUGGESTION_CHIPS[lang] ?? SUGGESTION_CHIPS.uz;

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
        <span className="text-xl">{open ? '✕' : '🎓'}</span>
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
                <span className="text-lg">🎓</span>
                <p className="font-cinzel text-xs tracking-widest text-gold-light uppercase flex-1">
                  {t('teacher.title', { defaultValue: 'AI Teacher' })}
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="text-[#9a8a6a] hover:text-gold transition-colors text-sm p-1"
                >
                  ✕
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
                        <span className="text-xs">🎓</span>
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
                      <span className="text-xs">🎓</span>
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

              {/* Input */}
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
