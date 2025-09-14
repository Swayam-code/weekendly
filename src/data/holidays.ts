export interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: 'federal' | 'observance' | 'season';
  description: string;
  isLongWeekend?: boolean;
  extendedDays?: number; // Additional days for long weekend
  region?: 'us' | 'uk' | 'ca' | 'global';
  icon: string;
  color: string;
  activities?: string[]; // Suggested activity IDs
}

export interface LongWeekend {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  holiday: Holiday;
  isUpcoming: boolean;
}

// 2024-2025 Holiday Calendar (US focused, can be extended)
export const holidays: Holiday[] = [
  {
    id: 'new-years-day-2025',
    name: "New Year's Day",
    date: new Date('2025-01-01'),
    type: 'federal',
    description: 'Start the year fresh with new goals and celebrations',
    isLongWeekend: true,
    extendedDays: 1, // If falls on Sat/Sun, Monday is usually off
    region: 'us',
    icon: 'party-popper',
    color: 'bg-purple-500',
    activities: ['brunch-cafe', 'spa-day', 'museum-visit']
  },
  {
    id: 'martin-luther-king-day-2025',
    name: 'Martin Luther King Jr. Day',
    date: new Date('2025-01-20'),
    type: 'federal',
    description: 'A day of service and remembrance',
    isLongWeekend: true,
    extendedDays: 1,
    region: 'us',
    icon: 'heart',
    color: 'bg-blue-500',
    activities: ['volunteer-work', 'museum-visit', 'documentary-night']
  },
  {
    id: 'presidents-day-2025',
    name: "Presidents' Day",
    date: new Date('2025-02-17'),
    type: 'federal',
    description: 'Honor American presidents with a long weekend',
    isLongWeekend: true,
    extendedDays: 1,
    region: 'us',
    icon: 'flag',
    color: 'bg-red-500',
    activities: ['museum-visit', 'historical-tour', 'documentary-night']
  },
  {
    id: 'memorial-day-2025',
    name: 'Memorial Day',
    date: new Date('2025-05-26'),
    type: 'federal',
    description: 'Remember those who served with the unofficial start of summer',
    isLongWeekend: true,
    extendedDays: 1,
    region: 'us',
    icon: 'flag',
    color: 'bg-red-600',
    activities: ['bbq-picnic', 'beach-day', 'hiking-trail', 'farmers-market']
  },
  {
    id: 'independence-day-2025',
    name: 'Independence Day',
    date: new Date('2025-07-04'),
    type: 'federal',
    description: 'Celebrate America with fireworks, BBQs, and patriotic activities',
    isLongWeekend: false, // Depends on which day it falls
    region: 'us',
    icon: 'sparkles',
    color: 'bg-red-700',
    activities: ['bbq-picnic', 'fireworks-show', 'beach-day', 'outdoor-games']
  },
  {
    id: 'labor-day-2025',
    name: 'Labor Day',
    date: new Date('2025-09-01'),
    type: 'federal',
    description: 'End of summer with a relaxing long weekend',
    isLongWeekend: true,
    extendedDays: 1,
    region: 'us',
    icon: 'sun',
    color: 'bg-orange-500',
    activities: ['beach-day', 'bbq-picnic', 'road-trip', 'farmers-market']
  },
  {
    id: 'thanksgiving-2025',
    name: 'Thanksgiving',
    date: new Date('2025-11-27'),
    type: 'federal',
    description: 'Gratitude and family time with extended weekend',
    isLongWeekend: true,
    extendedDays: 2, // Thursday + Friday
    region: 'us',
    icon: 'turkey',
    color: 'bg-amber-600',
    activities: ['family-dinner', 'board-games', 'nature-walk', 'cooking-class']
  },
  {
    id: 'christmas-2025',
    name: 'Christmas Day',
    date: new Date('2025-12-25'),
    type: 'federal',
    description: 'Holiday celebration with family and friends',
    isLongWeekend: true,
    extendedDays: 1,
    region: 'us',
    icon: 'gift',
    color: 'bg-green-600',
    activities: ['family-dinner', 'gift-exchange', 'holiday-movies', 'winter-walk']
  },
  // Seasonal/Cultural Holidays
  {
    id: 'valentines-day-2025',
    name: "Valentine's Day",
    date: new Date('2025-02-14'),
    type: 'observance',
    description: 'Romantic celebrations and love',
    region: 'global',
    icon: 'heart',
    color: 'bg-pink-500',
    activities: ['romantic-dinner', 'spa-couples', 'wine-tasting', 'art-gallery']
  },
  {
    id: 'spring-equinox-2025',
    name: 'Spring Equinox',
    date: new Date('2025-03-20'),
    type: 'season',
    description: 'First day of spring - perfect for outdoor activities',
    region: 'global',
    icon: 'flower',
    color: 'bg-green-400',
    activities: ['hiking-trail', 'gardening', 'farmers-market', 'nature-photography']
  },
  {
    id: 'summer-solstice-2025',
    name: 'Summer Solstice',
    date: new Date('2025-06-21'),
    type: 'season',
    description: 'Longest day of the year - maximize outdoor time',
    region: 'global',
    icon: 'sun',
    color: 'bg-yellow-500',
    activities: ['beach-day', 'sunrise-yoga', 'outdoor-concert', 'camping']
  },
  {
    id: 'fall-equinox-2025',
    name: 'Fall Equinox',
    date: new Date('2025-09-22'),
    type: 'season',
    description: 'Beginning of autumn - cozy seasonal activities',
    region: 'global',
    icon: 'leaf',
    color: 'bg-orange-600',
    activities: ['apple-picking', 'pumpkin-patch', 'hiking-trail', 'cozy-cafe']
  },
  {
    id: 'winter-solstice-2025',
    name: 'Winter Solstice',
    date: new Date('2025-12-21'),
    type: 'season',
    description: 'Shortest day - embrace hygge and indoor coziness',
    region: 'global',
    icon: 'snowflake',
    color: 'bg-blue-600',
    activities: ['hot-cocoa-cafe', 'board-games', 'holiday-movies', 'spa-day']
  }
];

