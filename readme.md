# 学习webGL

##### 学习的主要两个教程：

- https://webglfundamentals.org/
- http://learnwebgl.brown37.net/

在学习的过程中，可能经常在两个教程中跳跃。

每日总结中会有章节链接至对应的教程页面。

##### 相关链接：

> https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial
> https://webglfundamentals.org/webgl/lessons/zh_cn/



# 学习记录



## 2021.10.11



### webGL的书写方法[^1.1]

webGL的书写方法使用的下面的形式，而不是第二种形式

```
var centerX;
var centerY;
var radius;
var color;
 
function setCenter(x, y) {
   centerX = x;
   centerY = y;
}
 
function setRadius(r) {
   radius = r;
}
 
function setColor(c) {
   color = c;
}
 
function drawCircle() {
   ...
}
```

第二种形式

```
function drawCircle(centerX, centerY, radius, color) { ... }
```



### WebGL应用基本都遵循以下结构[^1.1]

初始化阶段

- 创建所有着色器和程序并寻找参数位置
- 创建缓冲并上传顶点数据
- 创建纹理并上传纹理数据

渲染阶段

- 清空并设置视图和其他全局状态（开启深度检测，剔除等等）
- 对于想要绘制的每个物体
  - 调用 `gl.useProgram` 使用需要的程序
  - 设置物体的属性变量
    - 为每个属性调用 `gl.bindBuffer`, `gl.vertexAttribPointer`, `gl.enableVertexAttribArray`
  - 设置物体的全局变量
    - 为每个全局变量调用 `gl.uniformXXX`
    - 调用 `gl.activeTexture` 和 `gl.bindTexture` 设置纹理到纹理单元
  - 调用 `gl.drawArrays` 或 `gl.drawElements`

基本上就是这些，详细情况取决于你的实际目的和代码组织情况。基本上就是这些，详细情况取决于你的实际目的和代码组织情况。



### 相关链接

[^1.1]: webGL 绘制多个物体：https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-drawing-multiple-things.html



## 2021.10.12



### 顶点着色器[^2.1]

