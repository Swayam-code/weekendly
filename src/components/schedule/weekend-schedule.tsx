'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { DaySchedule } from './day-schedule';
import { WeekendStats } from './WeekendStats';

export function WeekendSchedule() {
  const { currentPlan } = useAppStore();

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <WeekendStats 
        saturdayActivities={currentPlan.saturday}
        sundayActivities={currentPlan.sunday}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  );
}
