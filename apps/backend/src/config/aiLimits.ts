export const AI_LIMITS = {
  free: { dailyRequests: 10, model: 'gemini' as const, maxTokens: 300 },
  pro: { dailyRequests: Infinity, model: 'anthropic' as const, maxTokens: 1000 },
};
