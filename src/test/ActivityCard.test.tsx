import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ActivityCard } from '@/components/activities/activity-card'
import { Activity, ActivityCategory, TimeOfDay, Mood } from '@/types'

// Mock the toast function
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  }
}))

// Mock the app store
vi.mock('@/stores/app-store', () => ({
  useAppStore: vi.fn(() => ({
    addActivityToPlan: vi.fn(),
  }))
}))

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('ActivityCard', () => {
  const mockActivity: Activity = {
    id: 'test-activity',
    name: 'Test Activity',
    description: 'A test activity for unit testing',
    category: ActivityCategory.FOOD,
    duration: 120, // 2 hours
    timeOfDay: [TimeOfDay.MORNING],
    mood: Mood.SOCIAL,
    icon: 'Coffee',
    color: 'bg-amber-500',
    tags: ['test', 'food', 'social'],
  }

  it('renders activity information correctly', () => {
    render(<ActivityCard activity={mockActivity} />)

    // Check activity name
    expect(screen.getByText('Test Activity')).toBeInTheDocument()
    
    // Check activity description
    expect(screen.getByText('A test activity for unit testing')).toBeInTheDocument()
    
    // Check duration (should be formatted as "2h")
    expect(screen.getByText('2h')).toBeInTheDocument()
    
    // Check category badge using aria-label
    expect(screen.getByLabelText('Category: food')).toBeInTheDocument()
    
    // Check mood text
    expect(screen.getByLabelText('Mood: Social')).toBeInTheDocument()
  })

  it('renders both Saturday and Sunday buttons by default', () => {
    render(<ActivityCard activity={mockActivity} />)
    
    // Check for Saturday button
    const saturdayButton = screen.getByLabelText('Add Test Activity to Saturday')
    expect(saturdayButton).toBeInTheDocument()
    expect(saturdayButton).not.toBeDisabled()
    expect(saturdayButton).toHaveTextContent('Sat')
    
    // Check for Sunday button
    const sundayButton = screen.getByLabelText('Add Test Activity to Sunday')
    expect(sundayButton).toBeInTheDocument()
    expect(sundayButton).not.toBeDisabled()
    expect(sundayButton).toHaveTextContent('Sun')
  })

  it('hides buttons when showAddButton is false', () => {
    render(<ActivityCard activity={mockActivity} showAddButton={false} />)
    
    // No buttons should be present
    expect(screen.queryByLabelText('Add Test Activity to Saturday')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Add Test Activity to Sunday')).not.toBeInTheDocument()
  })

  it('displays activity tags correctly', () => {
    render(<ActivityCard activity={mockActivity} />)

    // Check for tags (should display first 3)
    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('social')).toBeInTheDocument()
    
    // Note: 'food' appears both as category and tag, so we need to be careful
    const foodElements = screen.getAllByText('food')
    expect(foodElements.length).toBeGreaterThanOrEqual(1)
  })

  it('handles button clicks correctly', async () => {
    const { useAppStore } = await import('@/stores/app-store')
    const mockAddActivityToPlan = vi.fn()
    
    vi.mocked(useAppStore).mockReturnValue({
      addActivityToPlan: mockAddActivityToPlan,
    } as any)

    render(<ActivityCard activity={mockActivity} />)
    
    const saturdayButton = screen.getByLabelText('Add Test Activity to Saturday')
    fireEvent.click(saturdayButton)
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockAddActivityToPlan).toHaveBeenCalledWith(mockActivity, 'saturday')
    })
  })

  it('shows loading state when adding activity', async () => {
    render(<ActivityCard activity={mockActivity} />)
    
    const saturdayButton = screen.getByLabelText('Add Test Activity to Saturday')
    fireEvent.click(saturdayButton)
    
    // Should show loading spinner temporarily
    await waitFor(() => {
      expect(saturdayButton).toBeDisabled()
    }, { timeout: 100 })
  })

  it('formats duration correctly for different time lengths', () => {
    // Test with minutes only
    const shortActivity = { ...mockActivity, duration: 45 }
    const { rerender } = render(<ActivityCard activity={shortActivity} />)
    expect(screen.getByText('45m')).toBeInTheDocument()
    
    // Test with hours and minutes
    const longActivity = { ...mockActivity, duration: 150 } // 2h 30m
    rerender(<ActivityCard activity={longActivity} />)
    expect(screen.getByText('2h 30m')).toBeInTheDocument()
    
    // Test with exact hours
    const exactHourActivity = { ...mockActivity, duration: 180 } // 3h
    rerender(<ActivityCard activity={exactHourActivity} />)
    expect(screen.getByText('3h')).toBeInTheDocument()
  })

  it('shows overflow indicator for many tags', () => {
    const activityWithManyTags = {
      ...mockActivity,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
    }
    
    render(<ActivityCard activity={activityWithManyTags} />)
    
    // Should show first 3 tags plus overflow indicator
    expect(screen.getByText('tag1')).toBeInTheDocument()
    expect(screen.getByText('tag2')).toBeInTheDocument()
    expect(screen.getByText('tag3')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })
})