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

使用 tuple 返回多个值：

```cpp
tuple<string, int, double> get_student(int id)
{
	if (id == 0)
		return {"Tom", 20, 3.8};
	else if (id == 1)
		return {"Jerry", 21, 3.9};
	else
		return {"Mickey", 22, 4.0};
}
```

## bitset 类型

- 可以使用整数作为二进制位集合进行运算
- Bitset 能够处理超过最长整数位的大小
- 定义在头文件 bitset 中

```cpp
bitset<32> bitvec; // 32位的bitset，每位都是0，constexpr构造函数
bitset<13> bitvec2(0xbeef); // 使用unsigned long long初始化，bitset如果超过其位数，高位置为0
string str("1100");
bitset<32> bitvec3(str, 0, str.size()); // 从字符串初始化，从0开始，长度为str.size()
string str("aabb");
bitset<32> bitvec4(str, 0, str.size(), 'a', 'b'); // 从字符串初始化，从0开始，长度为str.size()，a和b分别对应0和1
bitset<32> bitvec5("1100", 4); // 从const char*初始化，从4开始，长度为4
```

更多细节参考：
![Alt text](image.png)

bitset 的操作：

```cpp
// any, all, none, count, size
bitset<8> bitvec("1100"); // 0 0 0 0 1 1 0 0
bitvec.any(); // true，是否有1
bitvec.all(); // false，是否全是1
bitvec.none(); // false，是否全是0
bitvec.count(); // 2，1的个数
bitvec.size(); // 8，位数
```

```cpp
// test, set, reset, flip，[]
bitset<8> bitvec("1100"); // 0 0 0 0 1 1 0 0
bitvec.test(0); // false，第0位是否为1
bitvec.test(2); // true，第2位是否为1
bitvec.set(0); // 0 0 0 0 1 1 0 1，将第0位设置为1
bitvec.set(2, 0); // 0 0 0 0 1 0 0 1，将第2位设置为0
bitvec.reset(3); // 0 0 0 0 0 0 0 1，将第3位设置为0
bitvec.reset(); // 0 0 0 0 0 0 0 0，将所有位设置为0
bitvec.flip(0); // 0 0 0 0 0 0 0 1，将第0位取反
bitvec.flip(); // 1 1 1 1 1 1 1 0，将所有位取反
bool b = bitvec[0]; // false，第0位是否为1
bool b = bitvec[2]; // true，第2位是否为1
```

```cpp
// |, &, ^, ~, <<, >>
bitset<8> bitvec("1100"); // 0 0 0 0 1 1 0 0
bitset<8> bitvec2("0110"); // 0 0 0 0 0 1 1 0
bitset<8> result = bitvec & bitvec2; // 0 0 0 0 0 1 0 0
bitset<8> result = bitvec | bitvec2; // 0 0 0 0 1 1 1 0
bitset<8> result = bitvec ^ bitvec2; // 0 0 0 0 1 0 1 0
bitset<8> result = ~bitvec; // 1 1 1 1 0 0 1 1
bitset<8> result = bitvec << 2; // 0 0 0 1 1 0 0 0
bitset<8> result = bitvec >> 2; // 0 0 0 0 0 0 1 1
```

```cpp
// to_ulong, to_ullong, to_string
bitset<8> bitvec("1100"); // 0 0 0 0 1 1 0 0
unsigned long ulong = bitvec.to_ulong(); // 12
unsigned long long ullong = bitvec.to_ullong(); // 12
string str = bitvec.to_string(); // "00000011"
```

```cpp
// <<, >>
bitset<8> bitvec("1100"); // 0 0 1 1 0 0 0 0
cin >> bitvec; // 从cin读入最多8个字符，0和1
cout << bitvec << endl; // 输出
```

## 正则表达式

- 定义在头文件 regex 中

![Alt text](image-1.png)

## 随机数

- 定义在头文件 random 中
- 通过一组协作的类来解决这些问题：随机数引擎类和随机数分布类
  - 随机数引擎类生成 unsigned 整数序列
  - 随机数分布类使用引擎返回符合特定分布的随机数
- C++程序不应该使用库函数 rand，而应使用 default random engine 类和恰当的分布类对象。
- 标准库定义了多个随机数引擎类，它们性能和质量不同，编译器选择默认的引擎类。
- 某些分布可能需要调用引擎多次才能得到一个值。

```cpp
default_random_engine e; // 默认引擎
for (size_t i = 0; i < 10; ++i)
	cout << e() << " "; // 生成随机数

uniform_int_distribution<unsigned> u(0, 9); // 0到9的均匀分布
for (size_t i = 0; i < 10; ++i)
	cout << u(e) << " "; // 生成0到9的随机数
```

```cpp
default_random_engine e; // 默认引擎
default_random_engine e2(2147483646); // 指定种子
e.seed(32767); // 指定种子
e.min(); // 引擎能生成的最小值
e.max(); // 引擎能生成的最大值
Engine::result_type; // 引擎生成的类型
e.discard(100); // 将引擎推荐100个值，参数为unsigned long long
```

随机性中令人困惑的部分：

