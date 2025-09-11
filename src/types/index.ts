export interface Activity {
  id: string;
  name: string;
  description: string;
  category: ActivityCategory;
  duration: number; // in minutes
  timeOfDay: TimeOfDay[];
  mood: Mood;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
  tags: string[];
}

export interface ScheduledActivity extends Activity {
  originalActivityId?: string; // Reference to the original activity ID
  scheduledTime: Date;
  day: 'saturday' | 'sunday';
  order: number;
}

export enum ActivityCategory {
  FOOD = 'food',
  OUTDOOR = 'outdoor',
  INDOOR = 'indoor',
  SOCIAL = 'social',
  RELAX = 'relax',
  FITNESS = 'fitness',
  CULTURE = 'culture',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
}

export enum TimeOfDay {
  EARLY_MORNING = 'early_morning', // 6-9 AM
  MORNING = 'morning', // 9-12 PM
  AFTERNOON = 'afternoon', // 12-5 PM
  EVENING = 'evening', // 5-8 PM
  NIGHT = 'night', // 8 PM+
}

export enum Mood {
  ENERGETIC = 'energetic',
  RELAXED = 'relaxed',
  SOCIAL = 'social',
  FOCUSED = 'focused',
  ADVENTUROUS = 'adventurous',
  COZY = 'cozy',
}

export interface WeekendTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  suggestedActivities: string[]; // Activity IDs
}

export interface WeekendPlan {
  id: string;
  name: string;
  theme?: WeekendTheme;
  saturday: ScheduledActivity[];
  sunday: ScheduledActivity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  activities: Activity[];
  currentPlan: WeekendPlan | null;
  savedPlans: WeekendPlan[];
  selectedTheme: WeekendTheme | null;
  filters: {
    categories: ActivityCategory[];
    moods: Mood[];
    timeOfDay: TimeOfDay[];
  };
}

export interface DragItem {
  id: string;
  type: 'activity' | 'scheduled-activity';
  data: Activity | ScheduledActivity;
}
