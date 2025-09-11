import React from 'react';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { ScheduledActivity } from '@/types';
import { validateSchedule } from '@/lib/scheduling';

interface ScheduleValidatorProps {
  activities: ScheduledActivity[];
  day: 'saturday' | 'sunday';
}

export function ScheduleValidator({ activities, day }: ScheduleValidatorProps) {
  const validation = validateSchedule(activities);
  
  if (validation.conflicts.length === 0) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm mb-4">
        <CheckCircle className="w-4 h-4" />
        <span>Schedule looks good!</span>
      </div>
    );
  }

  return (
    <div className="mb-4 space-y-2">
      {validation.conflicts.map((conflict, index) => (
        <div key={index} className="flex items-start gap-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-lg">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Time Conflict</p>
            <p>
              {conflict.activity1} and {conflict.activity2} overlap
            </p>
            <p className="text-xs mt-1">{conflict.reason}</p>
          </div>
        </div>
      ))}
      
      {validation.suggestions.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Suggestions</span>
          </div>
          <ul className="text-blue-700 text-sm space-y-1">
            {validation.suggestions.map((item, index) => (
              <li key={index}>{item.suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
