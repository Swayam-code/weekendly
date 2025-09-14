import { Activity, TimeOfDay, ScheduledActivity } from '@/types';

export const timeOfDayToHours: Record<TimeOfDay, number[]> = {
  [TimeOfDay.EARLY_MORNING]: [6, 7, 8],
  [TimeOfDay.MORNING]: [9, 10, 11],
  [TimeOfDay.AFTERNOON]: [12, 13, 14, 15, 16],
  [TimeOfDay.EVENING]: [17, 18, 19],
  [TimeOfDay.NIGHT]: [20, 21, 22],
};

export function suggestTimeForActivity(
  activity: Activity,
  day: 'friday' | 'saturday' | 'sunday' | 'monday',
  existingActivities: ScheduledActivity[]
): Date {
  // Get preferred times for this activity
  const preferredHours = activity.timeOfDay.flatMap(
    timeSlot => timeOfDayToHours[timeSlot]
  );

  // Get occupied time slots
  const occupiedHours = existingActivities.map(existing => {
    const date = new Date(existing.scheduledTime);
    return {
      start: date.getHours(),
      end: date.getHours() + Math.ceil(existing.duration / 60)
    };
  });

  // Find the best available time
  for (const hour of preferredHours) {
    const endHour = hour + Math.ceil(activity.duration / 60);
    
    // Check if this time slot conflicts with existing activities
    const hasConflict = occupiedHours.some(occupied => 
      (hour >= occupied.start && hour < occupied.end) ||
      (endHour > occupied.start && endHour <= occupied.end) ||
      (hour < occupied.start && endHour > occupied.end)
    );

    if (!hasConflict) {
      // Create date for the specified day
      const today = new Date();
      let dayOffset: number;
      
      switch (day) {
        case 'friday':
          dayOffset = (5 - today.getDay() + 7) % 7;
          break;
        case 'saturday':
          dayOffset = (6 - today.getDay() + 7) % 7;
          break;
        case 'sunday':
          dayOffset = (7 - today.getDay()) % 7;
          break;
        case 'monday':
          dayOffset = (1 - today.getDay() + 7) % 7;
          if (dayOffset === 0) dayOffset = 7; // Next Monday if today is Monday
          break;
        default:
          dayOffset = 0;
      }
      
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + dayOffset);
      scheduledDate.setHours(hour, 0, 0, 0);
      
      return scheduledDate;
    }
  }

  // If no preferred time is available, find any available slot
  for (let hour = 8; hour <= 20; hour++) {
    const endHour = hour + Math.ceil(activity.duration / 60);
    
    const hasConflict = occupiedHours.some(occupied => 
      (hour >= occupied.start && hour < occupied.end) ||
      (endHour > occupied.start && endHour <= occupied.end) ||
      (hour < occupied.start && endHour > occupied.end)
    );

    if (!hasConflict) {
      const today = new Date();
      let dayOffset: number;
      
      switch (day) {
        case 'friday':
          dayOffset = (5 - today.getDay() + 7) % 7;
          break;
        case 'saturday':
          dayOffset = (6 - today.getDay() + 7) % 7;
          break;
        case 'sunday':
          dayOffset = (7 - today.getDay()) % 7;
          break;
        case 'monday':
          dayOffset = (1 - today.getDay() + 7) % 7;
          if (dayOffset === 0) dayOffset = 7; // Next Monday if today is Monday
          break;
        default:
          dayOffset = 0;
      }
      
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + dayOffset);
      scheduledDate.setHours(hour, 0, 0, 0);
      
      return scheduledDate;
    }
  }

  // Fallback: just use current time plus some offset
  const fallbackDate = new Date();
  fallbackDate.setHours(fallbackDate.getHours() + 1);
  return fallbackDate;
}

export function validateSchedule(activities: ScheduledActivity[]): {
  isValid: boolean;
  conflicts: Array<{ activity1: string; activity2: string; reason: string }>;
  suggestions: Array<{ activityId: string; suggestion: string }>;
} {
  const conflicts: Array<{ activity1: string; activity2: string; reason: string }> = [];
  const suggestions: Array<{ activityId: string; suggestion: string }> = [];

  // Sort activities by scheduled time
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
  );

  // Check for time conflicts
  for (let i = 0; i < sortedActivities.length - 1; i++) {
    const current = sortedActivities[i];
    const next = sortedActivities[i + 1];

    const currentEnd = new Date(current.scheduledTime);
    currentEnd.setMinutes(currentEnd.getMinutes() + current.duration);

    const nextStart = new Date(next.scheduledTime);

    if (currentEnd > nextStart) {
      conflicts.push({
        activity1: current.name,
        activity2: next.name,
        reason: 'Time overlap detected'
      });
    }

    // Check if there's enough buffer time for meals
    if (current.category === 'food' || next.category === 'food') {
      const timeDiff = nextStart.getTime() - currentEnd.getTime();
      const bufferMinutes = 30; // 30 minutes buffer for meals

      if (timeDiff < bufferMinutes * 60 * 1000 && timeDiff > 0) {
        suggestions.push({
          activityId: next.id,
          suggestion: 'Consider adding more time between meals and other activities'
        });
      }
    }
  }

  // Check for unrealistic activity sequences
  for (let i = 0; i < sortedActivities.length - 1; i++) {
    const current = sortedActivities[i];
    const next = sortedActivities[i + 1];

    // Check for energy level mismatches
    if (current.mood === 'energetic' && next.mood === 'relaxed') {
      const timeBetween = new Date(next.scheduledTime).getTime() - 
                         new Date(current.scheduledTime).getTime() - 
                         (current.duration * 60 * 1000);
      
      if (timeBetween < 60 * 60 * 1000) { // Less than 1 hour between
        suggestions.push({
          activityId: next.id,
          suggestion: 'Consider adding buffer time between high-energy and relaxing activities'
        });
      }
    }
  }

  return {
    isValid: conflicts.length === 0,
    conflicts,
    suggestions
  };
}
