/**
 * Subscription domain types.
 * Shapes intentionally mirror Stripe objects so the real API maps 1:1 later.
 */

export type SubscriptionInterval = 'month' | 'year';

export interface SubscriptionPlan {
  /** Stripe Price ID later (e.g. "price_123") */
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  /** ISO 4217, lowercase like Stripe (e.g. "bgn", "eur") */
  currency: string;
  interval: SubscriptionInterval;
}

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'unpaid';

export interface PaymentMethod {
  /** Stripe PaymentMethod ID later (e.g. "pm_123") */
  id: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'unknown';
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface Subscription {
  /** Stripe Subscription ID later (e.g. "sub_123") */
  id: string;
  planId: string;
  status: SubscriptionStatus;
  /** Unix epoch (ms) */
  currentPeriodStart: number;
  /** Unix epoch (ms) */
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  paymentMethod: PaymentMethod;
}

/** Raw card input from the (mock) checkout form. */
export interface CardDetails {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}
