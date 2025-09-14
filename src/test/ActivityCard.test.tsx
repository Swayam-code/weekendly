import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActivityCard } from '@/components/activities/activity-card'
import { activities } from '@/data/activities'

describe('ActivityCard', () => {
  const mockActivity = activities[0]

  it('renders activity information correctly', () => {
    render(<ActivityCard activity={mockActivity} />)

    expect(screen.getByText(mockActivity.name)).toBeInTheDocument()
    expect(screen.getByText(mockActivity.category)).toBeInTheDocument()
    expect(screen.getByText(`${mockActivity.duration} min`)).toBeInTheDocument()
  })

  it('shows add button by default', () => {
    render(<ActivityCard activity={mockActivity} />)
    
    const addButton = screen.getByRole('button')
    expect(addButton).toBeInTheDocument()
    expect(addButton).not.toBeDisabled()
  })

  it('hides add button when showAddButton is false', () => {
    render(<ActivityCard activity={mockActivity} showAddButton={false} />)
    
    const addButton = screen.queryByRole('button')
    expect(addButton).not.toBeInTheDocument()
  })

  it('displays activity tags', () => {
    render(<ActivityCard activity={mockActivity} />)

    // Check if tags are rendered
    mockActivity.tags.forEach((tag: string) => {
      const element = screen.getByText(tag)
      expect(element).toBeInTheDocument()
    })
  })

  it('displays activity description', () => {
    render(<ActivityCard activity={mockActivity} />)
    
    expect(screen.getByText(mockActivity.description)).toBeInTheDocument()
  })
})