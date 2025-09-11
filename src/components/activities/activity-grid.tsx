'use client';

import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app-store';
import { ActivityCard } from './activity-card';
import { EmptyState } from '@/components/ui/ErrorBoundary';

export function ActivityGrid() {
  const { getFilteredActivities, clearFilters } = useAppStore();
  const filteredActivities = getFilteredActivities();

  if (filteredActivities.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No activities found"
        description="Try adjusting your filters or search terms to discover more activities."
        action={
          <Button onClick={clearFilters} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
      {filteredActivities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ActivityCard activity={activity} />
        </motion.div>
      ))}
    </div>
  );
}
