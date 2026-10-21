---
id: note_c_control_001
title: 分支与循环（C语言第3章）
type: note
domain: programming
tags: [C语言, if, switch, for, while]
links: [note_c_types_001, note_c_function_001]
source_refs: [source_c_lab_guide#chunk_2]
difficulty: 2
updated_at: 2026-10-19
owner: demo_student
---
## 这是什么

程序的三条基本控制结构：顺序、分支、循环。考试与上机都绕不开。

## 分支

```c
if (score >= 90) grade = 'A';
else if (score >= 60) grade = 'B';
else grade = 'C';
```

switch 适合"等值多分支"，别忘了每个 case 后面的 `break`。

## 循环

```c
for (int i = 0; i < n; i++) sum += a[i];   // 已知次数
while (scanf("%d", &x) == 1) { ... }       // 未知次数
do { ... } while (cond);                    // 至少执行一次
```

## 例题

求 1 到 100 中所有偶数的和：

```c
int sum = 0;
for (int i = 2; i <= 100; i += 2) sum += i;
printf("%d", sum);   // 2550
```

## 易错点

1. `if (a = 1)` 把赋值当判断，永远为真。
2. for 循环里 `i <= n` 和 `i < n` 混用，导致多算或少算。
3. switch 漏 break 造成"贯穿"。

## 自测

- [ ] 输出九九乘法表
- [ ] 判断一个整数是否为素数

## 下一步

重复的逻辑要抽成[函数](note_c_function_001)，这是模块化的起点。
