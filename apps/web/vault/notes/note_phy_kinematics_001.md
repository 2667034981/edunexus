---
id: note_phy_kinematics_001
title: 质点运动学（大物第1章）
type: note
domain: physics
tags: [大学物理, 运动学, 速度, 加速度]
links: [note_phy_newton_001, note_math_derivative_001]
source_refs: [source_phy_textbook_ch1#chunk_1]
difficulty: 2
updated_at: 2026-10-19
owner: demo_student
---
## 这是什么

运动学研究"怎么动"，不涉及"为什么动"。核心三个量：位置 r、速度 v、加速度 a。

## 关系

- v = dr/dt（速度是位置对时间的导数）
- a = dv/dt = d²r/dt²（加速度是速度的导数）

这里直接用到了高数的[导数](note_math_derivative_001)。

## 匀变速直线运动三个公式

- v = v₀ + at
- x = v₀t + ½at²
- v² - v₀² = 2ax

## 例题

物体从静止开始以 2 m/s² 匀加速 3 秒，求位移。

x = v₀t + ½at² = 0 + ½ × 2 × 3² = 9 m。

## 易错点

1. 位移和路程混用（往返运动时两者不等）。
2. 忘记矢量方向，直接代数相加。
3. 单位不统一（km/h 与 m/s）。

## 自测

- [ ] 自由落体 2 秒下落的距离（g 取 9.8）
- [ ] 抛体运动最高点速度的竖直分量是多少

## 下一步

知道怎么描述运动后，进入[牛顿运动定律](note_phy_newton_001)解释原因。
