---
id: hs_math_probability_001
title: 概率与统计
type: note
domain: math
tags: [高中数学, 概率, 分布列, 期望, 统计]
links: []
source_refs: [source_hs_math_outline#chunk_6]
difficulty: 2
updated_at: 2026-11-17
owner: demo_student
---
## 概率基础

- 古典概型：P(A) = 事件 A 包含的基本事件数 / 基本事件总数。
- 互斥：P(A∪B) = P(A) + P(B)。
- 独立：P(AB) = P(A)·P(B)。
- 条件概率：P(B|A) = P(AB)/P(A)。

## 随机变量

- 分布列：所有取值概率之和为 1。
- 期望：E(X) = Σ xᵢpᵢ。
- 方差：D(X) = Σ (xᵢ − E(X))²pᵢ = E(X²) − [E(X)]²。

## 常见分布

- 二项分布 X~B(n,p)：P(X=k) = C(n,k)pᵏ(1−p)ⁿ⁻ᵏ，E(X) = np。
- 超几何分布：不放回抽样。

## 统计部分

- 平均数、中位数、众数、方差。
- 频率分布直方图：面积 = 频率，所有面积和为 1。
- 线性回归：过样本中心点 (x̄, ȳ)。

## 易错点

1. 分布列概率和不为 1。
2. 二项分布与超几何分布混用（有无放回）。
3. 直方图求频率忘记乘组距。

## 自测

- [ ] 抛一枚均匀硬币 5 次，求正面出现 3 次的概率。
- [ ] 已知 E(X)=2，D(X)=3，求 E(2X+1) 与 D(2X+1)。
