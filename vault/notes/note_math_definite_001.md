---
id: note_math_definite_001
title: 定积分及其应用
type: note
domain: math
tags: [高等数学, 定积分, 牛顿-莱布尼茨, 面积]
links: [note_math_integral_001]
source_refs: [source_math_calculus_guide#chunk_5]
difficulty: 3
updated_at: 2026-10-19
owner: demo_student
---
## 这是什么

定积分是"无限细分再求和"的极限，几何上是曲边梯形的面积（有向面积）。

## 核心公式

牛顿-莱布尼茨公式：∫[a,b] f(x)dx = F(b) - F(a)，其中 F 是 f 的原函数。

性质里最常用：区间可加性、奇偶性（奇函数在对称区间积分为 0）。

## 例题

求 ∫[0,1] x²dx。

原函数 F(x) = x³/3，所以结果 = 1/3 - 0 = 1/3。

## 应用套路

- 平面图形面积：上减下，∫(f - g)dx。
- 旋转体体积：绕 x 轴 V = π∫f²dx。
- 变上限积分求导：d/dx ∫[a,x] f(t)dt = f(x)。

## 易错点

1. 交换上下限忘记变号。
2. 被积函数含绝对值或分段时不分区间。
3. 面积题不看两曲线交点，直接相减会算出负值。

## 自测

- [ ] ∫[-1,1] x³dx = ?（先用奇偶性判断）
- [ ] 求 y = x 与 y = x² 围成的面积

## 下一步

高数上册到此结束，期末重点：极限计算 + 中值定理证明 + 定积分应用。
