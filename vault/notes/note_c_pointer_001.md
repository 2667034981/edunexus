---
id: note_c_pointer_001
title: 指针初步（C语言第6章）
type: note
domain: programming
tags: [C语言, 指针, 地址, 野指针]
links: [note_c_array_001, note_c_function_001]
source_refs: [source_c_lab_guide#chunk_5]
difficulty: 4
updated_at: 2026-10-19
owner: demo_student
---
## 这是什么

指针是存地址的变量。`&` 取地址，`*` 解引用。

```c
int a = 10;
int *p = &a;      // p 保存 a 的地址
*p = 20;          // 通过 p 改 a，此时 a == 20
```

## 指针与数组

```c
int a[3] = {1, 2, 3};
int *p = a;        // 等价于 &a[0]
p[1]  ==  *(p + 1)  ==  a[1]
```

数组名本身不是指针变量，它是首元素地址，不能被赋值。

## 用指针交换两个数

```c
void swap(int *x, int *y) { int t = *x; *x = *y; *y = t; }
swap(&a, &b);
```

这是"值传递"下修改外部变量的标准做法。

## 易错点

1. 野指针：`int *p; *p = 1;` p 没指向任何有效内存。
2. 忘记判空就解引用。
3. 把 `*p++` 和 `(*p)++` 搞混。

## 自测

- [ ] 用指针遍历数组求平均值
- [ ] 解释 `int *p[3]` 和 `int (*p)[3]` 的区别

## 下一步

指针是数据结构的基础，大二学链表、树时会反复用到。
