import React from 'react';
import { Clock, MapPin, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScheduledActivity, ActivityCategory } from '@/types';

interface WeekendStatsProps {
  saturdayActivities: ScheduledActivity[];
  sundayActivities: ScheduledActivity[];
}

export function WeekendStats({ saturdayActivities, sundayActivities }: WeekendStatsProps) {
  const allActivities = [...saturdayActivities, ...sundayActivities];
  
  const totalDuration = allActivities.reduce((sum, activity) => sum + activity.duration, 0);
  const totalActivities = allActivities.length;
  const uniqueCategories = new Set(allActivities.map(a => a.category)).size;
  
  const categoryBreakdown = allActivities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + 1;
    return acc;
  }, {} as Record<ActivityCategory, number>);

  const topCategory = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)[0];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getCategoryColor = (category: ActivityCategory) => {
    const colors: Record<ActivityCategory, string> = {
      [ActivityCategory.FOOD]: 'bg-orange-100 text-orange-800',
      [ActivityCategory.ENTERTAINMENT]: 'bg-purple-100 text-purple-800',
      [ActivityCategory.OUTDOOR]: 'bg-green-100 text-green-800',
      [ActivityCategory.SOCIAL]: 'bg-blue-100 text-blue-800',
      [ActivityCategory.FITNESS]: 'bg-red-100 text-red-800',
      [ActivityCategory.CULTURE]: 'bg-pink-100 text-pink-800',
      [ActivityCategory.SHOPPING]: 'bg-yellow-100 text-yellow-800',
      [ActivityCategory.INDOOR]: 'bg-indigo-100 text-indigo-800',
      [ActivityCategory.RELAX]: 'bg-teal-100 text-teal-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (totalActivities === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Weekend Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{totalActivities}</div>
            <div className="text-sm text-gray-600">Activities</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{formatDuration(totalDuration)}</div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{uniqueCategories}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-sm font-medium text-orange-600 mb-1">Most Popular</div>
            {topCategory && (
              <Badge className={getCategoryColor(topCategory[0] as ActivityCategory)}>
                {topCategory[0]} ({topCategory[1]})
              </Badge>
            )}
          </div>
        </div>
        
        {Object.entries(categoryBreakdown).length > 1 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Category Breakdown</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryBreakdown).map(([category, count]) => (
                <Badge 
                  key={category} 
                  variant="secondary" 
                  className={getCategoryColor(category as ActivityCategory)}
                >
                  {category}: {count}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
