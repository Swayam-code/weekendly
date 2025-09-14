import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock localStorage
const localStorageMock = {
  getItem: (key: string) => {
    return localStorageMock.store[key] || null
  },
  setItem: (key: string, value: string) => {
    localStorageMock.store[key] = value
  },
  removeItem: (key: string) => {
    delete localStorageMock.store[key]
  },
  clear: () => {
    localStorageMock.store = {}
  },
  store: {} as Record<string, string>
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null
  rootMargin = ''
  thresholds = []
  
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
  takeRecords() {
    return []
  }
} as any