import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, HelperText, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { formatPrice } from '../subscription/subscriptionService';
import type { CardDetails, SubscriptionPlan } from '../subscription/types';

interface CheckoutSheetProps {
  visible: boolean;
  plan: SubscriptionPlan | null;
  submitting: boolean;
  onDismiss: () => void;
  onPay: (card: CardDetails) => Promise<void>;
}

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export default function CheckoutSheet({ visible, plan, submitting, onDismiss, onPay }: CheckoutSheetProps) {
  const { colors, spacing, radius } = useAppTheme();

  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => {
    const digits = number.replace(/\s/g, '');
    const [mm, yy] = expiry.split('/');
    const expMonth = Number(mm);
    const expYear = yy ? 2000 + Number(yy) : NaN;
    const now = new Date();
    const expValid =
      expMonth >= 1 &&
      expMonth <= 12 &&
      !Number.isNaN(expYear) &&
      (expYear > now.getFullYear() || (expYear === now.getFullYear() && expMonth >= now.getMonth() + 1));
    const valid = digits.length >= 12 && expValid && cvc.length >= 3;
    return { digits, expMonth, expYear, valid };
  }, [number, expiry, cvc]);

  const reset = () => {
    setNumber('');
    setExpiry('');
    setCvc('');
    setError(null);
  };

  const handleDismiss = () => {
    if (submitting) return;
    reset();
    onDismiss();
  };

  const handlePay = async () => {
    setError(null);
    try {
      await onPay({ number: parsed.digits, expMonth: parsed.expMonth, expYear: parsed.expYear, cvc });
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed');
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleDismiss}
        contentContainerStyle={[
          styles.modal,
          { backgroundColor: colors.surface, borderRadius: radius.lg, margin: spacing.md },
        ]}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: spacing.lg }}>
            <View style={styles.header}>
              <Text variant="titleLarge">Checkout</Text>
              <IconButton icon="close" onPress={handleDismiss} disabled={submitting} />
            </View>

            {plan && (
              <View
                style={{
                  backgroundColor: colors.surfaceVariant,
                  borderRadius: radius.md,
                  padding: spacing.md,
                  marginBottom: spacing.lg,
                }}
              >
                <Text variant="titleMedium">{plan.name}</Text>
                {plan.description && (
                  <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: spacing.xs }}>
                    {plan.description}
                  </Text>
                )}
                <Divider style={{ marginVertical: spacing.sm }} />
                <Text variant="titleMedium" style={{ color: colors.primary }}>
                  {formatPrice(plan)}
                </Text>
              </View>
            )}

            <Text variant="labelLarge" style={{ marginBottom: spacing.sm }}>
              Card details
            </Text>

            <TextInput
              label="Card number"
              mode="outlined"
              value={number}
              onChangeText={v => setNumber(formatCardNumber(v))}
              keyboardType="number-pad"
              placeholder="4242 4242 4242 4242"
              left={<TextInput.Icon icon="credit-card-outline" />}
              style={{ marginBottom: spacing.md }}
              disabled={submitting}
            />

            <View style={styles.row}>
              <TextInput
                label="MM/YY"
                mode="outlined"
                value={expiry}
                onChangeText={v => setExpiry(formatExpiry(v))}
                keyboardType="number-pad"
                style={[styles.half, { marginRight: spacing.sm }]}
                disabled={submitting}
              />
              <TextInput
                label="CVC"
                mode="outlined"
                value={cvc}
                onChangeText={v => setCvc(v.replace(/\D/g, '').slice(0, 4))}
                keyboardType="number-pad"
                secureTextEntry
                style={styles.half}
                disabled={submitting}
              />
            </View>

            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>

            <Button
              mode="contained"
              icon="lock-outline"
              onPress={handlePay}
              loading={submitting}
              disabled={!parsed.valid || submitting}
            >
              {plan ? `Pay ${formatPrice(plan)}` : 'Pay'}
            </Button>

            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant, textAlign: 'center', marginTop: spacing.md }}
            >
              Test mode — use 4242 4242 4242 4242 for success, 4000 0000 0000 0002 to simulate a decline.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: { maxHeight: '90%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { flexDirection: 'row' },
  half: { flex: 1 },
});
