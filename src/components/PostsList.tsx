import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { fetchPosts } from '../api/wordpress';
import { useAppTheme } from '../theme';
import type { WPPost } from '../types/wordpress';
import PostCard from './PostCard';
import PulseLoader from './PulseLoader';

interface PostsListProps {
  categoryId: number;
  icon?: string;
  emptyText?: string;
  /** Optional heading rendered above the list. */
  title?: string;
}

export default function PostsList({
  categoryId,
  icon = 'newspaper-variant-outline',
  emptyText = 'Nothing here yet.',
  title,
}: PostsListProps) {
  const { colors, spacing } = useAppTheme();
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (isRefresh = false) => {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      try {
        setPosts(await fetchPosts({ categories: categoryId }));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [categoryId],
  );

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <PulseLoader />;
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background, padding: spacing.lg }]}>
        <Text variant="bodyLarge" style={{ color: colors.error, marginBottom: spacing.md }}>
          {error}
        </Text>
        <Button mode="contained" onPress={() => load()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xl }}
      data={posts}
      keyExtractor={item => String(item.id)}
      refreshing={refreshing}
      onRefresh={() => load(true)}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        title ? (
          <Text
            variant="headlineSmall"
            style={{ marginHorizontal: spacing.md, marginBottom: spacing.md }}
          >
            {title}
          </Text>
        ) : null
      }
      renderItem={({ item }) => <PostCard post={item} fallbackIcon={icon} />}
      ListEmptyComponent={
        <View style={[styles.center, { padding: spacing.lg }]}>
          <Text variant="bodyLarge">{emptyText}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
