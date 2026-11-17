/**
 * 错误日志服务
 * 收集、存储和报告应用错误
 */

interface ErrorLog {
  id: string;
  timestamp: number;
  message: string;
  stack?: string;
  componentStack?: string;
  userAgent: string;
  url: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs: number = 100;
  private storageKey: string = 'edunexus_error_logs';

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadLogs();
      this.setupGlobalHandlers();
    }
  }

  /**
   * 设置全局错误处理器
   */
  private setupGlobalHandlers(): void {
    // 捕获未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          severity: 'high',
          context: { reason: event.reason },
        }
      );
    });

    // 捕获全局错误
    window.addEventListener('error', (event) => {
      this.logError(event.error || new Error(event.message), {
        severity: 'high',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });
  }

  /**
   * 记录错误
   */
  public logError(
    error: Error,
    options?: {
      severity?: ErrorLog['severity'];
      context?: Record<string, any>;
      componentStack?: string;
    }
  ): void {
    const log: ErrorLog = {
      id: this.generateId(),
      timestamp: Date.now(),
      message: error.message,
      stack: error.stack,
      componentStack: options?.componentStack,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
      severity: options?.severity || this.determineSeverity(error),
      context: options?.context,
    };

    this.logs.push(log);

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.saveLogs();

    // 在开发环境输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorLogger]', log);
    }

    // 对于严重错误，可以发送到监控服务
    if (log.severity === 'critical' || log.severity === 'high') {
      this.reportToMonitoring(log);
    }
  }

  /**
   * 确定错误严重程度
   */
  private determineSeverity(error: Error): ErrorLog['severity'] {
    const message = error.message.toLowerCase();

    if (
      message.includes('network') ||
      message.includes('fetch') ||
      message.includes('timeout')
    ) {
      return 'medium';
    }

    if (
      message.includes('syntax') ||
      message.includes('reference') ||
      message.includes('type')
    ) {
      return 'high';
    }

    if (message.includes('critical') || message.includes('fatal')) {
      return 'critical';
    }

    return 'low';
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 保存日志到本地存储
   */
  private saveLogs(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Failed to save error logs:', e);
    }
  }

  /**
   * 从本地存储加载日志
   */
  private loadLogs(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load error logs:', e);
    }
  }

  /**
   * 获取所有日志
   */
  public getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * 获取最近的日志
   */
  public getRecentLogs(count: number = 10): ErrorLog[] {
    return this.logs.slice(-count);
  }

  /**
   * 按严重程度过滤日志
   */
  public getLogsBySeverity(severity: ErrorLog['severity']): ErrorLog[] {
    return this.logs.filter((log) => log.severity === severity);
  }

  /**
   * 清除所有日志
   */
  public clearLogs(): void {
    this.logs = [];
    this.saveLogs();
  }

  /**
   * 清除旧日志
   */
  public clearOldLogs(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAge;
    this.logs = this.logs.filter((log) => log.timestamp > cutoff);
    this.saveLogs();
  }

  /**
   * 导出日志
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * 报告到监控服务
   */
  private async reportToMonitoring(log: ErrorLog): Promise<void> {
    // 这里可以集成第三方监控服务
    // 例如: Sentry, LogRocket, Bugsnag 等

    // 示例: 发送到自定义端点
    try {
      if (process.env.NODE_ENV === 'production') {
        // await fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(log),
        // });
      }
    } catch (e) {
      console.warn('Failed to report error to monitoring:', e);
    }
  }

  /**
   * 获取错误统计
   */
  public getStatistics(): {
    total: number;
    bySeverity: Record<ErrorLog['severity'], number>;
    recent24h: number;
  } {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    return {
      total: this.logs.length,
      bySeverity: {
        low: this.logs.filter((l) => l.severity === 'low').length,
        medium: this.logs.filter((l) => l.severity === 'medium').length,
        high: this.logs.filter((l) => l.severity === 'high').length,
        critical: this.logs.filter((l) => l.severity === 'critical').length,
      },
      recent24h: this.logs.filter((l) => now - l.timestamp < day).length,
    };
  }
}

// 单例实例
let loggerInstance: ErrorLogger | null = null;

export function getErrorLogger(): ErrorLogger {
  if (!loggerInstance) {
    loggerInstance = new ErrorLogger();
  }
  return loggerInstance;
}

/**
 * 便捷函数：记录错误
 */
export function logError(
  error: Error,
  options?: Parameters<ErrorLogger['logError']>[1]
): void {
  getErrorLogger().logError(error, options);
}

/**
 * 便捷函数：获取错误日志
 */
export function getErrorLogs(): ErrorLog[] {
  return getErrorLogger().getLogs();
}

/**
 * 便捷函数：清除错误日志
 */
export function clearErrorLogs(): void {
  getErrorLogger().clearLogs();
}
