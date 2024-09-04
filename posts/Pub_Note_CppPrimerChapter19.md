---
title: C++ Primer 19.特殊工具与技术
---

## 控制内存分配

### 重载 new 和 delete 运算符

- 当使用 new 表达式时实际上执行了三步操作：

  - 调用 operator new/ operator new[] 分配内存
  - 调用构造函数初始化对象或者对象数组
  - 返回对象的指针

- 使用 delete 表达式时实际上执行了两步操作：
  - 对对象或者对象数组执行析构函数
  - 调用 operator delete/ operator delete[] 释放内存

编译器在调用 new/delete 表达式时，按照下面顺序查找 operator new/delete 函数：

- 在类及其基类中查找（如果是类的成员函数）
- 在全局作用域查找自定义的 operator new/delete 函数
- 如果没有找到，编译器会调用标准库中的 operator new/delete 函数

使用::new/delete 可以忽略类内 operator new/delete，直接调用全局作用域中的 operator new/delete 函数。

operator new/delete 函数接口：

```cpp
void *operator new(size_t size);
void *operator new[](size_t size);
void operator delete(void *rawMemory) noexcept;
void operator delete[](void *rawMemory) noexcept;


// 下面版本不抛出异常，其中nothrow_t是定义在头文件new中的一个空类
void *operator new(size_t size, const std::nothrow_t&) noexcept;
void *operator new[](size_t size, const std::nothrow_t&) noexcept;
void operator delete(void *rawMemory, const std::nothrow_t&) noexcept;
void operator delete[](void *rawMemory, const std::nothrow_t&) noexcept;
```

自定义 new/delete 运算符时：

- 定义的位置：
  - 可以在全局作用域中定义
  - 也可以将它们定义为成员函数
- 将上述运算符函数定义成类的成员时，它们是隐式静态的
- operator new 和 operator new[]第一个参数是 size_t 类型，且不能提供默认实参
- operator new[]的参数表示存储数组的所有元素所需的空间
- 自定义 operator new 可以提供额外的形参，调用的时候需要使用 new 的定位形式，`new(p) T(args...)`把额外的形参传递给 operator new
- 其中 void _operator new(size_t, void _)不允许进行重载
- 自定义 operator delete/delete[]时，可以包含另一个 size_t 的形参，表示第一个对象所指向的大小，该形参可用于删除继承体系中的对象
- 提供新的 operator new 函数和 operator delete 函数的目的在于改变内存分配的方式，但是不管怎样，我们都不能改变 new 运算符和 delete 运算符的基本含义。

```cpp
void *operator new(size_t size) {
	if (void *mem = malloc(size)) {
		return mem;
	} else {
		throw std::bad_alloc();
	}
}
void operator delete(void *mem) noexcept {
	free(mem);
}
```

### 定位 new 运算符

- 使用 new 的定位 new （placement new）形式用来构造对象

placement new 的形式如下：

```cpp
new (place_address) type
new (place_address) type (initializers)
new (place_address) type [size]
new (place_address) type [size] {initializers}

void* p = operator new(sizeof(int));
int* pi = new(p) int(0);
```

- 当仅通过一个地址值调用时，定位 new 使用 operator new(size_t, void\*)，这是一个无法自定义的 operator new 版本。它实际上不分配内存，只是简单地返回指针实参，然后由 new 表达式负责在指定的地址初始化对象以完成整个工作。
- placement new 跟 allocator 的 construct 成员类似，但是传给 construct 的指针来自 allocator 分配的空间，但传给 placement new 的指针不必是 operator new 返回的指针，甚至可以不是动态分配的内存。

调用析构函数

- 可以手动调用析构函数
- 调用析构函数会销毁对象，但是不会释放内存

```cpp
string *ps = new string;
ps->~string();
```

## 运行时类型识别

- RTTI（运行时类型识别）由两个运算符构成：
  - typeid 运算符：返回表达式的类型
  - dynamic_cast 运算符：用于将基类的指针或引用安全地转换成派生类的指针或引用
- RTTI 适用于：想使用基类对象的指针或引用执行某个派生类操作并且该操作不是虚函数。
- 使用 RTTI 必须要加倍小心。在可能的情况下，最好定义虚函数而非直接接管类型管理的重任。

### dynamic_cast 运算符

dynamic_cast 的使用形式如下：

- e 要求是 type 的公有派生类、公有基类或者就是 type 类型本身
- 如果符合，类型转换成功，否则返回 nullptr（指针类型）或者抛出 bad_cast 异常（引用类型）

