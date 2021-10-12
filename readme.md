# 学习webGL

相关链接：

> https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial
> https://webglfundamentals.org/webgl/lessons/zh_cn/

# 学习记录

## 2021.10.11



### webGL的书写方法[^1]

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



### WebGL应用基本都遵循以下结构[^1]

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

[^1]: webGL 绘制多个物体：https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-drawing-multiple-things.html



## 2021.10.12



### 顶点着色器

1. [Attributes 属性](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#attributes-) (从缓冲中获取的数据)
2. [Uniforms 全局变量](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#uniforms-) (在一次绘制中对所有顶点保持一致值)
3. [Textures 纹理](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html#textures-) (从像素或纹理元素中获取的数据)



### 片断着色器

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



### GLSL[^2]

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

### 相关链接

[^2]: WebGL 着色器和GLSL https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-shaders-and-glsl.html
