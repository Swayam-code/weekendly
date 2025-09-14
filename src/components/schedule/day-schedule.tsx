'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScheduledActivity } from '@/types';
import { ScheduledActivityCard } from './scheduled-activity-card';
import { ScheduleValidator } from './ScheduleValidator';
import { useAppStore } from '@/stores/app-store';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface DayScheduleProps {
  day: 'friday' | 'saturday' | 'sunday' | 'monday';
  activities: ScheduledActivity[];
  title?: string;
  showHeader?: boolean;
  onReorder?: (activities: ScheduledActivity[]) => void;
}

export function DaySchedule({ 
  day, 
  activities, 
  title, 
  showHeader = true,
  onReorder 
}: DayScheduleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { reorderActivities } = useAppStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = activities.findIndex((activity) => activity.id === active.id);
      const newIndex = activities.findIndex((activity) => activity.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedActivities = arrayMove(activities, oldIndex, newIndex);
        if (onReorder) {
          onReorder(reorderedActivities);
        } else {
          reorderActivities(day, reorderedActivities);
        }
      }
    }
  }

  const getTotalDuration = () => {
    return activities.reduce((total, activity) => total + activity.duration, 0);
  };

  const formatTotalDuration = (minutes: number) => {
    if (minutes === 0) return '0h';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getActivityCount = () => activities.length;

  return (
    <Card 
      className="h-full transition-all duration-200 hover:shadow-lg bg-white/70 backdrop-blur-sm border-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showHeader && title && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {title}
              </span>
            </CardTitle>
            
            {activities.length > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {getActivityCount()} {getActivityCount() === 1 ? 'activity' : 'activities'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {formatTotalDuration(getTotalDuration())}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent className={`${showHeader ? 'pt-0' : 'pt-4'} space-y-3`}>
        {activities.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="text-gray-300 text-4xl mb-3">Calendar</div>
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              No activities planned
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Add some activities to start planning your {day}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </motion.div>
        ) : (
          <>
            <ScheduleValidator activities={activities} day={day} />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
            <SortableContext items={activities.map(a => a.id)} strategy={verticalListSortingStrategy}>
              <AnimatePresence mode="popLayout">
                {activities
                  .sort((a, b) => a.order - b.order)
                  .map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ScheduledActivityCard activity={activity} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </SortableContext>
          </DndContext>
          </>
        )}

        {/* Quick Stats */}
        {activities.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
            className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-purple-600">
                  {getActivityCount()}
                </div>
                <div className="text-xs text-gray-600">Activities</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">
                  {formatTotalDuration(getTotalDuration())}
                </div>
                <div className="text-xs text-gray-600">Duration</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">
                  {new Set(activities.map(a => a.category)).size}
                </div>
                <div className="text-xs text-gray-600">Categories</div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