1. [Attributes 属性](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#attributes-) (从缓冲中获取的数据)
2. [Uniforms 全局变量](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#uniforms-) (在一次绘制中对所有顶点保持一致值)
3. [Textures 纹理](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#textures-) (从像素或纹理元素中获取的数据)



### 片断着色器[^2.1]

一个片断着色器的工作是为当前光栅化的像素提供颜色值，通常是以下的形式

```
precision mediump float;

void main() {
   gl_FragColor = doMathToMakeAColor;
}
```

每个像素都将调用一次片断着色器，每次调用需要从你设置的特殊全局变量`gl_FragColor`中获取颜色信息。

片断着色器所需的数据，可以通过以下三种方式获取

1. [Uniforms 全局变量](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#uniforms-) (values that stay the same for every pixel of a single draw call)
2. [Textures 纹理](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#textures-) (data from pixels/texels)
3. [Varyings 可变量](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#varyings-) (data passed from the vertex shader and interpolated)



### GLSL[^2.2]

GLSL全称是 Graphics Library Shader Language （图形库着色器语言），是**着色器使用的语言**。

它内建的数据类型例如`vec2`, `vec3`和 `vec4`分别代表两个值，三个值和四个值， 类似的还有`mat2`, `mat3` 和 `mat4` 分别代表 2x2, 3x3 和 4x4 矩阵。

#### 创建/使用

利用JavaScript中创建字符串的方式创建GLSL字符串：用串联的方式（concatenating）， 用AJAX下载，用多行模板数据。或者在这个例子里，将它们放在非JavaScript类型的标签中。

```javascript
<script id="vertex-shader-2d" type="notjs">
 
  // 一个属性变量，将会从缓冲中获取数据
  attribute vec4 a_position;
 
  // 所有着色器都有一个main方法
  void main() {
 
    // gl_Position 是一个顶点着色器主要设置的变量
    gl_Position = a_position;
  }
 
</script>
```



### 二维平移[^2.3]

平移就是普通意义的“移动”物体。

定义一些变量存储矩形的平移，宽，高和颜色。然后定义一个方法重绘所有东西，我们可以在更新变换之后调用这个方法。

如果我们想绘制一个含有成百上千个线条的几何图形， 将会有很复杂的代码。最重要的是，每次绘制JavaScript都要更新所有点。

这里有个简单的方式，上传几何体然后在着色器中进行平移。

```javascript
<script id="vertex-shader-2d" type="x-shader/x-vertex">
attribute vec2 a_position;
 
uniform vec2 u_resolution;
uniform vec2 u_translation;
 
void main() {
   // 加上平移量
   vec2 position = a_position + u_translation;
 
   // 从像素坐标转换到 0.0 到 1.0
   vec2 zeroToOne = position / u_resolution;
</script>
```

然后我们只需要在绘制前更新u_translation为期望的平移量。

```javascript
var translationLocation = gl.getUniformLocation(program, "u_translation");
   // 设置平移
gl.uniform2fv(translationLocation, translation);
```



### 二维旋转[^2.4]

#### 通过计算 x y 旋转

```javascript
<script id="vertex-shader-2d" type="x-shader/x-vertex">
attribute vec2 a_position;
 
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
 
void main() {
  // 旋转位置
  vec2 rotatedPosition = vec2(
     a_position.x * u_rotation.y + a_position.y * u_rotation.x,
     a_position.y * u_rotation.y - a_position.x * u_rotation.x);
 </script>
```

绘制前更新u_translation为期望的平移量。

```javascript
var rotationLocation = gl.getUniformLocation(program, "u_rotation");
var rotation = [0, 1];

// 设置旋转
gl.uniform2fv(rotationLocation, rotation);
```

#### 调整角度

单位圆上的点还有一个名字，叫做正弦和余弦。所以对于任意给定角， 我们只需要求出正弦和余弦

就可以对几何体旋转任意角度，使用时只需要设置旋转的角度。

```javascript
function printSineAndCosineForAnAngle(angleInDegrees) {
  var angleInRadians = angleInDegrees * Math.PI / 180;
  var s = Math.sin(angleInRadians);
  var c = Math.cos(angleInRadians);
  return [s,c];
}
```



### 难点/疑问

需要深入了解 **GLSL**



### 相关链接

[^2.1]: WebGL 基础概念 https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-fundamentals.html
[^2.2]: WebGL 着色器和GLSL https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html

[^2.3]:  二维平移 https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-2d-translation.html
[^2.4]: 二维旋转 https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-2d-rotation.html



## 2021.10.13

今天开始，不再所有的案例都模仿，并代码实现。（需要的时间太多，重点的才实操）



看完 http://learnwebgl.brown37.net/ 前两章。前两章主要讲的是使用webGL的前置知识。



### 二维缩放[^3.1]

缩放和[平移](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-2d-translation.html)一样简单，需要在JavaScript中绘制的地方设置缩放量。

```javascript
<script id="vertex-shader-2d" type="x-shader/x-vertex">
uniform vec2 u_scale;
 
void main() {
  // 缩放
  vec2 scaledPosition = a_position * u_scale;
</script>
```



```javascript
var scaleLocation = gl.getUniformLocation(program, "u_scale");
var scale = [1, 1];
// 设置缩放
gl.uniform2fv(scaleLocation, scale);
```



### 二维矩阵[^3.2]

该章大致阅读了一遍... :joy:



### 三维正射投影[^3.3]

该章大致阅读了一遍...... :joy:



### 三维透视投影[^3.4]

该章大致阅读了一遍......... :joy:



### 图形处理流程[^3.5]

将对象的矢量图形表示转换为光栅图像的过程由以下步骤执行：

| 流水线步骤：                                                 | 描述：                                                       | 执行者：                            |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :---------------------------------- |
| ![step1_image](http://learnwebgl.brown37.net/_images/pipeline_input.jpg) | 将数据输入管道，包括定义位置的模型顶点 (x,y,z)、定义方向的法线向量 (dx,dy,dz) 和颜色数据。 | CPU：JavaScript 代码                |
| ![step2_image](http://learnwebgl.brown37.net/_images/pipeline_model_transform.jpg) | 将模型平移、缩放和旋转到 3D 场景中所需的位置和方向。然后将所有东西移到镜头前。 | CPU：JavaScript 代码GPU：顶点着色器 |
| ![step3_image](http://learnwebgl.brown37.net/_images/pipeline_projection_transform.jpg) | 将 3D 世界投影到 2D 观看屏幕上。                             | CPU：JavaScript 代码GPU：顶点着色器 |
| ![step4_image](http://learnwebgl.brown37.net/_images/pipeline_normalize.jpg) | 剪掉不在相机视野中的所有东西。                               | CPU：JavaScript 代码GPU：顶点着色器 |
| ![step5_image](http://learnwebgl.brown37.net/_images/pipeline_viewport_transform.jpg) | 将 3D 对象坐标映射到光栅图像的像素坐标。                     | GPU：固定功能                       |
| ![step6_image](http://learnwebgl.brown37.net/_images/pipeline_rasterize.jpg) | 确定每个对象（点、线或三角形）覆盖哪些像素，并丢弃被其他对象隐藏的对象。 | GPU：固定功能                       |
| ![step7_image](http://learnwebgl.brown37.net/_images/pipeline_shading.jpg) | 确定代表对象的每个像素的颜色。                               | CPU：JavaScript 代码GPU：片段着色器 |
| ![step8_image](http://learnwebgl.brown37.net/_images/pipeline_composting.jpg) | 将像素的颜色添加到光栅图像，可能会将颜色与图像中已有的颜色组合。 | GPU：固定功能                       |
| ![step9_image](http://learnwebgl.brown37.net/_images/pipeline_output.jpg) | 输出一个光栅图像，图像的每个像素一个颜色值。                 | GPU：固定功能                       |



## Learn_webgl 对象[^3.6]

对于 WebGL 程序，我们需要从服务器下载几种类型的数据文件：

- 我们的 3D 场景对象的模型数据
- 定义模型表面属性的材料描述，包括纹理贴图，以及
- 用于渲染的 WebGL 着色器程序。

这些文件的数量取决于场景的复杂性和渲染的复杂性。我们将使用一个被调用的 JavaScript 对象 `Learn_webgl`来下载所有这些文件。当您创建一个 `Learn_webgl`对 象时，您会向它传递一个着色器文件名列表和一个模型文件名列表。构造函数通过将每个列表中的文件数相加来确定需要下载的文件数：

```javascript
downloads_needed = shader_list.length + model_list.length;
number_retrieved = 0;
```

然后它继续调用`$.get()` (jQuery操作) 每个所需的文件。每次成功下载后，它将数据保存在一个对象中，递增 `number_retrieved`1，并调用一个名为 的函数 `_initializeRendering()`。此函数仅在检索到所有必需文件后才启动其画布的 WebGL 渲染。该函数如下所示：

```javascript
function  _initializeRendering ()  { 

  if  ( number_retrieved  >=  downloads_needed )  { 
    // 预处理模型数据
    // 开始渲染画布
  } 
}
```



### 难点/疑问

需要深入入入入入入了解 **矩阵乘法**，**线性代数**

- 线性代数 https://www.bilibili.com/video/BV1ys411472E?p=2



### 相关链接

[^3.1]: 二维缩放 https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-2d-scale.html
[^3.2]: 二维矩阵 https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-orthographic.html

[^3.3]:  三维正射投影 https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-orthographic.html
[^3.4]: 三维透视投影 https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-3d-perspective.html
[^3.5]: Computer Graphics - What and How http://learnwebgl.brown37.net/the_big_picture/3d_rendering.html
[^3.6]:  Asynchronous File Loading http://learnwebgl.brown37.net/browser_environment/asynchronous_loading.html