```cpp
dynamic_cast<type*>(e) // 指针
dynamic_cast<type&>(e) // 左值
dynamic_cast<type&&>(e) // 不能是左值
```

```cpp
// 指针
if (Derived *dp = dynamic_cast<Derived*>(bp)) {
	// 使用 Derived 对象的成员
} else {
	// 使用 Base 对象的成员
}

// 引用
try {
	// 如果 bp 指向的是 Derived 对象，则转换成功
	Derived &dr = dynamic_cast<Derived&>(bp);
	// 使用 Derived 对象的成员
} catch (bad_cast) {
	// bp 指向的是 Base 对象
}
```

- 对一个空指针执行 dynamic cast，结果是所需类型的空指针

### typeid 运算符

- typeid 的使用方式为：`typeid(e)`，其中 e 可以是任意表达式或者类型名
- 返回 type_info 或者其公有派生类对象的常量引用
- type_info 定义在头文件 typeinfo 中
- typeid 运算符可以作用于任意类型的表达式：
  - 和往常一样，顶层 const 会被忽略
  - 如果 e 是引用，则 typeid 返回引用所引对象的类型
  - typeid 作用与数组和函数时，返回数组元素的类型和函数类型而不是指针类型
  - 如果 e 不属于类类型或者是一个不包含任何虚函数的类时，typeid 运算符指示的是运算对象的静态类型。而当运算对象是定义了至少一个虚函数的类的左值时，typeid 的结果直到运行时才会求得。

通常使用 typeid 比较两个表达式的类型是否相同：

- 当 typeid 作用与指针时，返回的是指针本身的静态类型
- 如果 p 是一个空指针，则 typeid (\*p)将抛出一个名为 bad typeid 的异常

```cpp
Derived *dp = new Derived;
Base *bp = dp;
if (typeid(*bp) == typeid(*dp)) {
	// *bp 和 *dp 的类型相同
}
if (typeid(*bp) == typeid(Derived)) {
	// *bp 的类型是 Derived
}

if (typeid(bp) == typeid(Derived)) { // false，指针类型
}
```

### 使用 RTTI

例如，想要通过 RTTI 实现具有继承关系的类实现相等操作，要求：

- 两个对象类型相同
- 对应的数据成员相等

```cpp
class Base {
    friend bool operator==(const Base&, const Base&);
public:
    // ...
protected:
    virtual bool equal(const Base&) const;
};

class Derived: public Base {
public:
    // ...
protected:
    bool equal(const Base&) const;
};

bool operator==(const Base &lhs, const Base &rhs) {
    return typeid(lhs) == typeid(rhs) && lhs.equal(rhs);
}

bool Base::equal(const Base &rhs) const {
    // 执行比较操作
}

bool Derived::equal(const Base &rhs) const {
    auto r = dynamic_cast<const Derived&>(rhs);
    // 继续执行比较操作
}
```

### type_info 类型

- type_info 类型定义在头文件 typeinfo 中
- type_info 的具体定义因编译器而异
- type_info 一般是作为一个基类出现，它还提供一个公有的虚析构函数。当编译器希望提供额外的类型信息时，通常在 type_info 的派生类中完成。
- 没有默认构造函数，其拷贝和移动构造函数以及赋值运算符都被定义为删除的。创建 type_info 对象的唯一途径是使用 typeid 运算符

type_info 支持的操作：

```cpp
t1 == t2 // 比较两个对象是否表示同一种类型
t1 != t2 // 比较两个对象是否表示不同的类型
t.name() // 返回类型的 C 风格字符串，表示类的可打印类型，生成方式因系统而异
t1.before(t2) // 比较两个对象的类型，如果 t1 在 t2 之前，则返回 true，采取的顺序因编译器而异
```

## 枚举类型

- 和类一样，每个枚举类型定义了一种新的类型。枚举属于字面值常量类型。
- C++包含两种枚举：
  - 限定作用域的
  - 不限定作用域
- 默认情况下，枚举值从 О 开始，依次加 1。
- 如果没有提供值，当前枚举成员的值等于之前枚举成员的值加 1

```cpp
enum class open_modes { input, output, append };
open_modes om = open_modes::input;

enum color { red, yellow, green };
color col = red;

enum { floatPrec = 6, doublePrec = 10 };
```

- 每个枚举成员本身就是一条常量表达式，可以在任何需要常量表达式的地方使用枚举成员，例如：
  - switch 语句
  - case 标签
  - 非类型模板参数

```cpp
enum class open_modes { input, output, append };
constexpr open_modes om = open_modes::input;
switch (om) {
case open_modes::input:
	// ...
	break;
}

template <open_modes om>
class MyClass {
	// ...
};
```

