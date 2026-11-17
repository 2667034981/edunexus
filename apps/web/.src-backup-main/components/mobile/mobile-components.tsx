/**
 * 移动端优化组件库
 *
 * 提供一系列针对移动端优化的 React 组件
 * 所有组件都遵循移动端设计最佳实践
 */

import React from 'react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================================
// 移动端容器组件
// ============================================================================

interface MobileContainerProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export function MobileContainer({
  children,
  className,
  noPadding = false
}: MobileContainerProps) {
  return (
    <div className={cn(
      !noPadding && 'mobile-container',
      className
    )}>
      {children}
    </div>
  )
}

// ============================================================================
// 移动端卡片组件
// ============================================================================

interface MobileCardProps {
  children: React.ReactNode
  className?: string
  interactive?: boolean
  compact?: boolean
  onClick?: () => void
}

export function MobileCard({
  children,
  className,
  interactive = false,
  compact = false,
  onClick
}: MobileCardProps) {
  const Component = interactive ? motion.div : 'div'

  return (
    <Component
      className={cn(
        compact ? 'mobile-card-compact' : 'mobile-card',
        interactive && 'mobile-card-interactive cursor-pointer',
        className
      )}
      onClick={onClick}
      {...(interactive && {
        whileTap: { scale: 0.98 },
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      })}
    >
      {children}
    </Component>
  )
}

// ============================================================================
// 移动端列表组件
// ============================================================================

interface MobileListProps {
  children: React.ReactNode
  className?: string
}

export function MobileList({ children, className }: MobileListProps) {
  return (
    <div className={cn('mobile-list', className)}>
      {children}
    </div>
  )
}

