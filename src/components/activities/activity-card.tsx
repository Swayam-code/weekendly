'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, ActivityCategory, Mood } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import * as Icons from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  showAddButton?: boolean;
}

const categoryColors: Record<ActivityCategory, string> = {
  [ActivityCategory.FOOD]: 'bg-amber-100 text-amber-800',
  [ActivityCategory.OUTDOOR]: 'bg-green-100 text-green-800',
  [ActivityCategory.INDOOR]: 'bg-blue-100 text-blue-800',
  [ActivityCategory.SOCIAL]: 'bg-pink-100 text-pink-800',
  [ActivityCategory.RELAX]: 'bg-purple-100 text-purple-800',
  [ActivityCategory.FITNESS]: 'bg-red-100 text-red-800',
  [ActivityCategory.CULTURE]: 'bg-indigo-100 text-indigo-800',
  [ActivityCategory.SHOPPING]: 'bg-yellow-100 text-yellow-800',
  [ActivityCategory.ENTERTAINMENT]: 'bg-teal-100 text-teal-800',
};

const moodEmojis: Record<Mood, string> = {
  [Mood.ENERGETIC]: 'Energetic',
  [Mood.RELAXED]: 'Relaxed',
  [Mood.SOCIAL]: 'Social',
  [Mood.FOCUSED]: 'Focused',
  [Mood.ADVENTUROUS]: 'Adventurous',
  [Mood.COZY]: 'Cozy',
};

export function ActivityCard({ activity, showAddButton = true }: ActivityCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addActivityToPlan } = useAppStore();
  const IconComponent = Icons[activity.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  const handleAddToDay = async (day: 'saturday' | 'sunday') => {
    setIsAdding(true);
    
    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addActivityToPlan(activity, day);
    
    toast.success(`Added to ${day.charAt(0).toUpperCase() + day.slice(1)}!`, {
      description: activity.name
    });
    
    setIsAdding(false);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="transition-all duration-200 h-full w-full"
    >
      <Card 
        className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm focus-within:ring-2 focus-within:ring-purple-500 overflow-hidden h-full flex flex-col min-h-[240px]"
        tabIndex={0}
        role="article"
        aria-label={`Activity: ${activity.name}`}
      >
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-start space-x-3 flex-1">
            <div 
              className={`p-2.5 rounded-xl ${activity.color} shadow-sm flex-shrink-0`}
              aria-hidden="true"
            >
              {IconComponent && (
                <IconComponent className="h-5 w-5 text-white" />
              )}
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col h-full">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {activity.name}
                </h3>
                <div 
                  className="flex items-center space-x-1 text-xs text-gray-500 flex-shrink-0 ml-2"
                  aria-label={`Duration: ${formatDuration(activity.duration)}`}
                >
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  <span>{formatDuration(activity.duration)}</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-1">
                {activity.description}
              </p>
              
              {/* Category and Mood */}
              <div className="flex items-center space-x-2 mb-2">
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${categoryColors[activity.category]}`}
                  aria-label={`Category: ${activity.category}`}
                >
                  {activity.category}
                </Badge>
                <span 
                  className="text-sm font-medium text-gray-600"
                  aria-label={`Mood: ${moodEmojis[activity.mood]}`}
                >
                  {moodEmojis[activity.mood]}
                </span>
              </div>
              
              {/* Tags */}
              {activity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {activity.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs px-1 py-0 h-5"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {activity.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                      +{activity.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Add to Schedule Buttons - Always at bottom */}
          {showAddButton && (
            <div 
              className="flex justify-center space-x-2 mt-auto pt-3 border-t border-gray-100 transition-all duration-200"
              role="group"
              aria-label="Add to schedule"
            >
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddToDay('saturday')}
                disabled={isAdding}
                className="h-7 px-3 text-xs hover:bg-purple-50 hover:border-purple-200 disabled:opacity-50 flex-1 max-w-20"
                aria-label={`Add ${activity.name} to Saturday`}
              >
                {isAdding ? (
                  <div 
                    className="h-3 w-3 animate-spin rounded-full border-2 border-purple-300 border-t-purple-600 mr-1"
                    aria-hidden="true"
                  />
                ) : (
                  <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
                )}
                Sat
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddToDay('sunday')}
                disabled={isAdding}
                className="h-7 px-3 text-xs hover:bg-purple-50 hover:border-purple-200 disabled:opacity-50 flex-1 max-w-20"
                aria-label={`Add ${activity.name} to Sunday`}
              >
                {isAdding ? (
                  <div 
                    className="h-3 w-3 animate-spin rounded-full border-2 border-purple-300 border-t-purple-600 mr-1"
                    aria-hidden="true"
                  />
                ) : (
                  <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
                )}
                Sun
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
