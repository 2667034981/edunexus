/**
 * 时间格式化工具函数
 * 提供相对时间和绝对时间的格式化
 */

/**
 * 格式化为相对时间
 * 例如：刚刚、1分钟前、5分钟前、1小时前、今天 10:30、昨天 15:20、2024-03-09
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - targetDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // 刚刚（1分钟内）
  if (diffSeconds < 60) {
    return '刚刚';
  }

  // X分钟前（1小时内）
  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  }

  // X小时前（今天内）
  if (diffHours < 24 && isSameDay(now, targetDate)) {
    return `${diffHours}小时前`;
  }

  // 今天 HH:mm
  if (isSameDay(now, targetDate)) {
    return `今天 ${formatTime(targetDate)}`;
  }

  // 昨天 HH:mm
  if (diffDays === 1 || (diffDays < 2 && isYesterday(now, targetDate))) {
    return `昨天 ${formatTime(targetDate)}`;
  }

  // 本周内显示星期
  if (diffDays < 7 && isSameWeek(now, targetDate)) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${weekdays[targetDate.getDay()]} ${formatTime(targetDate)}`;
  }

  // 今年内显示 MM-DD HH:mm
  if (now.getFullYear() === targetDate.getFullYear()) {
    return formatDate(targetDate, 'MM-DD HH:mm');
  }

  // 其他显示完整日期 YYYY-MM-DD
  return formatDate(targetDate, 'YYYY-MM-DD');
}

/**
 * 格式化为绝对时间
 * 例如：2024-03-09 10:30:45
 */
export function formatAbsoluteTime(date: Date | string, includeSeconds = true): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const format = includeSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
  return formatDate(targetDate, format);
}

/**
 * 格式化日期
 */
export function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化时间（HH:mm）
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 判断是否是同一天
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 判断是否是昨天
 */
function isYesterday(today: Date, date: Date): boolean {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(yesterday, date);
}

/**
 * 判断是否在同一周
 */
function isSameWeek(date1: Date, date2: Date): boolean {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDayOfWeek = new Date(date1);
  firstDayOfWeek.setHours(0, 0, 0, 0);
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);

  return date2.getTime() >= firstDayOfWeek.getTime() && date2.getTime() <= lastDayOfWeek.getTime();
}

/**
 * 格式化时间范围
 * 例如：2024-03-09 10:00 - 11:30
 */
export function formatTimeRange(startDate: Date | string, endDate: Date | string): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isSameDay(start, end)) {
    return `${formatDate(start, 'YYYY-MM-DD')} ${formatTime(start)} - ${formatTime(end)}`;
  }

  return `${formatAbsoluteTime(start, false)} - ${formatAbsoluteTime(end, false)}`;
}

/**
 * 格式化持续时间
 * 例如：2小时30分钟
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}天${hours % 24}小时`;
  }
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`;
  }
  if (minutes > 0) {
    return `${minutes}分钟`;
  }
  return `${seconds}秒`;
}
