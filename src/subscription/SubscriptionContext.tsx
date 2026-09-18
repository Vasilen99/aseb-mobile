import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { useAuth } from '../auth/AuthContext';
import { subscriptionService } from './subscriptionService';
import type { CardDetails, Subscription, SubscriptionPlan } from './types';

interface SubscriptionContextValue {
  plans: SubscriptionPlan[];
  subscription: Subscription | null;
  isLoading: boolean;
  isMutating: boolean;
  subscribe: (planId: string, card: CardDetails) => Promise<void>;
  cancel: () => Promise<void>;
  resume: () => Promise<void>;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({ children }: PropsWithChildren) {
  const { user, isAuthenticated } = useAuth();
  const username = user?.username;

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const refresh = useCallback(async () => {
    if (!username) {
      setSubscription(null);
      return;
    }
    setIsLoading(true);
    try {
      const [p, s] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getSubscription(username),
      ]);
      setPlans(p);
      setSubscription(s);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  // Load on login, clear on logout
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setSubscription(null);
    }
  }, [isAuthenticated, refresh]);

  const requireUser = () => {
    if (!username) throw new Error('You must be logged in');
    return username;
  };

  const subscribe = useCallback(async (planId: string, card: CardDetails) => {
    const u = requireUser();
    setIsMutating(true);
    try {
      setSubscription(await subscriptionService.subscribe(u, planId, card));
    } finally {
      setIsMutating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const cancel = useCallback(async () => {
    const u = requireUser();
    setIsMutating(true);
    try {
      setSubscription(await subscriptionService.cancelSubscription(u));
    } finally {
      setIsMutating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const resume = useCallback(async () => {
    const u = requireUser();
    setIsMutating(true);
    try {
      setSubscription(await subscriptionService.resumeSubscription(u));
    } finally {
      setIsMutating(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const value = useMemo<SubscriptionContextValue>(
    () => ({ plans, subscription, isLoading, isMutating, subscribe, cancel, resume, refresh }),
    [plans, subscription, isLoading, isMutating, subscribe, cancel, resume, refresh],
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within a SubscriptionProvider');
  return ctx;
}
