import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Activity, WeekendPlan, ScheduledActivity, WeekendTheme, ActivityCategory, Mood, TimeOfDay } from '@/types';
import { activities, weekendThemes } from '@/data/activities';
import { suggestTimeForActivity } from '@/lib/scheduling';
import { v4 as uuidv4 } from 'uuid';

interface AppStore {
  // Data
  activities: Activity[];
  weekendThemes: WeekendTheme[];
  currentPlan: WeekendPlan | null;
  savedPlans: WeekendPlan[];
  selectedTheme: WeekendTheme | null;
  
  // Filters
  filters: {
    categories: ActivityCategory[];
    moods: Mood[];
    timeOfDay: TimeOfDay[];
    searchTerm: string;
  };
  
  // UI State
  isLoading: boolean;
  
  // Actions
  initializeApp: () => void;
  createNewPlan: (name?: string) => void;
  setSelectedTheme: (theme: WeekendTheme | null) => void;
  addActivityToPlan: (activity: Activity, day: 'saturday' | 'sunday', time?: Date) => void;
  removeActivityFromPlan: (activityId: string) => void;
  reorderActivities: (day: 'saturday' | 'sunday', activities: ScheduledActivity[]) => void;
  updateActivityTime: (activityId: string, newTime: Date) => void;
  savePlan: () => void;
  loadPlan: (planId: string) => void;
  deletePlan: (planId: string) => void;
  
  // Export functionality
  exportPlanAsJSON: () => any | null;
  exportPlanAsText: () => string | null;
  generateShareableLink: () => string | null;
  
  // Filters
  setFilters: (filters: Partial<AppStore['filters']>) => void;
  clearFilters: () => void;
  
  // Getters
  getFilteredActivities: () => Activity[];
  getSuggestedActivities: () => Activity[];
}

