import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUpcomingHolidays, getNextLongWeekend, type Holiday, type LongWeekend } from '@/data/holidays';
import { useAppStore } from '@/stores/app-store';
import { Calendar, Clock, Sparkles, MapPin } from 'lucide-react';
import * as Icons from 'lucide-react';

interface HolidaySuggestionsProps {
  onHolidaySelect?: (holiday: Holiday) => void;
}

export function HolidaySuggestions({ onHolidaySelect }: HolidaySuggestionsProps) {
  const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([]);
  const [nextLongWeekend, setNextLongWeekend] = useState<LongWeekend | null>(null);
  const [showAll, setShowAll] = useState(false);
  
  const { createNewPlan, setSelectedTheme } = useAppStore();

  useEffect(() => {
    const holidays = getUpcomingHolidays(90); // Next 3 months
    const longWeekend = getNextLongWeekend();
    
    setUpcomingHolidays(holidays);
    setNextLongWeekend(longWeekend);
  }, []);

  const handlePlanForHoliday = (holiday: Holiday) => {
    // Create a new plan for the holiday
    const planName = `${holiday.name} Weekend`;
    createNewPlan(planName);
    
    // Mark plan as long weekend if applicable
    const { currentPlan } = useAppStore.getState();
    if (currentPlan && holiday.isLongWeekend) {
      useAppStore.setState({
        currentPlan: {
          ...currentPlan,
          isLongWeekend: true
        }
      });
    }
    
    // Set theme based on holiday type
    const themes = useAppStore.getState().weekendThemes;
    let suggestedTheme;
    
    if (holiday.type === 'federal' || holiday.name.includes('Day')) {
      suggestedTheme = themes.find(t => t.name === 'Social Weekend');
    } else if (holiday.type === 'season') {
      suggestedTheme = themes.find(t => t.name === 'Active Weekend');
    } else {
      suggestedTheme = themes.find(t => t.name === 'Relaxed Weekend');
    }
    
    if (suggestedTheme) {
      setSelectedTheme(suggestedTheme);
    }
    
    onHolidaySelect?.(holiday);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return `In ${Math.ceil(diffDays / 30)} months`;
  };

  const getHolidayIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Calendar;
    return <IconComponent className="h-5 w-5" />;
  };

  const displayedHolidays = showAll ? upcomingHolidays : upcomingHolidays.slice(0, 3);

  if (upcomingHolidays.length === 0 && !nextLongWeekend) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Next Long Weekend Highlight */}
      {nextLongWeekend && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Long Weekend
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {nextLongWeekend.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {formatDate(nextLongWeekend.startDate)} - {formatDate(nextLongWeekend.endDate)} • {nextLongWeekend.totalDays} days
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {nextLongWeekend.holiday.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-purple-600">
                    <Clock className="h-4 w-4" />
                    <span>{getDaysUntil(nextLongWeekend.startDate)}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 ml-4">
                  <Button 
                    onClick={() => handlePlanForHoliday(nextLongWeekend.holiday)}
                    className="bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    Plan {nextLongWeekend.totalDays}-Day Weekend
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upcoming Holidays */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Upcoming Holidays</span>
          </h4>
          {upcomingHolidays.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-xs"
            >
              {showAll ? 'Show Less' : `Show All ${upcomingHolidays.length}`}
            </Button>
          )}
        </div>
        
        <div className="grid gap-2">
          <AnimatePresence>
            {displayedHolidays.map((holiday, index) => (
              <motion.div
                key={holiday.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${holiday.color}`}>
                          <div className="text-white">
                            {getHolidayIcon(holiday.icon)}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 text-sm">
                            {holiday.name}
                          </h5>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{formatDate(holiday.date)}</span>
                            <span>{getDaysUntil(holiday.date)}</span>
                            {holiday.isLongWeekend && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                Long Weekend
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlanForHoliday(holiday)}
                        className="text-xs hover:bg-gray-50"
                      >
                        Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}