'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/stores/app-store';
import { toast } from 'sonner';
import * as Icons from 'lucide-react';

export function ThemeSelector() {
  const { weekendThemes, selectedTheme, setSelectedTheme } = useAppStore();

  const handleThemeSelect = (theme: typeof weekendThemes[0]) => {
    const isSelected = selectedTheme?.id === theme.id;
    if (isSelected) {
      setSelectedTheme(null);
      toast.info('Theme cleared', {
        description: 'No theme is currently selected'
      });
    } else {
      setSelectedTheme(theme);
      toast.success(`🎨 ${theme.name} theme selected!`, {
        description: `${theme.suggestedActivities.length} activities will be auto-suggested`
      });
    }
  };

  return (
    <div className="grid gap-3">
      {weekendThemes.map((theme) => {
        const IconComponent = Icons[theme.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
        const isSelected = selectedTheme?.id === theme.id;

        return (
          <Card
            key={theme.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
              isSelected 
                ? 'ring-2 ring-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 shadow-lg' 
                : 'hover:border-purple-200 hover:bg-white/80'
            }`}
            onClick={() => handleThemeSelect(theme)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2.5 rounded-xl ${theme.color} shadow-sm`}>
                  {IconComponent && (
                    <IconComponent className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 truncate mb-1">
                    {theme.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {theme.description}
                  </p>
                  {isSelected && (
                    <div className="mt-2 text-xs text-purple-600 font-medium">
                      ✓ Currently selected
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {selectedTheme && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedTheme(null)}
          className="w-full mt-2 text-gray-600 hover:text-gray-800"
        >
          Clear Theme
        </Button>
      )}
    </div>
  );
}
