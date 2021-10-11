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
