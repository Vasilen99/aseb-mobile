import React from 'react';
import PostsList from '../components/PostsList';
import { NEWS_CATEGORY_ID } from '../api/wordpress';

export default function NewsScreen() {
  return (
    <PostsList
      categoryId={NEWS_CATEGORY_ID}
      icon="newspaper-variant-outline"
      emptyText="No news yet."
    />
  );
}
