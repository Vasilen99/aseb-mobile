import { clearSubscription, loadSubscription, saveSubscription } from './storage';
import type { CardDetails, PaymentMethod, Subscription, SubscriptionPlan } from './types';

/**
 * Service contract. `mockSubscriptionService` implements it now;
 * later an `apiSubscriptionService` will call the backend (which talks to Stripe).
 */
export interface SubscriptionService {
  getPlans(): Promise<SubscriptionPlan[]>;
  getSubscription(username: string): Promise<Subscription | null>;
  subscribe(username: string, planId: string, card: CardDetails): Promise<Subscription>;
  cancelSubscription(username: string): Promise<Subscription>;
  resumeSubscription(username: string): Promise<Subscription>;
}

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'price_monthly_membership',
    name: 'Месечен абонамент',
    description: 'Пълен достъп до съдържание за членове, събития и предимства.',
    priceCents: 1000,
    currency: 'Euro',
    interval: 'month',
  },
];

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(() => resolve(), ms));

function detectBrand(number: string): PaymentMethod['brand'] {
  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return 'mastercard';
  if (/^3[47]/.test(number)) return 'amex';
  return 'unknown';
}

export const mockSubscriptionService: SubscriptionService = {
  async getPlans() {
    await delay(200);
    return MOCK_PLANS;
  },

  async getSubscription(username) {
    const sub = await loadSubscription(username);
    if (!sub) return null;

    // Auto-expire a canceled subscription whose period has ended.
    if (sub.cancelAtPeriodEnd && Date.now() >= sub.currentPeriodEnd) {
      await clearSubscription(username);
      return null;
    }
    return sub;
  },

  async subscribe(username, planId, card) {
    await delay(1200); // simulate network + Stripe processing

    const plan = MOCK_PLANS.find(p => p.id === planId);
    if (!plan) throw new Error('Unknown plan');

    const digits = card.number.replace(/\s+/g, '');
    if (digits.length < 12) throw new Error('Invalid card number');
    // Stripe test-card convention: 4000 0000 0000 0002 = declined
    if (digits === '4000000000000002') throw new Error('Your card was declined');

    const now = Date.now();
    const sub: Subscription = {
      id: `sub_mock_${now}`,
      planId,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: now + MONTH_MS,
      cancelAtPeriodEnd: false,
      paymentMethod: {
        id: `pm_mock_${now}`,
        brand: detectBrand(digits),
        last4: digits.slice(-4),
        expMonth: card.expMonth,
        expYear: card.expYear,
      },
    };

    await saveSubscription(username, sub);
    return sub;
  },

  async cancelSubscription(username) {
    await delay(600);
    const sub = await loadSubscription(username);
    if (!sub) throw new Error('No active subscription');
    const updated: Subscription = { ...sub, cancelAtPeriodEnd: true };
    await saveSubscription(username, updated);
    return updated;
  },

  async resumeSubscription(username) {
    await delay(600);
    const sub = await loadSubscription(username);
    if (!sub) throw new Error('No subscription to resume');
    const updated: Subscription = { ...sub, cancelAtPeriodEnd: false, status: 'active' };
    await saveSubscription(username, updated);
    return updated;
  },
};

/** Swap this export when the real API is ready. */
export const subscriptionService: SubscriptionService = mockSubscriptionService;

export function formatPrice(plan: SubscriptionPlan): string {
  const amount = (plan.priceCents / 100).toFixed(2);
  const currency = plan.currency.toUpperCase();
  return `${amount} ${currency} / ${plan.interval === 'month' ? 'месец' : 'година'}`;
}
