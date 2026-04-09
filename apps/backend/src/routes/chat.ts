import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { prisma } from '../lib/prisma';

export const chatRouter = Router();

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';

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

28 Arabic letters in order:
ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي

SIMILAR LETTERS (differ only by dots):
- ب (1 dot below) vs ت (2 dots above) vs ث (3 dots above) — same base shape
- ج (dot inside) vs ح (no dot) vs خ (dot above) — same base shape
- د (no dot) vs ذ (dot above)
- ر (no dot) vs ز (dot above)
- س (no dots) vs ش (3 dots above)
- ص (no dot) vs ض (dot above)
- ط (no dot) vs ظ (dot above)
- ع (no dot) vs غ (dot above)
- ف (1 dot above) vs ق (2 dots above)

6 NON-CONNECTING letters (never connect to the NEXT letter): ا د ذ ر ز و
The other 22 letters connect from both sides.

VOWEL MARKS (harakat):
- Fatha َ = "a" sound (dash above)
- Kasra ِ = "i" sound (dash below)
- Damma ُ = "u" sound (loop above)
- Sukun ْ = no vowel (circle above)
- Shadda ّ = double the letter (w-shape above)
- Tanwin: ً = -an, ٍ = -in, ٌ = -un

SUN LETTERS (lam in "al-" is SILENT, next letter doubles): ت ث د ذ ر ز س ش ص ض ط ظ ل ن
Example: الشمس = ash-shamsu (not al-shamsu)

MOON LETTERS (lam in "al-" is PRONOUNCED): ا ب ج ح خ ع غ ف ق ك م ه و ي
Example: القمر = al-qamaru

MADD (elongation):
- Fatha + Alif = long "aa": كتاب = kitaab
- Kasra + Ya = long "ii": كبير = kabiir
- Damma + Waw = long "uu": نور = nuur`;

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

  const langName = user?.language === 'ru' ? 'Russian' : user?.language === 'en' ? 'English' : 'Uzbek Latin';
  const contextPrompt = `${SYSTEM_PROMPT}

MANDATORY: You MUST answer in ${langName}. Do NOT use any other language.
${user?.language === 'uz' ? 'Write in Uzbek LATIN script (like: Salom, harflar, o\'rganing). Do NOT use Cyrillic for Uzbek.' : ''}

USER CONTEXT:
- Known letters (${knownCount}/28): ${knownLetters}
- Current streak: ${streakDays} days`;

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
