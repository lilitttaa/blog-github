---
title: C++ Primer 17.标准库特殊设施
---

## tuple 类型

- tuple 类型及其伴随类型和函数都定义在 tuple 头文件中。
- 可以将 tuple 看作一个“快速而随意”的数据结构

```cpp
tutple<size_t, size_t, size_t> threeD; // 所有成员都进行值初始化
tuple<string, vector<double>, int, list<int>> someVal("constants", {3.14, 2.718}, 42, {0, 1, 2, 3, 4, 5}); // explicit，使用值进行初始化
tutple<size_t, size_t, size_t> threeD{1, 2, 3}; // 使用花括号列表初始化
tutple<size_t, size_t, size_t> threeD = {1, 2, 3}; // 错误，explicit不能使用花括号列表初始化
auto item = make_tuple("0-999-78345-X", 3, 20.00); // 使用make_tuple函数，自动推断类型

auto book = get<0>(item); // item是右值，get返回右值引用
auto cnt = get<1>(item);
auto price = get<2>(item);
item.get<2>() *= 0.8; // item是左值，get返回左值引用

// == !=
tuple<size_t, size_t, size_t> threeD{1, 2, 3};
tuple<size_t, size_t, size_t> threeD2{1, 2, 3};
threeD == threeD2; // 长度相同，每个元素对应相等，返回true
threeD != threeD2; // false

// < <= > >= 字典序比较
tuple<size_t, size_t, size_t> threeD{1, 2, 3};
tuple<size_t, size_t, size_t> threeD2{1, 2, 4};
threeD < threeD2; // true

tuple<size_t, size_t, size_t> threeD{1, 2, 3};
tuple<size_t, size_t, size_t, size_t> threeD2{1, 2, 4, 5};
threeD < threeD2; // 错误，类型不同

tuple_size<decltype(item)>::value; // 3个元素，public constexpr static const size_t value = 3;

tuple_element<0, decltype(item)>::type; // 0号元素的类型
```

## Bitset 类型

## 正则表达式

## 随机数

## IO 库再探
