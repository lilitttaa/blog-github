---
title: Games101 10.Geometry 1 (Introduction)
---

## Applications of Textures

![Alt text](image.png)

- 前面我们说的纹理就是一张图，但是从 GPU 的角度看来纹理其实是一块内存数据，所以它可以表示的内容就太多了。

### Environment Map

![Alt text](image-1.png)

- 从一个地方向四面八方看，我们可以把这个方向的光都记录下来，这就是环境光照。
- 然后就可以利用这个贴图，来渲染例如这个茶壶，这样就可以反射出任何方向的光。
- 环境光有个假设，就是光都是来自无限远的地方，所以我们只需要记录方向，不记录位置。
- 这个茶壶有个名字犹他茶壶（utah teapot），是犹他大学做的，是图形学中的经典模型之一。其他的还有斯坦福兔子（Stanford bunny）和斯坦福龙（Stanford dragon）以及康奈尔盒子（Cornell box）。

![Alt text](image-2.png)

我们可以把环境光存储再球上，就像展开一个地球仪一样，把它展成一个世界地图，这就是 spherical environment map。
![Alt text](image-3.png)
![Alt text](image-4.png)
但是展开后会有扭曲问题（包括地球仪是一个球面，所以在极点附近会有扭曲现象。南极洲看上去很小，但实际上很大）。

解决这个问题的方法是 cube map，把环境光存储在一个立方体的表面上而不是球面上。
![Alt text](image-5.png)
采集某个方向的光时，从球面上继续往前走。
cubemap 有六张图：
![Alt text](image-6.png)

- 当然 cubemap 带有了一些额外的计算，你需要先计算出是在哪张图上，但是这个计算非常快。
- 另外需要说的是，cubemap 不只是用来存储直接光，事实上看到的任何光照信息都能存储，这样就可以直接把整个环境的光照都记录下来。

### Bump/Normal Mapping

纹理不只是用来表示颜色，还可以表示其他属性，比如在一个表面上，任何一个点的相对高度（相对于原始高度的偏移）是多少，这就是凹凸贴图（bump map）。
![Alt text](image-7.png)

- 如果要表示凹凸的效果原本需要很多三角形
- 通过凹凸贴图可以在几何体不变的情况下，影响法线，从而产生这种明暗的变化，让人觉得有凹凸的效果。
- 凹凸贴图和法线贴图是一回事，取决于纹理定义的是什么。凹凸贴图定义的是相对高度，而法线贴图是直接定义法线。

![Alt text](image-8.png)

- 凹凸贴图对每个像素的法线进行扰动，通过定义的高度差重新计算法线。

我们先在这样一个 Flatland case 上看：
![Alt text](image-9.png)

- 切线如何计算：也就是相邻两个点的高度差，用点 p 和下一个点 p+1 的高度差除以间隔（也就是 1）。
- 这里还引入了一个常数，用来定义凹凸贴图的影响程度。
- 用旋转公式简单算一下就知道了法线等于(-dp, 1)。

然后我们再看三维的情况：
![Alt text](image-10.png)

- 求梯度，分别在 u 和 v 方向上求偏导

需要注意的是，我们这里计算的法线是在局部坐标系下的，因为我们前面假设了原本的法线是向上的。所以我们之后需要把这个局部坐标系下的法线转换回世界坐标系。（在作业三的常见问题中解答）

还有一种贴图叫做位移贴图（displacement map），它不是通过改变法线，而是直接改变顶点的位置。
![Alt text](image-11.png)

- 法线贴图在边缘的地方会露馅，而且涉及到自遮挡的问题，法线贴图也看不到这种阴影的现象。
- 要位移当然对几何体三角形数量的要求更高
- 为了避免对几何体的要求，我们可以先用一个粗糙的模型，然后根据位移的需要，动态地细分三角形。
- 这个方法在 directx 中提供了一个方法叫做动态细分（dynamic tessellation）。

### 3D Procedural Noise + Solid Modeling

![Alt text](image-12.png)

- 原本纹理都是二维的，贴在物体表面
- 但纹理也可以是三维的，比如定义一个三维的纹理，就是在空间中任何一个点的值。
- 这里也不是真的定义了大理石的纹理，而是定义了一个三维空间中的噪声函数，然后通过一系列的操作，得到我们需要的样子，比如大理石的裂缝
- 这个叫做 Perlin Noise，还广泛应用在地形生成上。

### Ambient Occlusion（环境光遮蔽）

![Alt text](image-13.png)

- 还可以存储 ambient occlusion（自阴影）

### 3D Textures and Volume Rendering

![Alt text](image-14.png)

- 三维纹理也是广泛应用在体积渲染中
- 原本我们的光照模型考虑的只是一个表面。在医学中，核磁共振成像或者 CT 成像扫描人体组织的某一块，返回的信息可以返回一个三维空间中信息，任何一个点上的密度，我们就可以通过这些信息记录下来，然后做渲染，得到一个结果。

## Geometry

### Examples of Geometry

![Alt text](image-15.png)

