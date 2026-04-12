import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { aiRateLimit } from '../middleware/aiRateLimit';
import { prisma } from '../lib/prisma';
import { AI_LIMITS } from '../config/aiLimits';

export const chatRouter = Router();

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

const SYSTEM_PROMPT = `You are an Arabic alphabet teacher. You help Uzbekistani students learn to read Arabic from scratch.

CRITICAL LANGUAGE RULE:
- If user writes in Uzbek Latin (like "salom", "harflar") → answer in Uzbek Latin
- If user writes in Russian (like "привет", "буквы") → answer in Russian
- If user writes in English → answer in English
- NEVER mix languages in one response

RESPONSE RULES:
- Keep answers SHORT: 3-5 sentences max
- Always show Arabic letters when explaining (like ب ت ث)
- Be encouraging, end with emoji
- Focus ONLY on Arabic alphabet and reading rules

YOUR KNOWLEDGE:

28 Arabic letters: ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي

SIMILAR LETTERS (differ only by dots):
- ب (1 dot below) vs ت (2 dots above) vs ث (3 dots above)
- ج (dot inside) vs ح (no dot) vs خ (dot above)
- د (no dot) vs ذ (dot above)
- ر (no dot) vs ز (dot above)
- س (no dots) vs ش (3 dots above)
- ص (no dot) vs ض (dot above)
- ط (no dot) vs ظ (dot above)
- ع (no dot) vs غ (dot above)
- ف (1 dot above) vs ق (2 dots above)

6 NON-CONNECTING letters: ا د ذ ر ز و

VOWEL MARKS: Fatha َ = "a", Kasra ِ = "i", Damma ُ = "u", Sukun ْ = no vowel, Shadda ّ = double letter
Tanwin: ً = -an, ٍ = -in, ٌ = -un

SUN LETTERS (lam silent): ت ث د ذ ر ز س ش ص ض ط ظ ل ن → الشمس = ash-shamsu
MOON LETTERS (lam pronounced): ا ب ج ح خ ع غ ف ق ك م ه و ي → القمر = al-qamaru

MADD: Fatha+Alif = "aa", Kasra+Ya = "ii", Damma+Waw = "uu"`;

// Try Gemini first, fallback to OpenRouter
async function callGemini(systemPrompt: string, chatMessages: { role: string; content: string }[], maxTokens: number = 300): Promise<string | null> {
  if (!GEMINI_KEY) return null;

  const contents = chatMessages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: maxTokens },
        }),
      }
    );
    const data = await response.json() as any;
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

async function callOpenRouter(systemPrompt: string, chatMessages: { role: string; content: string }[], maxTokens: number = 300): Promise<string | null> {
  if (!OPENROUTER_KEY) return null;

  const messages = [{ role: 'system', content: systemPrompt }, ...chatMessages];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://arabic-app-ruddy.vercel.app',
      },
      body: JSON.stringify({ model: 'openrouter/free', messages, max_tokens: maxTokens }),
    });
    const data = await response.json() as any;
    return data?.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

async function callAnthropic(systemPrompt: string, chatMessages: { role: string; content: string }[], maxTokens: number = 1000): Promise<string | null> {
  if (!ANTHROPIC_KEY) return null;

  const messages = chatMessages.map(m => ({
    role: m.role === 'assistant' ? 'assistant' as const : 'user' as const,
    content: m.content,
  }));

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    });
    const data = await response.json() as any;
    return data?.content?.[0]?.text || null;
  } catch {
    return null;
  }
}

// GET /api/chat/status
chatRouter.get('/status', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) { res.status(401).json({ ok: false }); return; }

  let plan = user.plan;
  if (plan === 'pro' && user.planExpiresAt && user.planExpiresAt < new Date()) plan = 'free';

  const today = new Date().toISOString().slice(0, 10);
  const lastDate = user.lastAiRequestDate?.toISOString().slice(0, 10);
  const dailyUsed = lastDate === today ? user.dailyAiRequests : 0;
  const limits = AI_LIMITS[plan as 'free' | 'pro'];

  res.json({
    ok: true,
    data: {
      plan,
      dailyUsed,
      dailyLimit: plan === 'free' ? limits.dailyRequests : null,
      model: limits.model,
      planExpiresAt: user.planExpiresAt,
    },
  });
});

chatRouter.post('/', requireAuth, aiRateLimit, async (req: AuthRequest, res: Response): Promise<void> => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ ok: false, error: 'Missing message' });
    return;
  }

  const aiModel = (req as any).aiModel as string;
  const aiMaxTokens = (req as any).aiMaxTokens as number;
  const aiPlan = (req as any).aiPlan as string;
  const aiDailyUsed = (req as any).aiDailyUsed as number;
  const aiDailyLimit = (req as any).aiDailyLimit as number | null;

  if (!GEMINI_KEY && !OPENROUTER_KEY && !ANTHROPIC_KEY) {
    res.status(503).json({ ok: false, error: 'Chat not configured' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    include: {
      streak: true,
      progress: { where: { known: true }, select: { letterCode: true } },
    },
  });

  const knownLetters = user?.progress.map(p => p.letterCode).join(', ') || 'none';
  const streakDays = user?.streak?.current ?? 0;
  const knownCount = user?.progress.length ?? 0;
  const langName = user?.language === 'ru' ? 'Russian' : user?.language === 'en' ? 'English' : 'Uzbek Latin';

  const fullPrompt = `${SYSTEM_PROMPT}

MANDATORY: Answer ONLY in ${langName}. Do NOT use any other language.
${user?.language === 'uz' ? 'Write Uzbek in LATIN script (Salom, harflar). Do NOT use Cyrillic.' : ''}

USER PROGRESS: ${knownCount}/28 letters known. Streak: ${streakDays} days.`;

  // Build chat history
  const chatMessages: { role: string; content: string }[] = [];
  if (Array.isArray(history)) {
    for (const h of history.slice(-6)) {
      if (h.role === 'user' || h.role === 'assistant') {
        chatMessages.push({ role: h.role, content: h.content });
      }
    }
  }
  chatMessages.push({ role: 'user', content: message });

  let reply: string | null = null;

  // For pro users with Anthropic key, try Anthropic first
  if (aiModel === 'anthropic' && ANTHROPIC_KEY) {
    reply = await callAnthropic(fullPrompt, chatMessages, aiMaxTokens);
  }

  // Fallback to Gemini (with appropriate token limit)
  if (!reply) {
    reply = await callGemini(fullPrompt, chatMessages, aiMaxTokens);
  }

  // Fallback to OpenRouter
  if (!reply) {
    reply = await callOpenRouter(fullPrompt, chatMessages, aiMaxTokens);
  }

  if (!reply) {
    res.status(502).json({ ok: false, error: 'AI temporarily unavailable. Please try again.' });
    return;
  }

  res.json({
    ok: true,
    data: {
      reply,
      usage: {
        dailyUsed: aiDailyUsed,
        dailyLimit: aiDailyLimit,
        plan: aiPlan,
      },
    },
  });
});
