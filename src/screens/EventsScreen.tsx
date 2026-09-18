import React from 'react';
import PostsList from '../components/PostsList';
import { EVENTS_CATEGORY_ID } from '../api/wordpress';

export default function EventsScreen() {
  return (
    <PostsList
      categoryId={EVENTS_CATEGORY_ID}
      icon="calendar-outline"
      emptyText="No events yet."
    />
  );
}
