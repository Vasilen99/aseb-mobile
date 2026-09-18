import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Text } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { formatPrice } from '../subscription/subscriptionService';
import type { Subscription, SubscriptionPlan } from '../subscription/types';

interface SubscriptionCardProps {
  plan: SubscriptionPlan | null;
  subscription: Subscription | null;
  loading: boolean;
  mutating: boolean;
  onSubscribe: () => void;
  onCancel: () => void;
  onResume: () => void;
}

const brandIcon: Record<Subscription['paymentMethod']['brand'], string> = {
  visa: 'credit-card-outline',
  mastercard: 'credit-card-outline',
  amex: 'credit-card-outline',
  unknown: 'credit-card-outline',
};

export default function SubscriptionCard({
  plan,
  subscription,
  loading,
  mutating,
  onSubscribe,
  onCancel,
  onResume,
}: SubscriptionCardProps) {
  const { colors, spacing } = useAppTheme();

  if (loading) {
    return (
      <Card mode="outlined" style={{ margin: spacing.md }}>
        <Card.Content style={styles.center}>
          <ActivityIndicator />
        </Card.Content>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card mode="outlined" style={{ margin: spacing.md }}>
        <Card.Title title="Абонамент" subtitle="Не сте абонирани" left={props => <Chip {...props} icon="star-outline" compact>Безплатен</Chip>} />
        <Card.Content>
          {plan ? (
            <>
              <Text variant="titleMedium">{plan.name}</Text>
              {plan.description && (
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
                  {plan.description}
                </Text>
              )}
              <Text variant="titleMedium" style={{ color: colors.primary, marginTop: spacing.sm }}>
                {formatPrice(plan)}
              </Text>
            </>
          ) : (
            <Text variant="bodyMedium">Няма налични планове.</Text>
          )}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" icon="credit-card-plus-outline" onPress={onSubscribe} disabled={!plan || mutating}>
            Абонирай се
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  // ---- Has subscription ----
  const renews = new Date(subscription.currentPeriodEnd).toLocaleDateString();
  const pendingCancel = subscription.cancelAtPeriodEnd;
  const statusLabel = pendingCancel ? 'Cancels soon' : subscription.status === 'active' ? 'Active' : subscription.status;
  const statusColor = pendingCancel ? colors.warning : subscription.status === 'active' ? colors.success : colors.error;

  return (
    <Card mode="outlined" style={{ margin: spacing.md }}>
      <Card.Title
        title="Membership"
        subtitle={plan?.name ?? subscription.planId}
        right={() => (
          <Chip compact style={{ marginRight: spacing.md, backgroundColor: statusColor }} textStyle={{ color: colors.onPrimary }}>
            {statusLabel}
          </Chip>
        )}
      />
      <Card.Content>
        <View style={styles.row}>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            {pendingCancel ? 'Access until' : 'Renews on'}
          </Text>
          <Text variant="bodyMedium">{renews}</Text>
        </View>
        {plan && (
          <View style={[styles.row, { marginTop: spacing.xs }]}>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              Цена
            </Text>
            <Text variant="bodyMedium">{formatPrice(plan)}</Text>
          </View>
        )}
        <View style={[styles.row, { marginTop: spacing.xs }]}>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
            Метод на плащане
          </Text>
          <Chip compact icon={brandIcon[subscription.paymentMethod.brand]}>
            {`${subscription.paymentMethod.brand.toUpperCase()} •••• ${subscription.paymentMethod.last4}`}
          </Chip>
        </View>
      </Card.Content>
      <Card.Actions>
        {pendingCancel ? (
          <Button mode="contained" icon="refresh" onPress={onResume} loading={mutating} disabled={mutating}>
            Възобнови
          </Button>
        ) : (
          <Button mode="outlined" icon="cancel" textColor={colors.error} onPress={onCancel} loading={mutating} disabled={mutating}>
            Отмяна на абонамента
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