类型转换：

- 不限作用域的枚举类型可以隐式转换为整型
- 限定作用域的枚举类型不会隐式转换为整型

```cpp
enum class open_modes { input, output, append };
enum color { red, yellow, green };

int i = open_modes::input; // 错误，不能隐式转换
int j = color::red; // 正确，可以隐式转换
```

可以为 enum 指定类型：

- 默认情况下限定作用域的 enum 成员类型是 int
- 不限定作用域的枚举类型来说，其枚举成员不存在默认类型（因编译器而异），只知道成员的潜在类型足够大，肯定能够容纳枚举值。
- 如果指定了类型，如果枚举值超出了指定类型的范围，编译器会报错
- enum 的前置声明：
  - 不限作用域的必须指定成员类型
  - 限定作用域的可以使用默认 int 类型
- 声明要保证：
  - 是限定作用域还是非限定作用域要一致
  - 成员大小要一致

```cpp
enum intValues : unsigned long long {
	// ...
};

enum intValues : unsigned long long; // 不限定作用域的枚举类型前置声明
enum class open_modes;// 限定作用域的枚举类型前置声明
```

- 要想初始化一个 enum 对象，必须使用该 enum 类型的对象或者枚举成员，而不能是整型
- 但是可以将一个不限定作用域的枚举类型的对象或枚举成员传给整型形参，enum 提升为更大的整型
- 枚举成员永远不会提升成 unsigned char，即使枚举值可以用 unsigned char 存储也是如此。

```cpp
void newf(unsigned char);
void newf(int);
unsigned char uc = VIRTUAL;
newf(uc); // 调用 newf(unsigned char)
newf(VIRTUAL); // 调用 newf(int)
```

## 类成员指针

- 成员指针是指可以指向类的非静态成员的指针，指示的是类的成员，而非类的对象
- 类的静态成员不属于任何对象，指向静态成员的指针与普通指针没有任何区别。
- 成员指针的类型囊括了类的类型以及成员的类型。
- 当初始化一个这样的指针时，我们令其指向类的某个成员，但是不指定该成员所属的对象，直到使用成员指针时，才提供成员所属的对象。

### 数据成员指针

```cpp
class Screen {
public:
	typedef std::string::size_type pos;
	char get_cursor() const { return contents[cursor]; }
	char get() const;
	char get(pos ht, pos wd) const;
	Screen &move(pos r, pos c);
	static const std::string Screen::*data() { return &Screen::contents; }
private:
	std::string contents;
	pos cursor;
	pos height, width;
};

const string Screen::*pdata = &Screen::contents;
Screen myScreen, *pScreen = &myScreen;
char c1 = myScreen.*pdata; // 等价于 myScreen.contents
char c2 = pScreen->*pdata; // 等价于 pScreen->contents
```

- 常规的访问控制规则对成员指针同样有效，由于在外边无法访问私有成员，因此通常使用一个静态成员函数返回一个指向私有成员的指针。

```cpp
class Screen {
public:
    static const std::string Screen::*data() { return &Screen::contents; }
};

const string Screen::*pdata = Screen::data();
auto s = myScreen.*pdata;
```

### 成员函数指针

### 将成员函数作为可调用对象

## 嵌套类

- 定义在另外一个类内部的类称为嵌套类
- 嵌套类是一个独立的类，与外层类基本没有什么关系
- 外层类对嵌套类的成员没有特殊的访问权限，同样，嵌套类对外层类的成员也没有特殊的访问权限。
- 嵌套类的名字在外层类作用域之外不可见。

## union：一种节省空间的类

- union 是一种特殊的类，它可以有多个数据成员，但是在任意时刻只有一个数据成员可以有值。
- 分配给一个 union 对象的存储空间至少要能容纳它的最大的数据成员。
- 给 union 的某个成员赋值之后，该 union 的其他成员就变成未定义的状态了。
- class 的某些特性对 union 并不适用：
  - union 不能含有引用类型的成员
  - 默认情况下，union 的成员是 public 的。
  - union 不能继承自其他类，也不能作为基类，所以它不能含有虚函数。
- 在 C++11 标准中，含有构造函数或析构函数的类类型也可以作为 union 的成员类型。

```cpp
union Token {
    char cval;
    int ival;
    double dval;
};

Token first_token = {'a'};  // 初始化 cval
Token last_token; // 未初始化
Token *pt = new Token; //指向未初始化的Token对象

last_token.cval = 'z'; // 令其他数据成员变成未定义的状态
pt->ival = 42;
```

匿名 union：

