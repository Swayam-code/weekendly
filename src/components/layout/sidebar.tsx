'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Palette, Plus, Sparkles, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/app-store';
import { ThemeSelector } from '@/components/common/theme-selector';
import { ActivityFilters } from '@/components/activities/activity-filters';
import { HolidaySuggestions } from '@/components/holidays/HolidaySuggestions';
import { toast } from 'sonner';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'filters' | 'holidays'>('themes');
  const { weekendThemes, selectedTheme, createNewPlan } = useAppStore();

  const handleNewPlan = () => {
    createNewPlan();
    toast.success('New weekend plan created!', {
      description: 'Start adding activities to plan your perfect weekend'
    });
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gradient-to-b from-white/90 to-purple-50/90 backdrop-blur-md border-r border-purple-100/50 flex flex-col items-center py-6 space-y-6 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="p-3 hover:bg-purple-100/50 transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight className="h-5 w-5 text-purple-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewPlan}
          className="p-3 hover:bg-purple-100/50 transition-colors"
          title="New Weekend Plan"
        >
          <Plus className="h-5 w-5 text-purple-600" />
        </Button>
        <Button
          variant={activeTab === 'themes' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('themes')}
          className="p-3 hover:bg-purple-100/50 transition-colors"
          title="Choose Theme"
        >
          <Palette className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === 'filters' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('filters')}
          className="p-3 hover:bg-purple-100/50 transition-colors"
          title="Filter Activities"
        >
          <Filter className="h-5 w-5" />
        </Button>
        <Button
          variant={activeTab === 'holidays' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('holidays')}
          className="p-3 hover:bg-purple-100/50 transition-colors"
          title="Holiday Planning"
        >
          <Calendar className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gradient-to-b from-white/95 to-purple-50/95 backdrop-blur-md border-r border-purple-100/50 flex flex-col shadow-sm">
      <div className="p-6 border-b border-purple-100/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Planning Tools
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="p-2 hover:bg-purple-100/50 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4 text-purple-600" />
          </Button>
        </div>
        
        <Button
          onClick={handleNewPlan}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Weekend Plan
        </Button>
      </div>

      <div className="flex border-b border-purple-100/50 bg-white/30 backdrop-blur-sm">
        <Button
          variant={activeTab === 'themes' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('themes')}
          className={`flex-1 rounded-none border-0 text-xs ${
            activeTab === 'themes' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-purple-50/50'
          }`}
        >
          <Palette className="h-3 w-3 mr-1" />
          Themes
        </Button>
        <Button
          variant={activeTab === 'filters' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('filters')}
          className={`flex-1 rounded-none border-0 text-xs ${
            activeTab === 'filters' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-purple-50/50'
          }`}
        >
          <Filter className="h-3 w-3 mr-1" />
          Filters
        </Button>
        <Button
          variant={activeTab === 'holidays' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('holidays')}
          className={`flex-1 rounded-none border-0 text-xs ${
            activeTab === 'holidays' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-purple-50/50'
          }`}
        >
          <Calendar className="h-3 w-3 mr-1" />
          Holidays
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'themes' && (
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-600" />
              Choose a Theme
            </div>
            <ThemeSelector />
            
            {selectedTheme && (
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    Selected Theme
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className={`w-3 h-3 rounded-full ${selectedTheme.color} shadow-sm`} />
                    <span className="font-medium text-sm text-gray-800">{selectedTheme.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">{selectedTheme.description}</p>
                  <Badge variant="secondary" className="text-xs bg-white/60 text-purple-700">
                    {selectedTheme.suggestedActivities.length} activities included
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'filters' && (
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-600" />
              Filter Activities
            </div>
            <ActivityFilters />
          </div>
        )}

        {activeTab === 'holidays' && (
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              Holiday Planning
            </div>
            <HolidaySuggestions />
          </div>
        )}
      </div>
    </div>
  );
}
