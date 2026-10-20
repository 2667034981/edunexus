---
id: note_math_integral_001
title: 不定积分（高数上第4章）
type: note
domain: math
tags: [高等数学, 不定积分, 换元法, 分部积分]
links: [note_math_mvt_001, note_math_definite_001]
source_refs: [source_math_calculus_guide#chunk_4]
difficulty: 3
updated_at: 2026-10-19
owner: demo_student
---
## 这是什么

不定积分是求导的逆运算：∫f(x)dx = F(x) + C，其中 F'(x) = f(x)。**C 不能丢**。

## 基本积分表（必须背）

- ∫xⁿdx = xⁿ⁺¹/(n+1) + C（n ≠ -1）
- ∫1/x dx = ln|x| + C
- ∫eˣdx = eˣ + C
- ∫sin x dx = -cos x + C
- ∫cos x dx = sin x + C
- ∫1/(1+x²)dx = arctan x + C

## 两种主要方法

1. 换元法：∫f(φ(x))φ'(x)dx = ∫f(u)du，凑微分是关键。
2. 分部积分：∫u dv = uv - ∫v du，口诀"反对幂指三"，谁在前谁当 u。

## 例题

∫x·eˣdx。

取 u = x，dv = eˣdx，则 du = dx，v = eˣ，
原式 = x·eˣ - ∫eˣdx = x·eˣ - eˣ + C = (x - 1)eˣ + C。

## 易错点

1. 忘记 + C。
2. 换元后忘记把变量换回 x。
3. 分部积分 u、dv 选反，越算越复杂。

## 自测

- [ ] ∫(2x + 1)⁵dx
- [ ] ∫x·cos x dx

## 下一步

不定积分加上上下限就是[定积分](note_math_definite_001)。
