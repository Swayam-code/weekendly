import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HolidaySuggestions } from '@/components/holidays/HolidaySuggestions'

// Mock the app store
vi.mock('@/stores/app-store', () => ({
  useAppStore: vi.fn(() => ({
    createNewPlan: vi.fn(),
  }))
}))

// Mock the toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  }
}))

// Mock the holidays data with all required functions
vi.mock('@/data/holidays', () => ({
  getUpcomingHolidays: vi.fn(() => [
    {
      id: 'fall-equinox-2025',
      name: 'Fall Equinox',
      date: new Date('2025-09-22'),
      type: 'observance',
      description: 'Astronomical fall season begins',
      region: 'global',
      icon: 'leaf',
      color: 'bg-orange-500'
    },
    {
      id: 'thanksgiving-2025',
      name: 'Thanksgiving',
      date: new Date('2025-11-27'),
      type: 'federal',
      description: 'Gratitude and family time',
      isLongWeekend: true,
      extendedDays: 2,
      region: 'us',
      icon: 'turkey',
      color: 'bg-amber-600'
    }
  ]),
  getNextLongWeekend: vi.fn(() => ({
    id: 'thanksgiving-weekend-2025',
    name: 'Thanksgiving Weekend',
    startDate: new Date('2025-11-27'),
    endDate: new Date('2025-11-28'),
    totalDays: 2,
    holiday: {
      id: 'thanksgiving-2025',
      name: 'Thanksgiving',
      date: new Date('2025-11-27'),
      type: 'federal',
      description: 'Gratitude and family time',
      isLongWeekend: true,
      extendedDays: 2,
      region: 'us',
      icon: 'turkey',
      color: 'bg-amber-600'
    },
    isUpcoming: true
  })),
  detectLongWeekend: vi.fn(() => false),
}))

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}))

describe('HolidaySuggestions', () => {
  it('renders the component without crashing', () => {
    render(<HolidaySuggestions />)
    
    // Just check that the component renders
    expect(document.body).toBeInTheDocument()
  })

  it('displays upcoming holidays section', () => {
    render(<HolidaySuggestions />)
    
    expect(screen.getByText('Upcoming Holidays')).toBeInTheDocument()
  })

  it('displays holiday planning section', () => {
    render(<HolidaySuggestions />)
    
    expect(screen.getByText('Next Long Weekend')).toBeInTheDocument()
  })
})