const generateDefaultPlan = (): WeekendPlan => ({
  id: uuidv4(),
  name: 'My Weekend Plan',
  saturday: [],
  sunday: [],
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      activities: [],
      weekendThemes: [],
      currentPlan: null,
      savedPlans: [],
      selectedTheme: null,
      filters: {
        categories: [],
        moods: [],
        timeOfDay: [],
        searchTerm: '',
      },
      isLoading: false,
      
      // Actions
      initializeApp: () => {
        set({
          activities,
          weekendThemes,
          currentPlan: generateDefaultPlan(),
        });
      },
      
      createNewPlan: (name = 'My Weekend Plan') => {
        const newPlan = generateDefaultPlan();
        newPlan.name = name;
        set({ currentPlan: newPlan });
      },
      
      setSelectedTheme: (theme) => {
        set({ selectedTheme: theme });
        
        // Auto-populate activities based on theme
        if (theme && get().currentPlan) {
          const suggestedActivities = get().activities.filter(activity => 
            theme.suggestedActivities.includes(activity.id)
          );
          
          // Add some suggested activities to the plan
          suggestedActivities.slice(0, 4).forEach((activity, index) => {
            const day = index < 2 ? 'saturday' : 'sunday';
            get().addActivityToPlan(activity, day);
          });
        }
      },
      
      addActivityToPlan: (activity, day, time) => {
        const { currentPlan } = get();
        if (!currentPlan) return;
        
        // Use smart scheduling if no time is provided
        const suggestedTime = time || suggestTimeForActivity(activity, day, currentPlan[day]);
        
        const scheduledActivity: ScheduledActivity = {
          ...activity,
          id: uuidv4(), // Generate unique ID for scheduled activity
          originalActivityId: activity.id, // Keep reference to original activity
          scheduledTime: suggestedTime,
          day,
          order: currentPlan[day].length,
        };
        
        const updatedPlan = {
          ...currentPlan,
          [day]: [...currentPlan[day], scheduledActivity],
          updatedAt: new Date(),
        };
        
        set({ currentPlan: updatedPlan });
      },
      
      removeActivityFromPlan: (activityId) => {
        const { currentPlan } = get();
        if (!currentPlan) return;
        
        const updatedPlan = {
          ...currentPlan,
          saturday: currentPlan.saturday.filter(a => a.id !== activityId),
          sunday: currentPlan.sunday.filter(a => a.id !== activityId),
          updatedAt: new Date(),
        };
        
        set({ currentPlan: updatedPlan });
      },
      
      reorderActivities: (day, activities) => {
        const { currentPlan } = get();
        if (!currentPlan) return;
        
        const reorderedActivities = activities.map((activity, index) => ({
          ...activity,
          order: index,
        }));
        
        const updatedPlan = {
          ...currentPlan,
          [day]: reorderedActivities,
          updatedAt: new Date(),
        };
        
        set({ currentPlan: updatedPlan });
      },
      
      updateActivityTime: (activityId, newTime) => {
        const { currentPlan } = get();
        if (!currentPlan) return;
        
        const updateActivities = (activities: ScheduledActivity[]) =>
          activities.map(activity =>
            activity.id === activityId
              ? { ...activity, scheduledTime: newTime }
              : activity
          );
        
        const updatedPlan = {
          ...currentPlan,
          saturday: updateActivities(currentPlan.saturday),
          sunday: updateActivities(currentPlan.sunday),
          updatedAt: new Date(),
        };
        
        set({ currentPlan: updatedPlan });
      },
      
      savePlan: () => {
        const { currentPlan, savedPlans } = get();
        if (!currentPlan) return;
        
        const existingIndex = savedPlans.findIndex(p => p.id === currentPlan.id);
        let updatedPlans;
        
        if (existingIndex >= 0) {
          // Update existing plan
          updatedPlans = savedPlans.map((plan, index) =>
            index === existingIndex ? { ...currentPlan, updatedAt: new Date() } : plan
          );
        } else {
          // Add new plan
          updatedPlans = [...savedPlans, { ...currentPlan, updatedAt: new Date() }];
        }
        
        set({ savedPlans: updatedPlans });
      },
      
      loadPlan: (planId) => {
        const { savedPlans } = get();
        const plan = savedPlans.find(p => p.id === planId);
        if (plan) {
          set({ currentPlan: plan });
        }
      },
      
      deletePlan: (planId) => {
        const { savedPlans } = get();
        const updatedPlans = savedPlans.filter(p => p.id !== planId);
        set({ savedPlans: updatedPlans });
      },
      
      setFilters: (newFilters) => {
        const { filters } = get();
        set({
          filters: { ...filters, ...newFilters }
        });
      },
      
      clearFilters: () => {
        set({
          filters: {
            categories: [],
            moods: [],
            timeOfDay: [],
            searchTerm: '',
          }
        });
      },
      
      // Getters
      getFilteredActivities: () => {
        const { activities, filters } = get();
        
        return activities.filter(activity => {
          // Search term filter
          if (filters.searchTerm && !activity.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
              !activity.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
              !activity.tags.some(tag => tag.toLowerCase().includes(filters.searchTerm.toLowerCase()))) {
            return false;
          }
          
          // Category filter
          if (filters.categories.length > 0 && !filters.categories.includes(activity.category)) {
            return false;
          }
          
          // Mood filter
          if (filters.moods.length > 0 && !filters.moods.includes(activity.mood)) {
            return false;
          }
          
          // Time of day filter
          if (filters.timeOfDay.length > 0 && 
              !filters.timeOfDay.some(time => activity.timeOfDay.includes(time))) {
            return false;
          }
          
          return true;
        });
      },
      
      getSuggestedActivities: () => {
        const { selectedTheme, activities } = get();
        if (!selectedTheme) return [];
        
        return activities.filter(activity => 
          selectedTheme.suggestedActivities.includes(activity.id)
        );
      },

      // Export functionality
      exportPlanAsJSON: () => {
        const { currentPlan } = get();
        if (!currentPlan) return null;

        const exportData = {
          plan: currentPlan,
          exportedAt: new Date().toISOString(),
          version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `weekendly-plan-${currentPlan.id}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return exportData;
      },

      exportPlanAsText: () => {
        const { currentPlan } = get();
        if (!currentPlan) return null;

        const formatActivity = (activity: ScheduledActivity) => {
          const time = new Date(activity.scheduledTime).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          return `${time} - ${activity.name} (${activity.duration}min)`;
        };

        const saturdayText = currentPlan.saturday.length > 0 
          ? currentPlan.saturday
              .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
              .map(formatActivity)
              .join('\n')
          : 'No activities planned';

        const sundayText = currentPlan.sunday.length > 0
          ? currentPlan.sunday
              .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
              .map(formatActivity)
              .join('\n')
          : 'No activities planned';

        const textContent = `Weekend Plan - ${currentPlan.name}
Created: ${new Date(currentPlan.createdAt).toLocaleDateString()}

SATURDAY
${saturdayText}

SUNDAY
${sundayText}

Generated by Weekendly`;

        const dataBlob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `weekendly-plan-${currentPlan.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return textContent;
      },

      generateShareableLink: () => {
        const { currentPlan } = get();
        if (!currentPlan) return null;

        // Create a simplified version of the plan for URL sharing
        const shareData = {
          name: currentPlan.name,
          activities: {
            saturday: currentPlan.saturday.map(a => ({
              name: a.name,
              time: a.scheduledTime,
              duration: a.duration
            })),
            sunday: currentPlan.sunday.map(a => ({
              name: a.name,
              time: a.scheduledTime,
              duration: a.duration
            }))
          }
        };

        // Encode the data
        const encodedData = encodeURIComponent(JSON.stringify(shareData));
        const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${encodedData}`;

        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
          console.log('Share link copied to clipboard');
        }).catch(err => {
          console.error('Failed to copy share link:', err);
        });

        return shareUrl;
      },
    }),
    {
      name: 'weekendly-storage',
      partialize: (state) => ({
        savedPlans: state.savedPlans,
        selectedTheme: state.selectedTheme,
        filters: state.filters,
      }),
    }
  )
);