- 每次运行程序，生成的随机数序列都是相同的（序列不变，对于调试来说确实很有用）
- 一个给定的随机数发生器，生成的内容是确定的。因此如果封装为函数，每次获取的结果都一样
- 可以将引擎和分布设为 static 的，这样每次生成都会保持状态

```cpp
unsigned get_random_number()
{
	default_random_engine e;
	uniform_int_distribution<unsigned> u(0, 9);
	return u(e);
}
cout << get_random_number() << endl;
cout << get_random_number() << endl; // 每次调用生成的随机数都一样

unsigned get_random_number()
{
	static default_random_engine e;
	static uniform_int_distribution<unsigned> u(0, 9);
	return u(e);
}
cout << get_random_number() << endl;
cout << get_random_number() << endl; // 保持状态，生成的随机数不一样
```

设置种子：

```cpp
default_random_engine e1;
e1.seed(32767); // 指定种子
default_random_engine e2(32767); // 指定种子
cout << e1() << endl;
cout << e2() << endl; // 种子相同，两个引擎生成的随机数序列相同

default_random_engine e1(time(0)); // 使用当前时间作为种子，但这个时间的变化是以秒为单位的，所以只适用于间隔大于1秒的情况
cout << e1() << endl;
```

### 其他的随机数分布

应用常常需要：

- 不同类型的随机数
- 不同的分布

```cpp
default_random_engine e;
uniform_real_distribution<double> u(0, 1); // 0到1的均匀分布
for (size_t i = 0; i < 10; ++i)
	cout << u(e) << " "; // 生成0到1的随机浮点数
```

分布类型操作：

```cpp
uniform_real_distribution<double> u； // 默认构造函数，其他构造函数的形式依赖于类型
uniform_real_distribution<> u; //默认为double类型
uniform_int_distribution<> u; // 默认为int类型
u(e); // 生成一个随机数
u.min(); // 返回分布的最小值
u.max(); // 返回分布的最大值
u.reset(); // 重建u的状态，使得后续的生成不再依赖于之前的值
```

标准库中定义了 20 种不同的分布类型

```cpp
// 正态分布
normal_distribution<> n(4, 1.5); // 均值4，标准差1.5
// 伯努利分布 总是返回一个bool值
bernoulli_distribution b; // 默认概率0.5/0.5
bernoulli_distribution b(0.75); // true的概率0.75
```

### 随机数附录

待补充

## IO 库再探

### 格式化输入和输出

- 除了条件状态外，每个 iostream 对象还维护一个格式状态
- 该状态控制 IO 如何格式化的细节：如整型值进制、浮点精度、元素宽度等
- 标准库定义了一组操纵符来修改流的格式状态
  - 操纵符用于两大类输出控制:控制数值的输出形式以及控制补白的数量和位置
  - 大多数改变格式状态的操纵符都是设置/复原成对的：一个用来将格式状态设置为一个新值，另一个用来将其复原。
  - 将流的状态置于一个非标准状态可能会导致错误。通常在不再需要特殊格式时尽快将流恢复到默认状态。

bool：

- boolalpha：将 bool 值输出为 true 或 false
- noboolalpha

```cpp
cout << true << " " << false; // 1 0
cout << boolalpha << true << " " << false << noboolalpha; // true false
```

整数：

- dec：十进制
- oct：八进制
- hex：十六进制
- showbase：显示进制前缀
- noshowbase

```cpp
cout << "default: " << 20 << " " << 1024 << endl; // 20 1024
cout << "oct: " << oct << 20 << " " << 1024 << endl; // 24 2000
cout << "hex: " << hex << 20 << " " << 1024 << endl; // 14 400
cout << "dec: " << dec << 20 << " " << 1024 << endl; // 20 1024

cout << showbase; // 显示进制前缀
cout << "default: " << 20 << " " << 1024 << endl; // 20 1024
cout << "oct: " << oct << 20 << " " << 1024 << endl; // 024 02000
cout << "hex: " << hex << 20 << " " << 1024 << endl; // 0x14 0x400
cout << "dec: " << dec << 20 << " " << 1024 << endl; // 20 1024
cout << noshowbase;
```

浮点数：

- setprecision(n)：设置浮点数的精度为 n 位，数字的总位数（整数+小数）
- scientific：使用科学计数法
- fixed：使用定点十进制
- hexfloat：使用十六进制浮点数
- defaultfloat：恢复默认格式
- sceintific、fixed、hexfloat 会改变精度的含义，表示小数点后的位数
- setprecision 和其他接受参数的操纵符都定义在头文件 iomanip 中
- showpoint：显示小数点
- noshowpoint

```cpp
float f = 100*sqrt(2.0);
cout << f << endl; // 141.421
cout << setprecision(4) << f << endl; // 141.4
cout << scientific << f << endl; // 1.4142e+02
cout << fixed << f << endl; // 141.4214
cout << hexfloat << f << endl; // 0x1.1eb85p+7
cout << defaultfloat << f << endl; // 141.421

cout << 10.0 << endl; // 10
cout << showpoint << 10.0 << endl; // 10.000
cout << noshowpoint << 10.0 << endl; // 10
```

还有其他的操纵符，参考如下：
![Alt text](image-2.png)
![Alt text](image-3.png)

### 未格式化的输入输出操作

### 流随机访问
