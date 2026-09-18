import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Dialog, Divider, List, Portal, Snackbar, Text } from 'react-native-paper';
import { useAuth } from '../auth/AuthContext';
import { useSubscription } from '../subscription/SubscriptionContext';
import type { CardDetails } from '../subscription/types';
import SubscriptionCard from '../components/SubscriptionCard';
import CheckoutSheet from '../components/CheckoutSheet';
import { useAppTheme } from '../theme';

export default function ProfileScreen() {
  const { colors, spacing } = useAppTheme();
  const { user, logout } = useAuth();
  const { plans, subscription, isLoading, isMutating, subscribe, cancel, resume } = useSubscription();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [snack, setSnack] = useState<{ text: string; error?: boolean } | null>(null);

  const plan = plans[0] ?? null;
  const initials = (user?.username ?? '?').slice(0, 2).toUpperCase();
  const isMember = !!subscription && subscription.status === 'active';

  const handlePay = async (card: CardDetails) => {
    if (!plan) return;
    await subscribe(plan.id, card); // errors propagate to CheckoutSheet
    setCheckoutOpen(false);
    setSnack({ text: 'Subscription activated. Welcome aboard!' });
  };

  const handleCancel = async () => {
    setConfirmCancel(false);
    try {
      await cancel();
      setSnack({ text: 'Subscription will end at the current period.' });
    } catch (e) {
      setSnack({ text: e instanceof Error ? e.message : 'Could not cancel', error: true });
    }
  };

  const handleResume = async () => {
    try {
      await resume();
      setSnack({ text: 'Subscription resumed.' });
    } catch (e) {
      setSnack({ text: e instanceof Error ? e.message : 'Could not resume', error: true });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={[styles.header, { padding: spacing.xl }]}>
          <Avatar.Text size={80} label={initials} />
          <Text variant="headlineSmall" style={{ marginTop: spacing.md }}>
            {user?.username}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            {isMember ? 'Член' : 'Гост'}
          </Text>
        </View>

        <Divider />

        <SubscriptionCard
          plan={plan}
          subscription={subscription}
          loading={isLoading}
          mutating={isMutating}
          onSubscribe={() => setCheckoutOpen(true)}
          onCancel={() => setConfirmCancel(true)}
          onResume={handleResume}
        />

        <List.Section>
          <List.Item
            title="Потребителско име"
            description={user?.username}
            left={props => <List.Icon {...props} icon="account-outline" />}
          />
        </List.Section>

        <View style={{ padding: spacing.lg }}>
          <Button mode="outlined" icon="logout" onPress={logout}>
            Изход
          </Button>
        </View>
      </ScrollView>

      <CheckoutSheet
        visible={checkoutOpen}
        plan={plan}
        submitting={isMutating}
        onDismiss={() => setCheckoutOpen(false)}
        onPay={handlePay}
      />

      <Portal>
        <Dialog visible={confirmCancel} onDismiss={() => setConfirmCancel(false)}>
          <Dialog.Title>Cancel subscription?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Ще запазите достъпа до{' '}
              {subscription ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'края на периода'}.
              Можете да възобновите по всяко време преди това.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmCancel(false)}>Запази</Button>
            <Button textColor={colors.error} onPress={handleCancel}>
              Отмяна на абонамента
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={!!snack}
        onDismiss={() => setSnack(null)}
        duration={3000}
        style={snack?.error ? { backgroundColor: colors.error } : undefined}
      >
        {snack?.text}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center' },
});
