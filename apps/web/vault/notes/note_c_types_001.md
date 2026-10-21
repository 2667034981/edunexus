---
id: note_c_types_001
title: 数据类型与变量（C语言第2章）
type: note
domain: programming
tags: [C语言, 数据类型, sizeof, 补码]
links: [note_c_control_001, note_cs_number_system_001]
source_refs: [source_c_lab_guide#chunk_1]
difficulty: 2
updated_at: 2026-10-19
owner: demo_student
---
## 这是什么

C 语言是强类型语言，每个变量必须先声明类型，编译器据此分配内存、决定运算规则。

## 常见类型与大小（64 位 Windows / MinGW）

| 类型 | 字节 | 范围/说明 |
|---|---|---|
| char | 1 | -128 ~ 127 |
| short | 2 | -32768 ~ 32767 |
| int | 4 | -2³¹ ~ 2³¹-1 |
| float | 4 | 约 7 位有效数字 |
| double | 8 | 约 15 位有效数字 |

## 例题

```c
int a = 7, b = 2;
printf("%d %.2f", a / b, (double)a / b);
```

输出 `3 3.50`。整数相除直接截断小数，要得到小数必须先转型。

## 易错点

1. 整数除法截断：`5/2` 是 2 不是 2.5。
2. 用 `%d` 打印 float，输出乱码。
3. 忽略有符号数的补码表示，`-1` 的十六进制是 `0xFFFFFFFF`。

## 自测

- [ ] `sizeof(char)` 和 `sizeof("abc")` 分别是多少
- [ ] `-1` 按 32 位补码写出二进制

## 下一步

有了变量，接下来学[分支与循环](note_c_control_001)控制程序流程。
