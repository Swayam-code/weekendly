import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeekendSchedule } from '@/components/schedule/weekend-schedule'
import { useAppStore } from '@/stores/app-store'

vi.mock('@/stores/app-store', () => ({
  useAppStore: vi.fn()
}))

const mockCurrentPlan = {
  id: 'test-plan',
  name: 'Test Weekend Plan',
  saturday: [
    {
      id: 'sat-1',
      name: 'Morning Hike',
      description: 'Start the day with a nature walk',
      category: 'outdoor',
      duration: 120,
      timeOfDay: ['morning'],
      mood: 'adventurous',
      icon: 'Mountain',
      color: 'bg-green-500',
      tags: ['nature', 'exercise'],
      scheduledTime: new Date()
    }
  ],
  sunday: [
    {
      id: 'sun-1',
      name: 'Brunch',
      description: 'Relaxing brunch with friends',
      category: 'food',
      duration: 90,
      timeOfDay: ['morning', 'afternoon'],
      mood: 'social',
      icon: 'Coffee',
      color: 'bg-amber-500',
      tags: ['social', 'food'],
      scheduledTime: new Date()
    }
  ],
  friday: [],
  monday: [],
  theme: 'relaxed',
  createdAt: new Date(),
  updatedAt: new Date()
}

// Mock the app store
vi.mock('@/stores/app-store', () => ({
  useAppStore: vi.fn(() => ({
    currentPlan: mockCurrentPlan,
    reorderActivities: vi.fn(),
  }))
}))

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock DnD Kit
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
  closestCenter: vi.fn(),
}))

// Mock child components
vi.mock('@/components/schedule/day-schedule', () => ({
  DaySchedule: ({ day, title, activities }: any) => (
    <div data-testid={`day-schedule-${day}`}>
      <h3>{title}</h3>
      <div>{activities.length} activities</div>
    </div>
  )
}))

vi.mock('@/components/schedule/WeekendStats', () => ({
  WeekendStats: ({ saturdayActivities, sundayActivities }: any) => (
    <div data-testid="weekend-stats">
      Stats: {saturdayActivities.length + sundayActivities.length} total activities
    </div>
  )
}))

describe('WeekendSchedule', () => {
  it('renders weekend schedule with activities', () => {
    render(<WeekendSchedule />)
    
    // Check if DnD context is rendered
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument()
    
    // Check if stats are rendered
    expect(screen.getByTestId('weekend-stats')).toBeInTheDocument()
    expect(screen.getByText('Stats: 2 total activities')).toBeInTheDocument()
    
    // Check if day schedules are rendered
    expect(screen.getByTestId('day-schedule-saturday')).toBeInTheDocument()
    expect(screen.getByTestId('day-schedule-sunday')).toBeInTheDocument()
    expect(screen.getByText('Saturday')).toBeInTheDocument()
    expect(screen.getByText('Sunday')).toBeInTheDocument()
  })

  it('shows empty state when no plan is selected', () => {
    // Mock no current plan
    vi.mocked(useAppStore).mockReturnValue({
      currentPlan: null,
      reorderActivities: vi.fn(),
    })

    render(<WeekendSchedule />)
    
    expect(screen.getByText('No weekend plan selected')).toBeInTheDocument()
    expect(screen.getByText('Create a new plan to start organizing your weekend')).toBeInTheDocument()
  })
})