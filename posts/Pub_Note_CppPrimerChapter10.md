---
title: C++ Primer 10.泛型算法
---

## 概述

- 泛型算法可以用于不同类型的元素和多种容器类型：
  - 标准库类型，如 vector 或 list
  - 内置的数组类型
  - 其他类型序列
- 大多数算法都定义在头文件 algorithm 中，数值算法定义在头文件 numeric 中。
- 泛型算法不直接操作容器，通常是遍历由两个迭代器指定的一个元素范围来进行操作。
- 使用迭代器让算法不依赖于容器类型，但大多数算法都使用了元素类型上的操作。如：find 使用==运算符来比较元素。不过大多数算法允许提供自定义的操作。
- 泛型算法不会改变容器的大小，但可能会改变容器中的元素的值。

## 初始泛型算法

### 只读算法

- find：在一个序列中查找一个值
- accumulate：累加序列中的值，指定一个初始值，元素必须要支持+运算符。accumulate 定义在头文件 numeric 中
- equal：判断两个序列是否相等，需要保证第二个序列至少和第一个序列一样长

```cpp
// find
vector<int> vec = {1, 2, 3, 4, 5};
vector<int>::iterator result = find(vec.begin(), vec.end(), 3);
vector<int>::iterator result = find(vec.begin(), vec.end(), 6);// end()

// accumulate
int sum = accumulate(vec.begin(), vec.end(), 0);

// equal
vector<int> vec1 = {1, 2, 3, 4, 5};
vector<int> vec2 = {1, 2, 3, 4, 5};
bool is_equal = equal(vec1.begin(), vec1.end(), vec2.begin());

```

注：操作两个序列的算法：

- 可以是不同的序列，例如：一个是 vector，一个是 list
- 两个序列的类型不必相同，但算法需要的操作必须要能够应用于这两种类型
- 一般参数有两种：
  - 第一个序列的迭代器范围和第二个序列的首元素迭代器（需要程序员自己保证不会访问超出第二个序列的范围）
  - 第一个序列的迭代器范围和第二个序列的迭代器范围

### 写容器元素的算法

- fill： 指定值填充容器
- fill_n：指定值填充指定数量的元素
- copy：将指定范围内的元素拷贝到另一个容器
- replace：将范围中的指定值替换为另一个值

```cpp
// fill
vector<int> vec = {1, 2, 3, 4, 5};
fill(vec.begin(), vec.end(), 0); // {0, 0, 0, 0, 0}

// fill_n
vec = {1, 2, 3, 4, 5};
fill_n(vec.begin(), 3, 0); // {0, 0, 0, 4, 5}

// copy
vec = {1, 2, 3, 4, 5};
vector<int> vec2(5);
copy(vec.begin(), vec.end(), vec2.begin()); // {1, 2, 3, 4, 5}

// replace
vec = {1, 2, 3, 4, 5};
replace(vec.begin(), vec.end(), 3, 0); // {1, 2, 0, 4, 5}

```

插入迭代器 back_inserter：每次赋值都会调用 push_back，给出一个简化的实现：

```cpp
template <typename Container>
class BackInsertIterator
{
public:
	...
    BackInsertIterator<Container> &operator=(const value_type &val)
    {
        cont_.insert(cont_.end(), val);
        return *this;
    }

    BackInsertIterator<Container> &operator*()
    {
        return *this;
    }
private:
    Container &cont_;
};
```

```cpp
vector<int> vec = {1, 2, 3, 4, 5};
vector<int> vec2;
copy(vec.begin(), vec.end(), back_inserter(vec2));
```

很多算法都提供拷贝版本：

```cpp
// replace
vec = {1, 2, 3, 4, 5};
replace(vec.begin(), vec.end(), 3, 0); // {1, 2, 0, 4, 5}
// replace_copy
vector<int> vec2(5);
replace_copy(vec.begin(), vec.end(), vec2.begin(), 3, 0); // {1, 2, 0, 4, 5} 将vec拷贝到vec2，替换3为0
```

### 重排容器元素的算法

- sort：对容器中的元素排序（默认升序），使用 < 运算符比较元素
- unique：“删除”相邻的重复元素，返回指向不重复序列的尾后迭代器。unique 并不真的删除任何元素，它只是覆盖相邻的重复元素，使得不重复元素出现在序列开始部分。

  ![Alt text](image.png)
  ![Alt text](image-1.png)

```cpp
// sort
vector<int> vec = {5, 4, 3, 2, 1};
sort(vec.begin(), vec.end()); // {1, 2, 3, 4, 5}

// unique
vec = {1, 2, 2, 3, 3, 4, 5};
vector<int>::iterator end_unique = unique(vec.begin(), vec.end()); // {1, 2, 3, 4, 5, ?, ?}
cout << (end_unique - vec.begin()) << endl; // 5
```

## 定制操作

## 再探迭代器

## 泛型算法结构

五种迭代器类型如下（层次从低到高）：
![Alt text](image-2.png)
除了输出迭代器器之外，一个高层类别的迭代器支持低层类别迭代器的所有操作。

每个算法都会对它的每个迭代器参数指明须提供哪类迭代器

### 输入迭代器

- 用于比较

### 输出迭代器

### 前向迭代器

### 双向迭代器

### 随机访问迭代器

### 算法形参模式

大多数算法具有如下几种模式：
![Alt text](image-3.png)

## 特定容器算法
