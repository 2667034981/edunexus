'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeMode = 'nebula' | 'aurora'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'nebula',
      setMode: (mode) => {
        set({ mode })
        // 立即应用主题到 DOM
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', mode)
        }
      },
      toggleMode: () => {
        const newMode = get().mode === 'nebula' ? 'aurora' : 'nebula'
        get().setMode(newMode)
      },
    }),
    {
      name: 'edunexus-theme',
      onRehydrateStorage: () => (state) => {
        // 恢复主题时应用到 DOM
        if (state && typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', state.mode)
        }
      },
    }
  )
)