- 这些杯子的曲线如何表示？
  ![Alt text](image-16.png)
- 汽车的曲面如何表示
- 这些曲面无论多近都看不到三角形，都是光滑的过渡，这是怎么描述的？
  ![Alt text](image-17.png)
- 布料是怎么样的几何？
  ![Alt text](image-19.png)
- 任意一个时刻，水花飞溅的几何是怎么描述的？
  ![Alt text](image-18.png)
- 成千上万的大楼，这些大楼是怎么描述，怎么存储的？
  ![Alt text](image-20.png)
- 毛发是怎么描述的？
  ![Alt text](image-21.png)
- 这种树枝分出来的小树枝是怎么描述的？

### Geometry Representation

![Alt text](image-22.png)

- 在图形学上主要有两类几何，一类是 implicit geometry，一类是 explicit geometry

![Alt text](image-23.png)

- 隐式表示不会直接告诉你几何中的点在哪，而是告诉你这些点满足的关系，比如在一个球面上
- 比如像球面的公式 $x^2 + y^2 + z^2 = 1$，只要满足这个关系，就认为在球面上
- 如果说是把这个球面拆成不同的三角形面，就是显示的表示

![Alt text](image-24.png)

- 要知道哪些点在隐式表达的几何上，是相对困难的
- 要想从公式中看出这是一个圆环也是很难的
  ![Alt text](image-25.png)
- 但是隐式表示对于点在几何体内外的判断是很容易的

![Alt text](image-26.png)

- 除了前面提到的通过三角形描述的显示表示，还有另一种显示表示方法，通过参数映射的方式定义的表面
- 比如这里，uv 上有一个点，定义一个函数，可以把这个点映射到空间中的某一个点
- 这个几何叫做马鞍面，有很多应用

![Alt text](image-27.png)

- 虽然是公式，但是 x、y、z 等于什么都写的很清楚
- 把 uv 空间上的所有点都找一遍，就知道对应的空间中的形状

![Alt text](image-28.png)

- 但是想要判断一个点在不在表面上，就很困难了

![Alt text](image-29.png)

- 最好的几何表示方法是什么？取决于你要做什么

### More Implicit Representations in Computer Graphics

数学公式描述：
![Alt text](image-30.png)

- 对于复杂的几何体很难找到描述的公式

constructive solid geometry（csg）：
![Alt text](image-31.png)

- 通过这样的集合的布尔运算来描述几何体
- 这个方法在很多软件中都有支持，比如 max、maya、autocad 等
- 通过这种方式可以把简单的几何体组合成复杂的几何体

通过距离函数（distance function）描述：
![Alt text](image-32.png)

- 不直接去描述几何的表面，而是描述任何一个点到这个表面的最近距离（signed distance function），这个距离可以是正的（在几何体外边）或者负的（在几何体内部）
- 我们可以把两个不同的物体的距离函数做一个 blend，sdf 很适合做这种工作。

这里给出一个代码的例子：

```glsl
float sdSphere(vec3 position, float radius) {
    return length(position) - radius;
}
```

如果要进行 blend，可以这样：

```glsl
float sdSphere = sdSphere(p, center1, radius1);
float sdBox = sdBox(p, extents);
float blendFactor = ...; // 这个值可以是一个动画参数，例如正弦波
float sdBlend = mix(sdSphere, sdBox, blendFactor);
```

sdf 在渲染的时候通常采用 ray marching 的方式。

可以查看这个链接：[Signed Distance Fields](https://renderdiagrams.org/2017/12/28/signed-distance-fields/)

![Alt text](image-33.png)

- A 跟 B 可以看作是一个运动前后的表面，我们可以通过 SDF 的 blend 来得到中间的状态

![Alt text](image-34.png)
下面是一个 shader toy 的例子，整个场景都是通过 SDF 来描述的。
![Alt text](image-35.png)

通过 level set（水平集）的方式来描述：
![Alt text](image-36.png)

- 根距离场的思想是一样的，只不过这个函数是写在格子上的
- 希望这个函数为 0，为 0.1 或者其他值，都可以得到不同的曲线
- 这个概念在地理上得到了广泛的应用，叫做等高线
- 可以通过双线性插值来得到这个函数在什么地方等于 0

![Alt text](image-37.png)

- 还可以应用在三维上

![Alt text](image-38.png)

- 用水平集或者距离场来描述水滴和水滴的融合，以及融合后的表面。

分型：
![Alt text](image-39.png)

- 分型就是说它的一部分和整体长得非常像，这个和递归是一个道理
- 它最复杂的地方就在于它会引起强烈的走样，因为它的变化频率太高了

最后总结一下隐式表示的优缺点：
![Alt text](image-40.png)
优点：

- 写起来容易，一个公式就可以描述一个形状
- 有利于存储
- 可以很容易地判断一个点在里面还是外面
- 描述的曲线和曲面很容易和光线求交
- 比如说星星在任何地方都有一个正确的弧度，这个就很适合用隐式表示

缺点：

- 有些物体很难用一个规则的函数描述，比如奶牛
