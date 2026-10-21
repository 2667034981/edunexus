'use client'

import { create } from 'zustand'

interface NavigationState {
  quickQuery: string
  setQuickQuery: (query: string) => void
  isCommandOpen: boolean
  toggleCommand: () => void
  setCommandOpen: (open: boolean) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  quickQuery: '',
  setQuickQuery: (query) => set({ quickQuery: query }),
  isCommandOpen: false,
  toggleCommand: () => set((state) => ({ isCommandOpen: !state.isCommandOpen })),
  setCommandOpen: (open) => set({ isCommandOpen: open }),
}))
