import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getUpcomingHolidays, getNextLongWeekend, type Holiday, type LongWeekend } from '@/data/holidays';
import { useAppStore } from '@/stores/app-store';
import { Calendar, Clock, Sparkles, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import * as Icons from 'lucide-react';

interface HolidaySuggestionsProps {
  onHolidaySelect?: (holiday: Holiday) => void;
}

export function HolidaySuggestions({ onHolidaySelect }: HolidaySuggestionsProps) {
  const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([]);
  const [nextLongWeekend, setNextLongWeekend] = useState<LongWeekend | null>(null);
  const [showAllHolidays, setShowAllHolidays] = useState(false);
  const [expandedLongWeekend, setExpandedLongWeekend] = useState(true);
  
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

  const getHolidayIcon = (iconName: string, className: string = "h-5 w-5") => {
    const IconComponent = (Icons as any)[iconName] || Icons.Calendar;
    return <IconComponent className={className} />;
  };

  const displayedHolidays = showAllHolidays ? upcomingHolidays : upcomingHolidays.slice(0, 3);

  if (upcomingHolidays.length === 0 && !nextLongWeekend) {
    return (
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200/50 shadow-sm">
        <CardContent className="p-4 text-center">
          <Calendar className="h-8 w-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No upcoming holidays found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Next Long Weekend Highlight */}
      {nextLongWeekend && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50 shadow-sm">
          <CardHeader 
            className="pb-2 cursor-pointer"
            onClick={() => setExpandedLongWeekend(!expandedLongWeekend)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <CardTitle className="text-sm text-purple-900 truncate">
                  Next Long Weekend
                </CardTitle>
              </div>
              {expandedLongWeekend ? (
                <ChevronUp className="h-4 w-4 text-purple-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-purple-600 flex-shrink-0" />
              )}
            </div>
          </CardHeader>
          
          <AnimatePresence>
            {expandedLongWeekend && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <CardContent className="pt-0 pb-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-800 truncate">
                        {nextLongWeekend.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs px-2 py-0 bg-white/60 text-purple-700 border-purple-200">
                          {nextLongWeekend.totalDays} days
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {getDaysUntil(nextLongWeekend.startDate)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {formatDate(nextLongWeekend.startDate)} - {formatDate(nextLongWeekend.endDate)}
                    </div>
                    
                    <Button 
                      onClick={() => handlePlanForHoliday(nextLongWeekend.holiday)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm text-xs h-8"
                    >
                      Plan {nextLongWeekend.totalDays}-Day Weekend
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* Upcoming Holidays */}
      {upcomingHolidays.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span>Upcoming Holidays</span>
            </h4>
            {upcomingHolidays.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllHolidays(!showAllHolidays)}
                className="text-xs hover:bg-purple-50/50 text-purple-600 h-6 px-2"
              >
                {showAllHolidays ? 'Less' : 'All'}
              </Button>
            )}
          </div>
          
          <div className="space-y-2 max-w-full overflow-hidden">
            <AnimatePresence>
              {displayedHolidays.map((holiday, index) => (
                <motion.div
                  key={holiday.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Card className="hover:shadow-md transition-all duration-200 cursor-pointer border-gray-200/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`p-1.5 rounded-md ${holiday.color} flex-shrink-0`}>
                            <div className="text-white">
                              {getHolidayIcon(holiday.icon, "h-3 w-3")}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-medium text-xs text-gray-900 truncate">
                              {holiday.name}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500 truncate">
                                {formatDate(holiday.date)}
                              </span>
                              {holiday.isLongWeekend && (
                                <Badge variant="outline" className="text-xs px-1 py-0 bg-purple-50 text-purple-600 border-purple-200">
                                  Long
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePlanForHoliday(holiday)}
                          className="text-xs hover:bg-purple-50 text-purple-600 h-6 px-2 flex-shrink-0"
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
      )}
    </div>
  );
}