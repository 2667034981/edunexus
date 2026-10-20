---
id: note_c_function_001
title: 函数与作用域（C语言第4章）
type: note
domain: programming
tags: [C语言, 函数, 值传递, 递归, 作用域]
links: [note_c_control_001, note_c_array_001]
source_refs: [source_c_lab_guide#chunk_3]
difficulty: 3
updated_at: 2026-10-19
owner: demo_student
---
## 这是什么

函数把一段逻辑封装起来，通过参数接收输入、通过 return 返回结果。C 语言只有**值传递**。

## 基本结构

```c
int add(int a, int b);        // 声明（原型）

int add(int a, int b) {       // 定义
    return a + b;
}
```

## 值传递的含义

函数内修改形参，不会影响外面的实参：

```c
void change(int x) { x = 100; }
int a = 1; change(a);   // a 仍然是 1
```

想改外面的值必须传地址（指针），这就是[指针](note_c_pointer_001)的用武之地。

## 递归

```c
int fact(int n) {
    if (n <= 1) return 1;      // 递归出口
    return n * fact(n - 1);
}
```

## 易错点

1. 递归忘记写出口，栈溢出。
2. 声明与定义参数类型不一致。
3. 局部变量未初始化就使用。

## 自测

- [ ] 写一个函数判断闰年
- [ ] 用递归求斐波那契数列第 n 项

## 下一步

多个同类型数据用[数组](note_c_array_001)组织。
