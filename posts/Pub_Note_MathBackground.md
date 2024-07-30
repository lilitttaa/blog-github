---
title: Games105 2.Math Background
---

- [Lecture Notes](https://games-105.github.io/ppt/02%20-%20Math%20Background.pdf)

## Vector

![alt text](image.png)

- vector : $\vec{a} = \begin{bmatrix} a_x & a_y & a_z \end{bmatrix}^T = \begin{bmatrix} a_x \\ a_y \\ a_z \end{bmatrix}$
- magnitude/length/norm : $||\vec{a}|| = \sqrt{a_x^2 + a_y^2 + a_z^2}$
- unit vector : $\hat{a} = \frac{\vec{a}}{||\vec{a}||}$

### Addition and Subtraction

$\vec{a} = \begin{bmatrix} a_x & a_y & a_z \end{bmatrix}^T$
$\vec{b} = \begin{bmatrix} b_x & b_y & b_z \end{bmatrix}^T$
$\vec{a} + \vec{b} = \begin{bmatrix} a_x + b_x & a_y + b_y & a_z + b_z \end{bmatrix}^T$
$\vec{a} - \vec{b} = \begin{bmatrix} a_x - b_x & a_y - b_y & a_z - b_z \end{bmatrix}^T$
$\vec{a} + 2\vec{b} = \begin{bmatrix} a_x + 2b_x & a_y + 2b_y & a_z + 2b_z \end{bmatrix}^T$

![alt text](image-1.png)

### Dot Product

$\vec{a} \cdot \vec{b} = \vec{b} \cdot \vec{a}$
$\vec{a} \cdot (\vec{b} + \vec{c}) = \vec{a} \cdot \vec{b} + \vec{a} \cdot \vec{c}$
$\vec{a} \cdot \vec{a}  = a_x^2 + a_y^2 + a_z^2 = ||\vec{a}||^2$
$\vec{a} \cdot \vec{b} = ||\vec{a}|| \cdot ||\vec{b}|| \cdot \cos\theta$
$\theta = \arccos\frac{\vec{a} \cdot \vec{b}}{||\vec{a}|| \cdot ||\vec{b}||}$
![alt text](image-2.png)

### Projection

$\ a_b = ||\vec{a}|| \cdot \cos\theta = \vec{a} \frac{\vec{b}}{||\vec{b}||}$
![alt text](image-3.png)

### Cross Product

$\vec{a} \times \vec{b} = -\vec{b} \times \vec{a}$
$\vec{a} \times (\vec{b} + \vec{c}) = \vec{a} \times \vec{b} + \vec{a} \times \vec{c}$
$\vec{a} \times (\vec{b} \times \vec{c}) \neq (\vec{a} \times \vec{b}) \times \vec{c}$
$c = a \times b =  \begin{bmatrix} a_yb_z - a_zb_y \\ a_zb_x - a_xb_z \\ a_xb_y - a_yb_x \end{bmatrix}$
$c = a \times b = ||a|| \cdot ||b|| \cdot \sin\theta \cdot \hat{n}$
$\vec{n} \neq \frac{\vec{a}}{||\vec{a}||} \times \frac{\vec{b}}{||\vec{b}||}$
$\vec{n} = \frac{\vec{a} \times \vec{b}}{||\vec{a} \times \vec{b}||} \vec{a} \neq \vec{0}, \vec{b} \neq \vec{0}, \vec{a} \nparallel \vec{b}$
![alt text](image-4.png)

### How to find the rotation between vectors?

平分面上的任意向量都可以是轴：
![alt text](image-5.png)
The minium rotation:
$\vec{u} = \frac{\vec{a} \times \vec{b}}{||\vec{a} \times \vec{b}||}$  
$\theta = \arccos\frac{\vec{a} \cdot \vec{b}}{||\vec{a}|| \cdot ||\vec{b}||}$

### How to rotate a vector?

![alt text](image-6.png)
Rodrigues' rotation formula:
$\vec{b} = \vec{a} + \sin\theta(\vec{a} \times \vec{u}) + (1 - \cos\theta)\vec{u} \times(\vec{u} \times \vec{a}) $

### Orthogonal Basis and Orthogonal Coordinates

![alt text](image-7.png)
$\vec{a} = \begin{bmatrix} a_x & a_y & a_z \end{bmatrix}^T \in \mathbb{R}^3$
$\vec{a} = a_xe_x + a_ye_y + a_ze_z$
$a\cdot b = (a_xe_x + a_ye_y + a_ze_z) \cdot (b_xe_x + b_ye_y + b_ze_z) = a_xb_xe_x \cdot e_x + a_yb_ye_y \cdot e_y + a_zb_ze_z \cdot e_z + \sum_{i \neq j}a_ib_je_i \cdot e_j$
