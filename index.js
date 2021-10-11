window.onload = function () {
    webGL();
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

    // todo 
    // 推测：初始化buffer,绑定新的空buffer
    // 正解：将绑定点绑定到缓冲数据（positionBuffer）
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Get the strings for our GLSL shaders
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    var fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    // Link the two shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");


    setGeometry(gl);
    drawScene();

    function resize(canvas) {
        let displayWidth = canvas.clientWidth;
        let displayHeight = canvas.clientHeight;
        if (canvas.width != displayWidth || canvas.height != displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    }
    // 渲染实际像素大小画面
    function resizePixels(canvas) {
        const realToCSSPixels = window.devicePixelRatio;

        let displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
        let displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);
        if (canvas.width != displayWidth || canvas.height != displayHeight) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    }

    // 添加三角形
    function setGeometry(gl) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0,
            0, 0.5,
            0.2, 0]),
            gl.STATIC_DRAW);
    }

    function drawScene() {

        resize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // 使用完全不透明的黑色清除所有图像
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // 用上面指定的颜色清除缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);


        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);
        // 将绑定点绑定到缓冲数据（positionBuffer）
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
        let size = 2;          // 每次迭代运行提取两个单位数据
        let type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
        let normalize = false; // 不需要归一化数据
        let stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
        // 每次迭代运行运动多少内存到下一个数据开始点
        let offset = 0;        // 从缓冲起始位置开始读取
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);

        let primitiveType = gl.TRIANGLES;
        offset = 0;
        let count = 3;
        gl.drawArrays(primitiveType, offset, count);
    }
}