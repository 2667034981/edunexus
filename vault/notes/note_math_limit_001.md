---
id: note_math_limit_001
title: 极限与连续（高数上第2章）
type: note
domain: math
tags: [高等数学, 极限, 连续, ε-δ]
links: [note_math_derivative_001]
source_refs: [source_math_calculus_guide#chunk_1]
difficulty: 2
updated_at: 2026-10-19
owner: demo_student
---
## 这是什么

极限描述"无限接近"，是导数、积分、连续三件事的共同基础。考试里主要考三类：直接代入、等价无穷小替换、洛必达。

## 必须记住的结论

- 两个重要极限：lim(x→0) sin x / x = 1；lim(x→∞) (1 + 1/x)^x = e。
- 等价无穷小（x→0）：sin x ~ x，tan x ~ x，1 - cos x ~ x²/2，ln(1+x) ~ x，e^x - 1 ~ x。
- 连续的定义：lim(x→x₀) f(x) = f(x₀)，三个条件缺一不可（有定义、极限存在、相等）。

## 例题

求 lim(x→0) (1 - cos x) / x²。

分母是 x²，先做等价替换 1 - cos x ~ x²/2，得到极限 1/2。**替换前先确认整体是"乘除形式"**，加减形式不能直接换。

## 易错点

1. 加减法里直接做等价替换 —— 错得最多的一类。
2. 洛必达用完不检查是否还是 0/0 或 ∞/∞。
3. 分段函数在分界点处忘记分别求左右极限。

## 自测

- [ ] lim(x→0) sin 3x / 2x = ?
- [ ] 判断 f(x)=|x|/x 在 x=0 处是否连续

## 下一步

极限会直接用在[导数](note_math_derivative_001)的定义里，先把"无穷小替换"练熟。
