import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function ActivitySkeleton() {
  return (
    <Card className="border-0 bg-white/60 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
          
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12 ml-2" />
            </div>
            
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
              </div>
              
              <div className="flex space-x-1">
                <div className="h-7 bg-gray-200 rounded animate-pulse w-12" />
                <div className="h-7 bg-gray-200 rounded animate-pulse w-12" />
              </div>
            </div>
            
            <div className="flex space-x-1 pt-1">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-12" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ActivityGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <ActivitySkeleton key={index} />
      ))}
    </div>
  );
}
