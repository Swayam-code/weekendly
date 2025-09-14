'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { DaySchedule } from './day-schedule';
import { WeekendStats } from './WeekendStats';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { ScheduledActivityCard } from './scheduled-activity-card';

export function WeekendSchedule() {
  const { currentPlan, reorderActivities } = useAppStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Optional: Add drag start feedback
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    // Handle reordering logic here
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Determine which day the items belong to and reorder
    if (currentPlan) {
      // Find which arrays contain these items and reorder them
      const saturdayIndex = currentPlan.saturday.findIndex(item => item.id === activeId);
      const sundayIndex = currentPlan.sunday.findIndex(item => item.id === activeId);
      
      if (saturdayIndex !== -1) {
        const activities = [...currentPlan.saturday];
        const overIndex = activities.findIndex(item => item.id === overId);
        if (overIndex !== -1) {
          const [removed] = activities.splice(saturdayIndex, 1);
          activities.splice(overIndex, 0, removed);
          reorderActivities('saturday', activities);
        }
      } else if (sundayIndex !== -1) {
        const activities = [...currentPlan.sunday];
        const overIndex = activities.findIndex(item => item.id === overId);
        if (overIndex !== -1) {
          const [removed] = activities.splice(sundayIndex, 1);
          activities.splice(overIndex, 0, removed);
          reorderActivities('sunday', activities);
        }
      }
    }
  };

  if (!currentPlan) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">Planning</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No weekend plan selected
          </h2>
          <p className="text-gray-500">
            Create a new plan to start organizing your weekend
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 max-w-full overflow-hidden"
      >
        <WeekendStats 
          saturdayActivities={currentPlan.saturday}
          sundayActivities={currentPlan.sunday}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">
          <DaySchedule
            day="saturday"
            activities={currentPlan.saturday}
            title="Saturday"
          />
          <DaySchedule
            day="sunday"
            activities={currentPlan.sunday}
            title="Sunday"
          />
        </div>
      </motion.div>
    </DndContext>
  );
}
