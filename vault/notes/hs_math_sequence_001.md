---
id: hs_math_sequence_001
title: 数列与求和方法
type: note
domain: math
tags: [高中数学, 数列, 等差, 等比, 求和]
links: [hs_math_function_001, hs_math_derivative_001]
source_refs: [source_hs_math_outline#chunk_4]
difficulty: 3
updated_at: 2026-11-17
owner: demo_student
---
## 两个基本数列

- 等差数列：aₙ = a₁ + (n−1)d；Sₙ = n(a₁+aₙ)/2 = na₁ + n(n−1)d/2。
- 等比数列：aₙ = a₁·qⁿ⁻¹；Sₙ = a₁(1−qⁿ)/(1−q)（q≠1）。

## 四种求和方法

| 方法 | 适用形式 |
|---|---|
| 公式法 | 等差 / 等比 |
| 错位相减 | 等差 × 等比（aₙ = n·2ⁿ） |
| 裂项相消 | 1/[n(n+1)] 类分式 |
| 分组求和 | 奇偶项规律不同 |

## 递推与通项

- aₙ₊₁ = aₙ + f(n)：用累加法。
- aₙ₊₁ = aₙ·f(n)：用累乘法。
- aₙ₊₁ = paₙ + q：构造等比数列 aₙ₊₁ + λ = p(aₙ + λ)。

## 例题

求数列 aₙ = n·2ⁿ 的前 n 项和。

设 Sₙ = 1·2 + 2·2² + … + n·2ⁿ，两边乘 2 后错位相减：
Sₙ − 2Sₙ = 2 + 2² + … + 2ⁿ − n·2ⁿ⁺¹
得 Sₙ = (n−1)·2ⁿ⁺¹ + 2。

## 易错点

1. 等比求和忘记讨论 q = 1。
2. 错位相减时最后一项符号写错。
3. 数列与函数混淆：n 只能取正整数。

## 下一步

数列不等式常与[导数](hs_math_derivative_001)放缩配合出现在压轴题。
