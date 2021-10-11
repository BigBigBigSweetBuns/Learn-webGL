window.onload = function () {
    webGL();
}

function resize(canvas) {
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}
// 渲染实际像素
function resizePixels(canvas) {
    const realToCSSPixels = window.devicePixelRatio;

    let displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
    let displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}
function webGL() {
    const canvas = document.querySelector("#glcanvas");
    // 初始化WebGL上下文
    const gl = canvas.getContext("webgl");

    // 确认WebGL支持性
    if (!gl) {
        alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
        return;
    }

    resize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 使用完全不透明的黑色清除所有图像
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // 用上面指定的颜色清除缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);

}