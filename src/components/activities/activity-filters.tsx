'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/stores/app-store';
import { ActivityCategory, Mood, TimeOfDay } from '@/types';

const categoryLabels: Record<ActivityCategory, string> = {
  [ActivityCategory.FOOD]: 'Food',
  [ActivityCategory.OUTDOOR]: 'Outdoor',
  [ActivityCategory.INDOOR]: 'Indoor',
  [ActivityCategory.SOCIAL]: 'Social',
  [ActivityCategory.RELAX]: 'Relax',
  [ActivityCategory.FITNESS]: 'Fitness',
  [ActivityCategory.CULTURE]: 'Culture',
  [ActivityCategory.SHOPPING]: 'Shopping',
  [ActivityCategory.ENTERTAINMENT]: 'Entertainment',
};

const moodLabels: Record<Mood, string> = {
  [Mood.ENERGETIC]: 'Energetic',
  [Mood.RELAXED]: 'Relaxed',
  [Mood.SOCIAL]: 'Social',
  [Mood.FOCUSED]: 'Focused',
  [Mood.ADVENTUROUS]: 'Adventurous',
  [Mood.COZY]: 'Cozy',
};

const timeLabels: Record<TimeOfDay, string> = {
  [TimeOfDay.EARLY_MORNING]: 'Early Morning',
  [TimeOfDay.MORNING]: 'Morning',
  [TimeOfDay.AFTERNOON]: 'Afternoon',
  [TimeOfDay.EVENING]: 'Evening',
  [TimeOfDay.NIGHT]: 'Night',
};

export function ActivityFilters() {
  const { filters, setFilters, clearFilters } = useAppStore();

  const handleSearchChange = (value: string) => {
    setFilters({ searchTerm: value });
  };

  const toggleFilter = <T extends string>(
    filterType: 'categories' | 'moods' | 'timeOfDay',
    value: T
  ) => {
    const currentFilters = filters[filterType] as T[];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value];
    
    setFilters({ [filterType]: newFilters });
  };

  const hasActiveFilters = 
    filters.searchTerm ||
    filters.categories.length > 0 ||
    filters.moods.length > 0 ||
    filters.timeOfDay.length > 0;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search activities..."
          value={filters.searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
        {filters.searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearchChange('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-auto"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {Object.entries(categoryLabels).map(([category, label]) => (
              <Badge
                key={category}
                variant={filters.categories.includes(category as ActivityCategory) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleFilter('categories', category as ActivityCategory)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Moods */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Moods</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {Object.entries(moodLabels).map(([mood, label]) => (
              <Badge
                key={mood}
                variant={filters.moods.includes(mood as Mood) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleFilter('moods', mood as Mood)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time of Day */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Time of Day</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {Object.entries(timeLabels).map(([time, label]) => (
              <Badge
                key={time}
                variant={filters.timeOfDay.includes(time as TimeOfDay) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => toggleFilter('timeOfDay', time as TimeOfDay)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="w-full text-gray-600 hover:text-gray-800"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}
