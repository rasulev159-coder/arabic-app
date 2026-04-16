export const PLANS = {
  monthly: {
    key: 'monthly' as const,
    days: 30,
    price: { UZS: 30000 },
  },
  yearly: {
    key: 'yearly' as const,
    days: 365,
    price: { UZS: 250000 },
  },
};

export type PlanType = keyof typeof PLANS;
