---
title: C++ Primer 11.关联容器
---

八个标准库关联容器：
| 类型 | set/map | 是否有序 | key 是否唯一 | 头文件 |
| ------------------ | ------- | -------- | ------------ | ------------- |
| set | set | 有序 | 唯一 | set |
| multiset | set | 有序 | 不唯一 | set |
| map | map | 有序 | 唯一 | map |
| multimap | map | 有序 | 不唯一 | map |
| unordered_set | set | 无序 | 唯一 | unordered_set |
| unordered_multiset | set | 无序 | 不唯一 | unordered_set |
| unordered_map | map | 无序 | 唯一 | unordered_map |
| unordered_multimap | map | 无序 | 不唯一 | unordered_map |

## 使用关联容器

使用 map：

```cpp
map<string, size_t> word_count;
string word;
while (cin >> word)
	++word_count[word]; // 如果 word 不在 word_count 中，会插入一个新元素0
for (const auto &w : word_count)
	cout << w.first << " occurs " << w.second
		 << ((w.second > 1) ? " times" : " time") << endl; // w.first 是关键字，w.second 是值
```

使用 set：

```cpp
set<string> exclude = {"The", "But", "And", "Or", "An", "A",
						"the", "but", "and", "or", "an", "a"};
map<string, size_t> word_count;
string word;
while (cin >> word)
	if (exclude.find(word) == exclude.end()) // 如果 word 不在 exclude 中
		++word_count[word];
for (const auto &w : word_count)
	cout << w.first << " occurs " << w.second
		 << ((w.second > 1) ? " times" : " time") << endl;
```

## 关联容器概述

- 关联容器的迭代器是双向的

### 定义关联容器

```cpp
map<string, size_t> word_count; // 空 map
map<string, size_t> word_count = {{"hello", 1}, {"world", 2}}; // 列表初始化
map<string, size_t> word_count(word_count2); // 拷贝构造函数
map<string, size_t> word_count(word_count2.begin(), word_count2.end()); // 迭代器范围构造函数，只要迭代器指向的元素类型可以转换为 map 的 元素类型

set<string> exclude; // 空 set
set<string> exclude = {"The", "But", "And", "Or", "An", "A",
						"the", "but", "and", "or", "an", "a"}; // 列表初始化
set<string> exclude(exclude2); // 拷贝构造函数
set<string> exclude(exclude2.begin(), exclude2.end()); // 迭代器范围构造函数
```

multiset 能存储重复的关键字：

```cpp
vector<int> ivec{1,1,2,2,3,3};
set<int> iset(ivec.cbegin(), ivec.cend());
cout << iset.size() << endl; // 3
multiset<int> miset(ivec.cbegin(), ivec.cend());
cout << miset.size() << endl; // 6
```

### 关键字类型的要求

- 严格弱序：
  - 不能 a < b 且 b < a
  - 传递性：如果 a < b 且 b < c，则 a < c
  - 等价性：如果 !(a < b) 且 !(b < a)，则 a 和 b 等价，如果 a 和 b 等价，b 和 c 等价，则 a 和 c 等价
- 默认情况下，关联容器使用 `<` 运算符来比较关键字
- 也可以自己提供谓词函数来比较关键字

```cpp
bool compareIsbn(const Sales_data &lhs, const Sales_data &rhs)
{
	return lhs.isbn() < rhs.isbn();
}
multiset<Sales_data, decltype(compareIsbn)*> bookstore(compareIsbn);
```

### pair 类型

- pair 是一个模板类型，接受两个类型参数
- 定义在头文件 utility 中
- p1 relop(<,>,<=,>=) p2：按字典序比较，例如：p1.first < p2.first || (!(p2.first < p1.first) && p1.second < p2.second) 则 p1 < p2
- p1 == p2：p1.first == p2.first && p1.second == p2.second
- p1 != p2：!(p1 == p2)

```cpp
pair<string, int> p1;
pair<string, int> p2("hello", 1);
pair<string, int> p3 = {"world", 2};
pair<string, int> p4 = make_pair("hello", 1);

cout<< p2.first << " " << p2.second << endl; // hello 1
```

## 关联容器操作

### 关联容器类型成员

```cpp
set<string>::value_type v1; // string
set<string>::key_type v2; // string

map<string, int>::value_type v3; // pair<const string, int>
map<string, int>::key_type v4; // string
map<string, int>::mapped_type v5; // int
```

### 关联容器迭代器

### 添加元素

### 删除元素

### map 的下标操作

- map 和 unordered_map 支持下标操作，set 和 unordered_set 不支持
- 只能对非 const 的 map 进行下标操作
- map[key]：如果 key 不在 map 中，会插入一个新元素，进行值初始化
- map\.at(key)：如果 key 不在 map 中，会抛出 out_of_range 异常

### 访问元素

### 一个单词转换的 map

## 无序容器
