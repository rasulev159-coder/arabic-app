import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { prisma } from '../lib/prisma';

export const chatRouter = Router();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';

const SYSTEM_PROMPT = `You are an Arabic alphabet teacher for Uzbekistani students learning to read Arabic from scratch.

RULES:
- Answer in the SAME LANGUAGE the user writes in (Uzbek, Russian, or English)
- Keep answers SHORT: 2-5 sentences maximum
- Focus ONLY on Arabic alphabet, letters, reading rules
- You know all 28 Arabic letters, their 4 forms (isolated, initial, medial, final)
- You know: harakat (fatha/kasra/damma), sukun, shadda, tanwin, madd, sun/moon letters
- You know the Muallim Soniy textbook structure
- When explaining letter differences, show the actual Arabic letters
- Be encouraging and supportive
- If asked something unrelated to Arabic alphabet, politely redirect

SIMILAR LETTERS REFERENCE:
ب ت ث — same shape, differ by dots: ب 1 dot below, ت 2 dots above, ث 3 dots above
ج ح خ — same shape: ج dot inside, ح no dot, خ dot above
د ذ — ذ has dot above
ر ز — ز has dot above
س ش — ش has 3 dots above
ص ض — ض has dot above
ط ظ — ظ has dot above
ع غ — غ has dot above
ف ق — ف 1 dot above, ق 2 dots above

NON-CONNECTING LETTERS (don't connect to next letter): ا د ذ ر ز و`;

chatRouter.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!OPENROUTER_KEY) {
    res.status(503).json({ ok: false, error: 'Chat not configured' });
    return;
  }

  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ ok: false, error: 'Missing message' });
    return;
  }

  // Get user context
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

  const contextPrompt = `${SYSTEM_PROMPT}

USER CONTEXT:
- Known letters (${knownCount}/28): ${knownLetters}
- Current streak: ${streakDays} days
- User language preference: ${user?.language || 'uz'}`;

  // Build messages array
  const messages: { role: string; content: string }[] = [
    { role: 'system', content: contextPrompt },
  ];

  // Add recent history (max 6 messages for context)
  if (Array.isArray(history)) {
    for (const h of history.slice(-6)) {
      if (h.role === 'user' || h.role === 'assistant') {
        messages.push({ role: h.role, content: h.content });
      }
    }
  }

  messages.push({ role: 'user', content: message });

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://arabic-app-ruddy.vercel.app',
        'X-Title': 'Arab Alifbosi',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages,
        max_tokens: 300,
      }),
    });

    const data = await response.json() as any;
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      res.status(502).json({ ok: false, error: 'No response from AI' });
      return;
    }

    res.json({ ok: true, data: { reply } });
  } catch (e: any) {
    console.error('Chat error:', e.message);
    res.status(502).json({ ok: false, error: 'AI service unavailable' });
  }
});