- 匿名 union 一旦被定义，编译器就自动为其创建一个未命名的对象
- 在匿名 union 定义的作用域内该 union 的成员都是可以直接访问的。
- 匿名 union 不能包含受保护的成员或私有成员（只能有默认的 public 的），也不能定义成员函数。

```cpp
union {
    char cval;
    int ival;
    double dval;
};
cval = 'c';
ival = 42;
```

包含类类型成员的 union：

- 当 union 包含的是内置类型的成员时，我们可以使用普通的赋值语句改变 union 保存的值。
- 但对于含有特殊类类型成员的 union：
  - 将其他值改为类类型成员对应的值，必须构造该类型成员
  - 将类类型成员的值改为一个其他值，必须析构该类类型的成员

使用类管理 union 成员：

- 对于 union 来说，要想构造或销毁类类型的成员必须执行非常复杂的操作
- 因此我们通常把含有类类型成员的 union 内嵌在另一个类当中
- 为了追踪 union 中到底存储了什么类型的值，我们通常会定义一个独立的对象，该对象称为 union 的判别式。

```cpp
class Token {
public:
    Token(): tok(INT), ival{0} {}
    Token(const Token &t): tok(t.tok) { copyUnion(t); }
    Token &operator=(const Token&);
    ~Token() { if (tok == STR) sval.~string(); }

    Token& operator=(const std::string&);
    Token& operator=(char);
    Token& operator=(int);
    Token& operator=(double);
private:
    enum {INT, CHAR, DBL, STR} tok;
    union {
        char cval;
        int ival;
        double dval;
        std::string sval;
    };

    void copyUnion(const Token&);
};

Token &Token::operator=(int i) {
    if (tok == STR) sval.~string();
    ival = i;
    tok = INT;
    return *this;
}

Token &Token::operator=(const std::string s&) {
    if (tok == STR) sval = s;
    else new (&sval) string(s);  // 需要使用定位new表达式
    tok = STR;
    return *this;
}

void Token::copyUnion(const Token &t) {
    switch(t.tok) {
        case Token::INT: ival = t.ival; break;
        case Token::CHAR: cval = t.cval; break;
        case Token::DBL: dval = t.dval; break;
        case Token::STR: new (&sval) string(t.sval); break;
    }
}

Token& Token::operator=(const Token &t) {
    if (tok == STR && t.tok != STR) sval.~string();
    if (tok == STR && t.tok == STR) sval = t.sval;
    else copyUnion(t);
    tok = t.tok;
    return *this;
}
```

## 局部类

- 类可以定义在某个函数的内部，我们称这样的类为局部类
- 局部类被封装在函数内部
- 局部类定义的类型只在定义它的作用域内可见。
- 局部类的所有成员（包括函数在内）都必须完整定义在类的内部
- 在局部类中也不允许声明静态数据成员
- 局部类：
  - 能访问外层作用域定义的类型名、静态变量以及枚举成员
  - 不能访问则该函数的普通局部变量

```cpp
int a, val;
void foo(int val) {
	static int si;
	enum Loc { a = 1024, b = 2048 };
	struct Bar {
		Loc locVal;
		int barVal;
		void footBar(Loc l = a) {
			barVal = val; // 错误，局部类不能访问函数的局部变量
			barVal = ::val; // 访问全局变量
			barVal = si; // 访问静态局部变量
			locVal = b; // 访问枚举成员
		}
	};
}
```

- 外层函数对局部类的私有成员没有任何访问特权，不过局部类可以将外层函数声明为友元
- 更常见的情况是局部类将其成员声明成公有的，函数直接访问

还可以在局部类中嵌套类：

- 局部类内的嵌套类也是一个局部类，必须遵循局部类的各种规定。嵌套类的所有成员都必须定义在嵌套类内部。

```cpp
void foo() {
    class Bar {
    public:
        class Nested;
    };

    class Bar::Nested {
        // ...
    };
}
```

## 固有的不可移植的特性

- 所谓不可移植的特性是指因机器而异的特性
- 当将含有不可移植特性的程序从一台机器转移到另一台机器上时，通常需要重新编写该程序

### 位域

- 当一个程序需要向其他程序或硬件设备传递二进制数据时，通常会用到位域
- 类可以将其(非静态)数据成员定义成位域
- 位域在内存中的布局是与机器相关的
- 位域的类型必须是整型或枚举类型
- 因为带符号位域的行为是由具体实现确定的，所以在通常情况下我们使用无符号类型型保存一个位域
- 取地址运算符(&)不能作用于位域，因此任何指针都无法指向类的位域
- 位域的声明形式是在成员名字之后紧跟一个冒号以及一个常量表达式

