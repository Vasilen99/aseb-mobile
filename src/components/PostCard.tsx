import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, Chip, Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  decodeHtmlEntities,
  formatPostDate,
  getCategoryNames,
  getFeaturedImage,
  stripHtml,
} from '../api/wordpress';
import { useAppTheme } from '../theme';
import type { WPPost } from '../types/wordpress';
import type { RootStackParamList } from '../screens/PostDetailScreen';

interface PostCardProps {
  post: WPPost;
  /** Icon shown when the post has no featured image. */
  fallbackIcon?: string;
}

export default function PostCard({ post, fallbackIcon = 'newspaper-variant-outline' }: PostCardProps) {
  const { colors, spacing, radius } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [imageFailed, setImageFailed] = useState(false);

  const title = useMemo(() => decodeHtmlEntities(post.title.rendered), [post.title.rendered]);
  const excerpt = useMemo(() => stripHtml(post.excerpt.rendered), [post.excerpt.rendered]);
  const image = useMemo(() => getFeaturedImage(post), [post]);
  const categories = useMemo(() => getCategoryNames(post), [post]);

  const openArticle = () => navigation.navigate('PostDetail', { post });

  return (
    <Card
      mode="elevated"
      style={{ marginHorizontal: spacing.md, marginBottom: spacing.md, borderRadius: radius.lg }}
      onPress={openArticle}
    >
      {image && !imageFailed ? (
        <Image
          source={{ uri: image }}
          style={[styles.image, { borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg }]}
          resizeMode="cover"
          onError={() => setImageFailed(true)}
          accessibilityIgnoresInvertColors
        />
      ) : (
        <View
          style={[
            styles.image,
            styles.placeholder,
            {
              backgroundColor: colors.primaryContainer,
              borderTopLeftRadius: radius.lg,
              borderTopRightRadius: radius.lg,
            },
          ]}
        >
          <Chip icon={fallbackIcon} compact textStyle={{ color: colors.onPrimaryContainer }} style={{ backgroundColor: 'transparent' }}>
            {categories[0] ?? 'ASEB'}
          </Chip>
        </View>
      )}

      <Card.Content style={{ paddingTop: spacing.md }}>
        <View style={styles.metaRow}>
          <Text variant="labelMedium" style={{ color: colors.primary }}>
            {formatPostDate(post.date)}
          </Text>
          {categories.length > 0 && (
            <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }} numberOfLines={1}>
              {categories.join(' · ')}
            </Text>
          )}
        </View>

        <Text variant="titleMedium" style={{ marginTop: spacing.xs, lineHeight: 24 }} numberOfLines={3}>
          {title}
        </Text>

        {excerpt.length > 0 && (
          <Text
            variant="bodyMedium"
            style={{ color: colors.onSurfaceVariant, marginTop: spacing.sm }}
            numberOfLines={3}
          >
            {excerpt}
          </Text>
        )}
      </Card.Content>

      <Card.Actions style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.sm }}>
        <TouchableRipple onPress={openArticle} borderless style={{ borderRadius: radius.full }}>
          <View style={styles.readMore}>
            <Text variant="labelLarge" style={{ color: colors.primary }}>
              Read more
            </Text>
            <Text variant="labelLarge" style={{ color: colors.primary, marginLeft: spacing.xs }}>
              →
            </Text>
          </View>
        </TouchableRipple>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 180 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  readMore: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 8 },
});
