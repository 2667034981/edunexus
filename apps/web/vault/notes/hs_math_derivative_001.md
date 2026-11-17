---
id: hs_math_derivative_001
title: 导数及其应用（选择性必修二）
type: note
domain: math
tags: [高中数学, 导数, 单调性, 极值, 切线]
links: [hs_math_function_001, hs_math_sequence_001]
source_refs: [source_hs_math_outline#chunk_3]
difficulty: 3
updated_at: 2026-11-17
owner: demo_student
---
## 这是什么

导数刻画函数的瞬时变化率，几何意义是曲线在该点处切线的斜率。

f'(x₀) = lim(Δx→0) [f(x₀+Δx) − f(x₀)] / Δx

## 必背求导公式

- (xⁿ)' = n·xⁿ⁻¹
- (sinx)' = cosx，(cosx)' = −sinx
- (eˣ)' = eˣ，(lnx)' = 1/x
- (uv)' = u'v + uv'
- (u/v)' = (u'v − uv')/v²
- 复合函数：y = f(g(x))，y' = f'(g(x))·g'(x)

## 三大应用

1. **切线**：y − f(x₀) = f'(x₀)(x − x₀)。
2. **单调性**：f'(x) > 0 递增，f'(x) < 0 递减。
3. **极值最值**：f'(x) = 0 且左右变号处取极值；闭区间最值比较端点与极值点。

## 例题

求 f(x) = x³ − 3x 的单调区间与极值。

f'(x) = 3x² − 3 = 3(x−1)(x+1)。
- x < −1 或 x > 1 时 f' > 0，递增；
- −1 < x < 1 时 f' < 0，递减。
极大值 f(−1) = 2，极小值 f(1) = −2。

## 易错点

1. 链式法则漏乘内层导数（最高频扣分点）。
2. "在区间上单调递增" 与 "单调递增区间是" 的区别（前者是包含关系）。
3. 含参讨论时漏掉 a = 0 或判别式 Δ 的情况。

## 下一步

导数是压轴题的常客，常与[数列](hs_math_sequence_001)不等式放缩、恒成立问题结合。