```cpp
typedef unsigned int Bit;
class File {
    Bit mode: 2;
    Bit modified: 1;
    Bit prot_owner: 3;
    Bit prot_group: 3;
    Bit prot_world: 3;
public:
    enum modes { READ = 01, WRITE = 02, EXECUTE = 03 };
    File &open(modes);
    void close();
    void write();
    bool isRead() const;
    void setWrite();
};

File &File::open(modes m) {
    mode |= READ; // 通常使用位运算符来设置位域
    return *this;
}

```

### volatile 限定符

- 要想让使用了 volatile 的程序在移植到新机器或新编译器后仍然有效，通常需要对该程序进行某些改变。
- 直接处理硬件的程序常常包含这样的数据元素：
  它们的值由程序直接控制之外的过程控制。例如，程序可能包含一个由系统时钟定时更新的变量。当对象的值可能在程序的控制或检测之外被改变时，应该将该对象声明为 volatile。
- 关键字 volatile 告诉编译器不应对这样的对象进行优化。
- volatile 限定符的用法和 const 很相似，它起到对类型额外修饰的作用
- 与 const 不同的是，不能使用合成的拷贝/移动构造函数以及赋值运算符初始化 volatile 对象或从 volatile 对象赋值

```cpp
volatile int display_register;
volatile Task *curr_task;
int *volatile vip;
volatile int *const cvip;
```

### 链接指示 extern "C"

- C++程序有时需要调用其他语言编写的函数,最常见的是调用 C 语言编写的函数
- 对于其他语言编写的函数来说，编译器检查其调用的方式与处理普通 C++函数的方式相同，但是生成的代码有所区别。
- C++使用链接接指示指出任意非 C++函数所用的语言。
- 要想把 C++代码和其他语言（包含 C 语言）编写的代码放在一起使用，要求必须有权访问该语言的编译器，且该编译器与当前的 C++编译器是兼容的。

声明一个非 C++函数：

- 链接指示可以有两种形式：
  - 单个的
  - 复合的
- 链接指示不能出现在类定义或函数定义的内部。同样的链接指示必须在函数的每个声明中都出现。
- 当一个\#include 指示被放置在复合链接指示的花括号中时，头文件中的所有普通函数声明都被认为是由链接指示的语言编写的。

```cpp
// 可能出现在头文件<cstring>中的链接指示
extern "C" size_t strlen(const char *); // 单个链接指示

extern "C" { // 复合链接指示
    int strcmp(const char*, const char*);
    char *strcat(char*, const char*);
}

extern "C" {
#include <string.h>
}
```

C++从 C 语言继承的标准库函数可以定义成 C 函数，但并并非必须：决定使用 C 还是 C++实现 C 标准库,是每个 C++实现的事情。

指向 extern "C"函数的指针：

- 链接指示（编写函数所用的语言）是函数类型的一部分，所以：
  - 对于使用链接指示定义的函数来说，它的每个声明都必须使用相同的链接指示
  - 函数指针必须与函数本身使用相同的链接指示
- 有的 C++编译器会接受之前的这种赋值操作并将其作为对语言的扩展，尽管从严格意义上来看它是非法的。

```cpp
void (*pf1)(int); // C++函数
extern "C" void (*pf2)(int); // C函数
pf1 = pf2;  // 错误，类型不同
```

链接指示对整个声明都有效：

- 对于函数、函数返回类型和函数形参中的函数指针都有效
- 如果希望给 C++函数传入指向 C 函数的指针，必须使用类型别名

```cpp
extern "C" void f1(void(*)(int)); // f1是一个C函数，它的形参是一个C函数指针

extern "C" typedef void (*FC)(int); // FC是一个C函数指针类型
void f2(FC); // f2是一个C++函数，它的形参是一个C函数指针
```

导出 C++函数到其他语言：

- 编译器将为该函数生成适合于指定语言的代码
- 可被多种语言共享的函数的返回类型或形参类型受到很多限制：例如不能把 C++类传给 C 程序，C 也不支持函数重载

```cpp
extern "C" double calc(double dparm) { /* ...*/ } // calc可以被C程序调用

extern "C" void print(const char *);
extern "C" void print(int);  // 报错，不支持重载

extern "C" double calc(double);
extern int calc(int);  // 不报错，这个是C++的版本
```

有时需要在 C 和 C++中编译同一个源文件，为了实现这个目的，可以使用条件编译：

```cpp
#ifdef __cplusplus
extern "C"
#endif
int strcmp(const char*, const char*);
```
