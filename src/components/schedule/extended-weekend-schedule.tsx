import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DaySchedule } from './day-schedule';
import { useAppStore } from '@/stores/app-store';
import { ScheduledActivity } from '@/types';
import { Calendar, Clock, Plus, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface ExtendedWeekendScheduleProps {
  showFriday?: boolean;
  showMonday?: boolean;
  isLongWeekend?: boolean;
}

export function ExtendedWeekendSchedule({ 
  showFriday = false, 
  showMonday = false,
  isLongWeekend = false 
}: ExtendedWeekendScheduleProps) {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({
    friday: true,
    saturday: true,
    sunday: true,
    monday: true
  });

  const { currentPlan, reorderActivities } = useAppStore();

  if (!currentPlan) {
    return (
      <Card className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardContent>
          <Calendar className="h-12 w-12 mx-auto text-purple-300 mb-4" />
          <p className="text-gray-500 mb-4">No weekend plan created yet</p>
          <Button 
            onClick={() => useAppStore.getState().createNewPlan()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  const toggleDayExpansion = (day: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const getDayLabel = (day: string) => {
    const labels = {
      friday: 'Friday',
      saturday: 'Saturday', 
      sunday: 'Sunday',
      monday: 'Monday'
    };
    return labels[day as keyof typeof labels] || day;
  };

  const getDayColor = (day: string) => {
    const colors = {
      friday: 'from-blue-500 to-blue-600',
      saturday: 'from-purple-500 to-purple-600',
      sunday: 'from-pink-500 to-pink-600', 
      monday: 'from-green-500 to-green-600'
    };
    return colors[day as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getActivityCount = (day: string) => {
    const activities = currentPlan[day as keyof typeof currentPlan] as ScheduledActivity[] | undefined;
    return activities?.length || 0;
  };

  const getTotalDuration = (day: string) => {
    const activities = currentPlan[day as keyof typeof currentPlan] as ScheduledActivity[] | undefined;
    if (!activities) return 0;
    return activities.reduce((total, activity) => total + activity.duration, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const days = [
    ...(showFriday ? ['friday'] : []),
    'saturday',
    'sunday',
    ...(showMonday ? ['monday'] : [])
  ];

  const totalActivities = days.reduce((total, day) => total + getActivityCount(day), 0);
  const totalDuration = days.reduce((total, day) => total + getTotalDuration(day), 0);

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header with stats */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2 min-w-0">
              <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0" />
              <CardTitle className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                {isLongWeekend ? 'Long Weekend Plan' : 'Weekend Plan'}
              </CardTitle>
              {isLongWeekend && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white flex-shrink-0">
                  {days.length} Days
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 flex-shrink-0">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{totalActivities} activities</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(totalDuration)}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">{currentPlan.name}</p>
        </CardHeader>
      </Card>

      {/* Day schedules */}
      <div className="space-y-4 max-w-full overflow-hidden">
        <AnimatePresence>
          {days.map((day, index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow max-w-full">
                <CardHeader 
                  className={`cursor-pointer bg-gradient-to-r ${getDayColor(day)} text-white`}
                  onClick={() => toggleDayExpansion(day)}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-3 min-w-0">
                      <h3 className="text-lg font-semibold truncate">{getDayLabel(day)}</h3>
                      <Badge variant="secondary" className="bg-white/20 text-white flex-shrink-0">
                        {getActivityCount(day)} activities
                      </Badge>
                      {getTotalDuration(day) > 0 && (
                        <div className="flex items-center space-x-1 text-white/80 text-sm">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(getTotalDuration(day))}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 flex-shrink-0"
                    >
                      {expandedDays[day] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                
                <AnimatePresence>
                  {expandedDays[day] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardContent className="p-0">
                        <DaySchedule
                          day={day as 'friday' | 'saturday' | 'sunday' | 'monday'}
                          activities={
                            (currentPlan[day as keyof typeof currentPlan] as ScheduledActivity[] | undefined) || []
                          }
                          onReorder={(activities) => reorderActivities(
                            day as 'friday' | 'saturday' | 'sunday' | 'monday', 
                            activities
                          )}
                          showHeader={false}
                        />
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state for no activities */}
      {totalActivities === 0 && (
        <Card className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent>
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">
              Your {isLongWeekend ? 'long weekend' : 'weekend'} is waiting to be planned
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Start adding activities from the Activities tab to create your perfect {isLongWeekend ? 'long weekend' : 'weekend'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}