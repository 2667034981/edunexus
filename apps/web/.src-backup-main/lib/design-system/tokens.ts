/**
 * EduNexus 设计系统 - 设计令牌
 *
 * 这个文件定义了整个应用的设计令牌，包括颜色、间距、字体、圆角、阴影等。
 * 所有组件都应该使用这些令牌来保持一致性。
 */

// ============================================================================
// 颜色系统
// ============================================================================

/**
 * 语义颜色
 * 使用 HSL 格式以便在 Tailwind 中使用 CSS 变量
 */
export const semanticColors = {
  // 主色 - 温暖的橙粉色（晨曦主题）
  primary: {
    light: '15 86% 65%',
    dark: '15 86% 65%',
  },
  // 辅助色 - 柔和的金色
  accent: {
    light: '35 100% 70%',
    dark: '35 100% 70%',
  },
  // 成功色
  success: {
    light: '142 76% 36%',
    dark: '142 71% 45%',
  },
  // 警告色
  warning: {
    light: '38 92% 50%',
    dark: '48 96% 53%',
  },
  // 错误色
  destructive: {
    light: '0 84% 60%',
    dark: '0 84% 60%',
  },
  // 信息色
  info: {
    light: '199 89% 48%',
    dark: '199 89% 58%',
  },
} as const

/**
 * 中性色
 */
export const neutralColors = {
  background: {
    light: '210 40% 98%',
    dark: '222 47% 4%',
  },
  foreground: {
    light: '222 47% 11%',
    dark: '210 40% 98%',
  },
  muted: {
    light: '210 40% 96%',
    dark: '215 28% 17%',
  },
  mutedForeground: {
    light: '215 16% 47%',
    dark: '217 19% 60%',
  },
  border: {
    light: '214 32% 91%',
    dark: '215 28% 17%',
  },
} as const

// ============================================================================
// 间距系统 (基于 4px)
// ============================================================================

export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
} as const

// ============================================================================
// 字体系统
// ============================================================================

export const typography = {
  fontFamily: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const

// ============================================================================
// 圆角系统
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: 'calc(var(--radius) - 4px)',  // ~8px
  md: 'calc(var(--radius) - 2px)',  // ~10px
  lg: 'var(--radius)',               // 12px (默认)
  xl: 'calc(var(--radius) + 4px)',  // ~16px
  '2xl': 'calc(var(--radius) + 8px)', // ~20px
  full: '9999px',
} as const

// ============================================================================
// 阴影系统
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
} as const

// ============================================================================
// 动画系统
// ============================================================================

export const animations = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// ============================================================================
// Z-Index 系统
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const

// ============================================================================
// 断点系统
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================================================
// 组件尺寸系统
// ============================================================================

export const componentSizes = {
  button: {
    sm: {
      height: '2rem',      // 32px
      padding: '0 0.75rem', // 12px
      fontSize: '0.875rem', // 14px
    },
    md: {
      height: '2.25rem',   // 36px
      padding: '0 1rem',    // 16px
      fontSize: '0.875rem', // 14px
    },
    lg: {
      height: '2.5rem',    // 40px
      padding: '0 2rem',    // 32px
      fontSize: '1rem',     // 16px
    },
  },
  input: {
    sm: {
      height: '2rem',      // 32px
      padding: '0 0.75rem', // 12px
      fontSize: '0.875rem', // 14px
    },
    md: {
      height: '2.25rem',   // 36px
      padding: '0 0.75rem', // 12px
      fontSize: '0.875rem', // 14px
    },
    lg: {
      height: '2.5rem',    // 40px
      padding: '0 1rem',    // 16px
      fontSize: '1rem',     // 16px
    },
  },
  icon: {
    sm: '1rem',    // 16px
    md: '1.25rem', // 20px
    lg: '1.5rem',  // 24px
    xl: '2rem',    // 32px
  },
} as const

// ============================================================================
// 可访问性
// ============================================================================

export const accessibility = {
  // WCAG 2.1 AA 标准的最小触摸目标尺寸
  minTouchTarget: '44px',
  // 焦点环
  focusRing: {
    width: '2px',
    offset: '2px',
    color: 'hsl(var(--ring))',
  },
} as const
