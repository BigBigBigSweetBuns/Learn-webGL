function pluralRectangle(canvas, gl) {
    webGL();

    function randomInt(range) {
        return Math.floor(Math.random() * range);
    }

    function webGL() {
        // 正解：将绑定点绑定到缓冲数据（positionBuffer）
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Link the two shaders into a program
        var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

        // look up where the vertex data needs to go.
        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        // look up uniform locations
        var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        var colorUniformLocation = gl.getUniformLocation(program, "u_color");

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

        // 添加四边形
        function setRectangle(gl, x, y, width, height) {
            let x1 = x;
            let x2 = x + width;
            let y1 = y;
            let y2 = y + height;

            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2,]),
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

            // set the resolution
            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

            for (let i = 0; i < 50; ++i) {
                setRectangle(gl, randomInt(300), randomInt(300), randomInt(300), randomInt(300));
                gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        }
    }
}
