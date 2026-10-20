---
id: note_c_array_001
title: 数组与字符串（C语言第5章）
type: note
domain: programming
tags: [C语言, 数组, 字符串, 越界]
links: [note_c_function_001, note_c_pointer_001]
source_refs: [source_c_lab_guide#chunk_4]
difficulty: 3
updated_at: 2026-10-19
owner: demo_student
---
## 这是什么

数组是一段连续内存，存放同类型元素；下标从 0 开始，长度固定。

```c
int a[5] = {1, 2, 3, 4, 5};   // a[0] ~ a[4]
```

## 字符串

C 语言没有字符串类型，用 `char` 数组 + 结束符 `'\0'` 表示：

```c
char s[] = "abc";   // 实际占 4 个字节：a b c \0
```

- `strlen(s)` = 3（不含 `\0`）
- `sizeof(s)` = 4（含 `\0`）

## 例题：冒泡排序

```c
for (int i = 0; i < n - 1; i++)
    for (int j = 0; j < n - 1 - i; j++)
        if (a[j] > a[j+1]) { int t = a[j]; a[j] = a[j+1]; a[j+1] = t; }
```

## 易错点

1. 数组越界：`int a[5]` 访问 `a[5]` 是非法内存，编译器不报错，运行结果随机。
2. 用 `=` 比较字符串（应该用 `strcmp`）。
3. 字符数组忘记留 `'\0'` 的位置。

## 自测

- [ ] 求数组最大值及其下标
- [ ] 判断字符串是否为回文

## 下一步

数组名在多数场合会退化成首元素地址，这就是[指针](note_c_pointer_001)的入口。
