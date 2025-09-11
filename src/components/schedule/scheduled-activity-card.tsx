'use client';

import { motion } from 'framer-motion';
import { Clock, X, GripVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScheduledActivity, ActivityCategory, Mood } from '@/types';
import { useAppStore } from '@/stores/app-store';
import * as Icons from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ScheduledActivityCardProps {
  activity: ScheduledActivity;
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

export function ScheduledActivityCard({ activity }: ScheduledActivityCardProps) {
  const { removeActivityFromPlan } = useAppStore();
  const IconComponent = Icons[activity.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemove = () => {
    removeActivityFromPlan(activity.id);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={isDragging ? 'z-50' : ''}
    >
      <Card className={`group relative overflow-hidden transition-all duration-200 border-l-4 ${activity.color.replace('bg-', 'border-')} ${isDragging ? 'shadow-xl bg-white rotate-3 scale-105' : 'hover:shadow-md bg-white/90'}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* Drag Handle */}
            <div 
              {...attributes}
              {...listeners}
              className="flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>

            {/* Icon */}
            <div className={`p-2 rounded-lg ${activity.color} flex-shrink-0`}>
              {IconComponent && (
                <IconComponent className="h-4 w-4 text-white" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                  {activity.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {activity.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${categoryColors[activity.category]}`}
                  >
                    {activity.category}
                  </Badge>
                  <span className="text-sm font-medium text-gray-600">{moodEmojis[activity.mood]}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatDuration(activity.duration)}</span>
                </div>
              </div>

              {/* Scheduled Time */}
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Scheduled: {formatTime(activity.scheduledTime)}
                </div>
                
                {activity.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {activity.tags.slice(0, 2).map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs px-1 py-0 h-4"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {activity.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                        +{activity.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
