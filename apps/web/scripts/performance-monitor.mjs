#!/usr/bin/env node

/**
 * 性能监控脚本
 * 用于持续监控应用性能指标
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const METRICS_FILE = join(process.cwd(), 'performance-metrics.json');
const THRESHOLD_FILE = join(process.cwd(), 'performance-thresholds.json');

// 默认性能阈值
const DEFAULT_THRESHOLDS = {
  lighthouse: {
    performance: 90,
    accessibility: 90,
    bestPractices: 90,
    seo: 90,
  },
  webVitals: {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    FCP: 1500,
    TTFB: 800,
  },
  bundleSize: {
    total: 500 * 1024, // 500KB
    js: 300 * 1024,    // 300KB
    css: 50 * 1024,    // 50KB
  },
};

/**
 * 加载性能阈值
 */
function loadThresholds() {
  if (existsSync(THRESHOLD_FILE)) {
    try {
      const content = readFileSync(THRESHOLD_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.warn('Failed to load thresholds, using defaults');
    }
  }
  return DEFAULT_THRESHOLDS;
}

/**
 * 保存性能指标
 */
function saveMetrics(metrics) {
  const history = loadMetricsHistory();
  history.push({
    timestamp: new Date().toISOString(),
    ...metrics,
  });

  // 只保留最近 100 条记录
  const recentHistory = history.slice(-100);
  writeFileSync(METRICS_FILE, JSON.stringify(recentHistory, null, 2));
}

/**
 * 加载性能指标历史
 */
function loadMetricsHistory() {
  if (existsSync(METRICS_FILE)) {
    try {
      const content = readFileSync(METRICS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.warn('Failed to load metrics history');
    }
  }
  return [];
}

/**
 * 检查性能指标是否超过阈值
 */
function checkThresholds(metrics, thresholds) {
  const violations = [];

  // 检查 Lighthouse 分数
  if (metrics.lighthouse) {
    Object.entries(thresholds.lighthouse).forEach(([key, threshold]) => {
      if (metrics.lighthouse[key] < threshold) {
        violations.push({
          category: 'Lighthouse',
          metric: key,
          value: metrics.lighthouse[key],
          threshold,
          severity: 'high',
        });
      }
    });
  }

  // 检查 Web Vitals
  if (metrics.webVitals) {
    Object.entries(thresholds.webVitals).forEach(([key, threshold]) => {
      if (metrics.webVitals[key] > threshold) {
        violations.push({
          category: 'Web Vitals',
          metric: key,
          value: metrics.webVitals[key],
          threshold,
          severity: 'high',
        });
      }
    });
  }

  // 检查包大小
  if (metrics.bundleSize) {
    Object.entries(thresholds.bundleSize).forEach(([key, threshold]) => {
      if (metrics.bundleSize[key] > threshold) {
        violations.push({
          category: 'Bundle Size',
          metric: key,
          value: metrics.bundleSize[key],
          threshold,
          severity: 'medium',
        });
      }
    });
  }

  return violations;
}

/**
 * 生成性能报告
 */
function generateReport(metrics, violations) {
  console.log('\n=== Performance Monitoring Report ===\n');
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  // Lighthouse 分数
  if (metrics.lighthouse) {
    console.log('Lighthouse Scores:');
    Object.entries(metrics.lighthouse).forEach(([key, value]) => {
      const status = value >= 90 ? '✅' : value >= 50 ? '⚠️' : '❌';
      console.log(`  ${status} ${key}: ${value}`);
    });
    console.log('');
  }

  // Web Vitals
  if (metrics.webVitals) {
    console.log('Web Vitals:');
    Object.entries(metrics.webVitals).forEach(([key, value]) => {
      const threshold = DEFAULT_THRESHOLDS.webVitals[key];
      const status = value <= threshold ? '✅' : '❌';
      console.log(`  ${status} ${key}: ${value}ms (threshold: ${threshold}ms)`);
    });
    console.log('');
  }

  // 包大小
  if (metrics.bundleSize) {
    console.log('Bundle Size:');
    Object.entries(metrics.bundleSize).forEach(([key, value]) => {
      const threshold = DEFAULT_THRESHOLDS.bundleSize[key];
      const status = value <= threshold ? '✅' : '❌';
      const valueKB = (value / 1024).toFixed(2);
      const thresholdKB = (threshold / 1024).toFixed(2);
      console.log(`  ${status} ${key}: ${valueKB}KB (threshold: ${thresholdKB}KB)`);
    });
    console.log('');
  }

  // 违规项
  if (violations.length > 0) {
    console.log('⚠️  Performance Violations:');
    violations.forEach((v) => {
      console.log(`  - ${v.category} / ${v.metric}: ${v.value} (threshold: ${v.threshold})`);
    });
    console.log('');
  } else {
    console.log('✅ All metrics within thresholds!\n');
  }

  // 趋势分析
  const history = loadMetricsHistory();
  if (history.length > 1) {
    console.log('Trend Analysis:');
    const previous = history[history.length - 2];
    const current = metrics;

    if (previous.lighthouse && current.lighthouse) {
      const perfChange = current.lighthouse.performance - previous.lighthouse.performance;
      const trend = perfChange > 0 ? '📈' : perfChange < 0 ? '📉' : '➡️';
      console.log(`  ${trend} Performance Score: ${perfChange > 0 ? '+' : ''}${perfChange.toFixed(1)}`);
    }

    console.log('');
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('Starting performance monitoring...\n');

  // 这里应该实际运行性能测试
  // 示例数据
  const metrics = {
    lighthouse: {
      performance: 92,
      accessibility: 95,
      bestPractices: 93,
      seo: 97,
    },
    webVitals: {
      LCP: 2000,
      FID: 50,
      CLS: 0.05,
      FCP: 1200,
      TTFB: 600,
    },
    bundleSize: {
      total: 450 * 1024,
      js: 280 * 1024,
      css: 45 * 1024,
    },
  };

  // 保存指标
  saveMetrics(metrics);

  // 检查阈值
  const thresholds = loadThresholds();
  const violations = checkThresholds(metrics, thresholds);

  // 生成报告
  generateReport(metrics, violations);

  // 如果有违规项，退出码为 1
  if (violations.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Performance monitoring failed:', error);
  process.exit(1);
});