interface MobileListItemProps {
  children: React.ReactNode
  className?: string
  compact?: boolean
  onClick?: () => void
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function MobileListItem({
  children,
  className,
  compact = false,
  onClick,
  leftIcon,
  rightIcon
}: MobileListItemProps) {
  return (
    <div
      className={cn(
        compact ? 'mobile-list-item-compact' : 'mobile-list-item',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {leftIcon && <div className="flex-shrink-0">{leftIcon}</div>}
      <div className="flex-1 min-w-0">{children}</div>
      {rightIcon && <div className="flex-shrink-0">{rightIcon}</div>}
    </div>
  )
}

// ============================================================================
// 移动端对话框组件
// ============================================================================

interface MobileDialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

export function MobileDialog({
  isOpen,
  onClose,
  children,
  title,
  className
}: MobileDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="mobile-dialog-overlay"
          />

          {/* 对话框内容 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn('mobile-dialog', className)}
          >
            {title && (
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-accent"
                  aria-label="关闭"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-4 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// 移动端抽屉组件
// ============================================================================

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  position?: 'bottom' | 'left' | 'right'
  className?: string
}

export function MobileDrawer({
  isOpen,
  onClose,
  children,
  title,
  position = 'bottom',
  className
}: MobileDrawerProps) {
  const getInitialPosition = () => {
    switch (position) {
      case 'left': return { x: '-100%' }
      case 'right': return { x: '100%' }
      case 'bottom': return { y: '100%' }
    }
  }

  const getAnimatePosition = () => {
    switch (position) {
      case 'left': return { x: 0 }
      case 'right': return { x: 0 }
      case 'bottom': return { y: 0 }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="mobile-dialog-overlay"
          />

          <motion.div
            initial={getInitialPosition()}
            animate={getAnimatePosition()}
            exit={getInitialPosition()}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn('mobile-drawer', className)}
          >
            {title && (
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-accent"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-4 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// 移动端标签页组件
// ============================================================================

interface MobileTabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>
  activeTab: string
  onTabChange: (id: string) => void
  className?: string
}

export function MobileTabs({
  tabs,
  activeTab,
  onTabChange,
  className
}: MobileTabsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* 标签栏 */}
      <div className="mobile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'mobile-tab',
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-muted-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <AnimatePresence mode="wait">
        {tabs.map((tab) => (
          tab.id === activeTab && (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab.content}
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 移动端网格组件
// ============================================================================

interface MobileGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 'auto'
  className?: string
}

export function MobileGrid({
  children,
  columns = 2,
  className
}: MobileGridProps) {
  const gridClass = columns === 'auto'
    ? 'mobile-grid-auto'
    : columns === 3
    ? 'mobile-grid-3'
    : 'mobile-grid-2'

  return (
    <div className={cn(gridClass, className)}>
      {children}
    </div>
  )
}

// ============================================================================
// 移动端加载指示器
// ============================================================================

interface MobileSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MobileSpinner({
  size = 'md',
  className
}: MobileSpinnerProps) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }[size]

  return (
    <div className={cn('mobile-spinner', sizeClass, className)} />
  )
}

// ============================================================================
// 移动端骨架屏
// ============================================================================

interface MobileSkeletonProps {
  className?: string
  variant?: 'text' | 'circle' | 'rect'
}

export function MobileSkeleton({
  className,
  variant = 'rect'
}: MobileSkeletonProps) {
  return (
    <div className={cn(
      'mobile-skeleton',
      variant === 'circle' && 'rounded-full',
      variant === 'text' && 'h-4',
      className
    )} />
  )
}

// ============================================================================
// 移动端通知组件
// ============================================================================

interface MobileToastProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  isVisible: boolean
  onClose: () => void
}

export function MobileToast({
  message,
  type = 'info',
  isVisible,
  onClose
}: MobileToastProps) {
  const bgColor = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className={cn('mobile-toast', bgColor, 'text-white')}
        >
          <p className="flex-1">{message}</p>
          <button
            onClick={onClose}
            className="ml-4 p-1 rounded hover:bg-white/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// 移动端徽章组件
// ============================================================================

interface MobileBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  dot?: boolean
  className?: string
}

export function MobileBadge({
  children,
  variant = 'default',
  dot = false,
  className
}: MobileBadgeProps) {
  const variantClass = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  }[variant]

  if (dot) {
    return (
      <span className={cn('mobile-badge-dot', variantClass, className)} />
    )
  }

  return (
    <span className={cn('mobile-badge', variantClass, className)}>
      {children}
    </span>
  )
}

// ============================================================================
// 移动端分隔线组件
// ============================================================================

interface MobileDividerProps {
  text?: string
  className?: string
}

export function MobileDivider({ text, className }: MobileDividerProps) {
  if (text) {
    return (
      <div className={cn('mobile-divider-text', className)}>
        {text}
      </div>
    )
  }

  return <div className={cn('mobile-divider', className)} />
}

// ============================================================================
// 移动端图片组件
// ============================================================================

interface MobileImageProps {
  src: string
  alt: string
  variant?: 'default' | 'cover' | 'avatar'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MobileImage({
  src,
  alt,
  variant = 'default',
  size = 'md',
  className
}: MobileImageProps) {
  const variantClass = {
    default: 'mobile-image',
    cover: 'mobile-image-cover',
    avatar: size === 'sm'
      ? 'mobile-avatar-sm'
      : size === 'lg'
      ? 'mobile-avatar-lg'
      : 'mobile-avatar'
  }[variant]

  return (
    <img
      src={src}
      alt={alt}
      className={cn(variantClass, className)}
      loading="lazy"
    />
  )
}

// ============================================================================
// 导出所有组件
// ============================================================================

export const MobileComponents = {
  Container: MobileContainer,
  Card: MobileCard,
  List: MobileList,
  ListItem: MobileListItem,
  Dialog: MobileDialog,
  Drawer: MobileDrawer,
  Tabs: MobileTabs,
  Grid: MobileGrid,
  Spinner: MobileSpinner,
  Skeleton: MobileSkeleton,
  Toast: MobileToast,
  Badge: MobileBadge,
  Divider: MobileDivider,
  Image: MobileImage,
}
