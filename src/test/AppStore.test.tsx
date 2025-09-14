import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/stores/app-store'
import { Activity, ActivityCategory, TimeOfDay, Mood } from '@/types'

describe('AppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAppStore.getState().clearFilters()
    useAppStore.setState({
      currentPlan: null,
      savedPlans: [],
      filters: {
        categories: [],
        moods: [],
        timeOfDay: [],
        searchTerm: ''
      }
    })
  })
  const mockActivity: Activity = {
    id: 'test-activity',
    name: 'Test Activity',
    description: 'A test activity',
    category: ActivityCategory.OUTDOOR,
    duration: 120,
    timeOfDay: [TimeOfDay.MORNING],
    mood: Mood.ENERGETIC,
    icon: 'Mountain',
    color: 'bg-green-500',
    tags: ['test', 'outdoor']
  }

  beforeEach(() => {
    // Reset the store before each test
    const store = useAppStore.getState()
    store.currentPlan = null
    store.savedPlans = []
    store.initializeApp() // This sets up the default state
  })

  it('initializes with default state', () => {
    const store = useAppStore.getState()
    
    expect(store.savedPlans).toBeDefined()
    expect(store.filters).toBeDefined()
    expect(store.activities).toBeDefined()
    expect(store.activities.length).toBeGreaterThan(0)
  })

  it('creates a new plan', () => {
    let store = useAppStore.getState()
    
    // Test with default name
    store.createNewPlan()
    store = useAppStore.getState() // Get fresh state
    expect(store.currentPlan).toBeTruthy()
    console.log('Default plan name:', store.currentPlan?.name)
    expect(store.currentPlan?.name).toBe('My Weekend Plan')
    
    // Test with custom name
    store.createNewPlan('My Test Plan')
    store = useAppStore.getState() // Get fresh state
    console.log('Custom plan name:', store.currentPlan?.name)
    expect(store.currentPlan?.name).toBe('My Test Plan')
    
    expect(store.currentPlan?.saturday).toBeDefined()
    expect(store.currentPlan?.sunday).toBeDefined()
    expect(Array.isArray(store.currentPlan?.saturday)).toBe(true)
    expect(Array.isArray(store.currentPlan?.sunday)).toBe(true)
  })

  it('adds activity to plan', () => {
    let store = useAppStore.getState()
    
    // Create a plan first
    store.createNewPlan()
    store = useAppStore.getState() // Get fresh state
    const initialSaturdayCount = store.currentPlan?.saturday.length || 0
    
    // Add activity to Saturday
    store.addActivityToPlan(mockActivity, 'saturday')
    store = useAppStore.getState() // Get fresh state
    
    expect(store.currentPlan?.saturday.length).toBe(initialSaturdayCount + 1)
    const addedActivity = store.currentPlan?.saturday.find(a => a.name === 'Test Activity')
    expect(addedActivity).toBeTruthy()
    expect(addedActivity?.originalActivityId).toBe('test-activity')
    expect(addedActivity?.day).toBe('saturday')
  })

  it('sets filters correctly', () => {
    let store = useAppStore.getState()
    
    // Check initial state
    console.log('Initial filters:', store.filters)
    
    const newFilters = {
      categories: [ActivityCategory.OUTDOOR],
      searchTerm: 'hiking'
    }
    console.log('Setting filters to:', newFilters)
    
    store.setFilters(newFilters)
    store = useAppStore.getState() // Get fresh state
    
    console.log('After setFilters:', store.filters)
    
    expect(store.filters.categories).toContain(ActivityCategory.OUTDOOR)
    expect(store.filters.searchTerm).toBe('hiking')
  })

  it('clears all filters', () => {
    const store = useAppStore.getState()
    
    // Set some filters
    store.setFilters({
      categories: [ActivityCategory.OUTDOOR],
      searchTerm: 'hiking'
    })
    
    // Clear filters
    store.clearFilters()
    
    expect(store.filters.categories).toEqual([])
    expect(store.filters.searchTerm).toBe('')
  })

  it('gets filtered activities', () => {
    const store = useAppStore.getState()
    
    const filtered = store.getFilteredActivities()
    
    // Should return an array of activities
    expect(Array.isArray(filtered)).toBe(true)
  })

  it('saves plan to localStorage', () => {
    const store = useAppStore.getState()
    
    store.createNewPlan()
    store.addActivityToPlan(mockActivity, 'saturday')
    
    // Save plan should not throw
    expect(() => store.savePlan()).not.toThrow()
  })
})