export function getUpcomingHolidays(days: number = 60): Holiday[] {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return holidays.filter(holiday => {
    return holiday.date >= now && holiday.date <= futureDate;
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getUpcomingLongWeekends(): LongWeekend[] {
  const now = new Date();
  
  return holidays
    .filter(holiday => holiday.isLongWeekend && holiday.date >= now)
    .map(holiday => {
      const startDate = new Date(holiday.date);
      // If holiday is Monday, long weekend starts Saturday
      // If holiday is Friday, long weekend includes Monday
      if (holiday.date.getDay() === 1) { // Monday
        startDate.setDate(startDate.getDate() - 2); // Start Saturday
      }
      
      const endDate = new Date(holiday.date);
      if (holiday.extendedDays) {
        endDate.setDate(endDate.getDate() + (holiday.extendedDays - 1));
      }
      
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      return {
        id: `long-weekend-${holiday.id}`,
        name: `${holiday.name} Weekend`,
        startDate,
        endDate,
        totalDays,
        holiday,
        isUpcoming: holiday.date >= now
      };
    })
    .filter(weekend => weekend.isUpcoming)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export function getHolidayForDate(date: Date): Holiday | null {
  return holidays.find(holiday => 
    holiday.date.toDateString() === date.toDateString()
  ) || null;
}

export function isLongWeekend(date: Date): boolean {
  const longWeekends = getUpcomingLongWeekends();
  return longWeekends.some(weekend => 
    date >= weekend.startDate && date <= weekend.endDate
  );
}

export function getNextLongWeekend(): LongWeekend | null {
  const longWeekends = getUpcomingLongWeekends();
  return longWeekends.length > 0 ? longWeekends[0] : null;
}