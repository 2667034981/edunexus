/**
 * EduNexus 设计系统 - 组件变体
 *
 * 使用 class-variance-authority (CVA) 定义统一的组件变体
 * 确保所有组件的样式保持一致
 */

import { cva } from 'class-variance-authority'

// ============================================================================
// 按钮变体
// ============================================================================

export const buttonVariants = cva(
  // 基础样式 - 增强移动端触摸体验
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 touch-manipulation select-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-[0.97] active:bg-primary/80',
        destructive:
          'bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 active:scale-[0.97] active:bg-destructive/80',
        outline:
          'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent/50 active:scale-[0.97]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-[0.97]',
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
        link:
          'text-primary underline-offset-4 hover:underline',
        success:
          'bg-green-600 text-white shadow-md hover:bg-green-700 active:scale-[0.97]',
        warning:
          'bg-yellow-600 text-white shadow-md hover:bg-yellow-700 active:scale-[0.97]',
      },
      size: {
        sm: 'h-9 px-3 text-xs [&_svg]:size-3.5 md:h-8',
        md: 'h-10 px-4 text-sm [&_svg]:size-4 md:h-9',
        lg: 'h-12 px-6 text-base [&_svg]:size-5 md:h-11',
        icon: 'h-10 w-10 [&_svg]:size-4 md:h-9 md:w-9',
        'icon-sm': 'h-9 w-9 [&_svg]:size-3.5 md:h-8 md:w-8',
        'icon-lg': 'h-12 w-12 [&_svg]:size-5 md:h-11 md:w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// ============================================================================
// 输入框变体
// ============================================================================

export const inputVariants = cva(
  'flex w-full rounded-lg border border-input bg-background px-3 text-sm shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation',
  {
    variants: {
      size: {
        sm: 'h-9 text-xs md:h-8',
        md: 'h-10 text-base md:h-9 md:text-sm',
        lg: 'h-12 text-base md:h-11',
      },
      variant: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)

// ============================================================================
// 卡片变体
// ============================================================================

export const cardVariants = cva(
  'rounded-xl border bg-card text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        elevated: 'shadow-md',
        interactive: 'shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        glass: 'backdrop-blur-xl bg-card/60 border-border/50 shadow-lg',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
)

// ============================================================================
// 徽章变体
// ============================================================================

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline:
          'text-foreground border-border',
        success:
          'border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning:
          'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        info:
          'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// ============================================================================
// 警告框变体
// ============================================================================

export const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10',
        success:
          'border-green-500/50 text-green-800 dark:text-green-400 [&>svg]:text-green-600 bg-green-50 dark:bg-green-900/20',
        warning:
          'border-yellow-500/50 text-yellow-800 dark:text-yellow-400 [&>svg]:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
        info:
          'border-blue-500/50 text-blue-800 dark:text-blue-400 [&>svg]:text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// ============================================================================
// 标签变体
// ============================================================================

export const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: '',
        required: 'after:content-["*"] after:ml-0.5 after:text-destructive',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// ============================================================================
// 分隔线变体
// ============================================================================

export const separatorVariants = cva(
  'shrink-0 bg-border',
  {
    variants: {
      orientation: {
        horizontal: 'h-[1px] w-full',
        vertical: 'h-full w-[1px]',
      },
      variant: {
        default: '',
        gradient: 'bg-gradient-to-r from-transparent via-border to-transparent',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'default',
    },
  }
)

// ============================================================================
// 骨架屏变体
// ============================================================================

export const skeletonVariants = cva(
  'animate-pulse rounded-md bg-muted',
  {
    variants: {
      variant: {
        default: '',
        text: 'h-4 w-full',
        circle: 'rounded-full',
        button: 'h-9 w-24',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// ============================================================================
// 工具提示变体
// ============================================================================

export const tooltipVariants = cva(
  'z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs animate-in fade-in-0 zoom-in-95',
  {
    variants: {
      variant: {
        default: 'bg-popover text-popover-foreground border shadow-md',
        dark: 'bg-gray-900 text-white',
        light: 'bg-white text-gray-900 border shadow-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// ============================================================================
// 加载指示器变体
// ============================================================================

export const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      variant: {
        default: 'text-primary',
        secondary: 'text-secondary',
        muted: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
)
