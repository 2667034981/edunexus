import { useState, useCallback, useEffect, useRef } from 'react';

interface Size {
  width: number;
  height: number;
}

interface UseResizableOptions {
  initialSize?: Size;
  minSize?: Size;
  maxSize?: Size;
  storageKey?: string;
}

/**
 * 可调整大小 Hook
 * @param options 配置选项
 */
export function useResizable(options: UseResizableOptions = {}) {
  const {
    initialSize = { width: 400, height: 600 },
    minSize = { width: 320, height: 400 },
    maxSize = { width: 800, height: 900 },
    storageKey,
  } = options;

  // 从 localStorage 加载保存的尺寸
  const loadSize = (): Size => {
    if (storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialSize;
        }
      }
    }
    return initialSize;
  };

  const [size, setSize] = useState<Size>(loadSize);
  const [isResizing, setIsResizing] = useState(false);
  const startSizeRef = useRef<Size>(size);
  const startPosRef = useRef({ x: 0, y: 0 });

  // 保存尺寸到 localStorage
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(size));
    }
  }, [size, storageKey]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startSizeRef.current = size;
    startPosRef.current = { x: e.clientX, y: e.clientY };
  }, [size]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      const newWidth = Math.max(
        minSize.width,
        Math.min(maxSize.width, startSizeRef.current.width + deltaX)
      );
      const newHeight = Math.max(
        minSize.height,
        Math.min(maxSize.height, startSizeRef.current.height + deltaY)
      );

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minSize, maxSize]);

  return {
    size,
    isResizing,
    handleResizeStart,
  };
}
