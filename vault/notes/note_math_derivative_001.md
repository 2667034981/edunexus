---
id: note_math_derivative_001
title: 导数与微分（高数上第3章）
type: note
domain: math
tags: [高等数学, 导数, 求导法则, 复合函数]
links: [note_math_limit_001, note_math_mvt_001]
source_refs: [source_math_calculus_guide#chunk_2]
difficulty: 2
updated_at: 2026-10-19
owner: demo_student
---
## 这是什么

导数 = 瞬时变化率，几何意义是切线斜率：

f'(x₀) = lim(Δx→0) [f(x₀+Δx) - f(x₀)] / Δx

## 必背公式

- (xⁿ)' = n·xⁿ⁻¹，(sin x)' = cos x，(cos x)' = -sin x
- (eˣ)' = eˣ，(ln x)' = 1/x
- 乘积：(uv)' = u'v + uv'
- 商：(u/v)' = (u'v - uv') / v²
- 链式：y = f(g(x))，则 y' = f'(g(x))·g'(x)

## 例题

求 y = sin(2x + 1) 的导数。

外层 sin 的导数是 cos，内层 2x+1 的导数是 2，所以 y' = 2cos(2x + 1)。链式法则就是"由外向内，逐层求导，乘起来"。

## 易错点

1. 链式法则漏乘内层导数（最常见的扣分点）。
2. 把 (uv)' 写成 u'v'。
3. 求隐函数导数时忘记 y 是 x 的函数，漏写 y'。

## 自测

- [ ] y = (3x² + 1)⁵，求 y'
- [ ] 求曲线 y = x³ - 3x 在 x = 1 处的切线方程

## 下一步

导数的应用集中在中值定理和单调性判断，接着看[微分中值定理](note_math_mvt_001)。
