window.onload = function () {
    main();
}

function main() {
    const canvas = document.querySelector("#glcanvas");
    // 初始化WebGL上下文
    const gl = canvas.getContext("webgl");

    // 确认WebGL支持性
    if (!gl) {
        alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
        return;
    }

    translation2d(canvas, gl);
    // translation2dTextF(canvas, gl);
}

function translation2d(canvas, gl) {
    let translation = [0, 0];
    let width = 100;
    let height = 30;
    let color = [Math.random(), Math.random(), Math.random(), 1];


    // Link the two shaders into a program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    // look up where the vertex data needs to go.
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");

    // 正解：将绑定点绑定到缓冲数据（positionBuffer）
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });

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
    function updatePosition(index) {
        return function (event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


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

        setRectangle(gl, translation[0], translation[1], width, height);
        gl.uniform4fv(colorLocation, color);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

function translation2dTextF(canvas, gl) {
    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var translationLocation = gl.getUniformLocation(program, "u_translation");

    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put geometry data into buffer
    setGeometry(gl);

    var translation = [0, 0];
    var color = [Math.random(), Math.random(), Math.random(), 1];

    drawScene();

    // Setup a ui.
    webglLessonsUI.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });

    function updatePosition(index) {
        return function (event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    // Draw the scene.
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionLocation, size, type, normalize, stride, offset);

        // set the resolution
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // set the color
        gl.uniform4fv(colorLocation, color);

        // Set the translation.
        console.log(translation);
        gl.uniform2fv(translationLocation, translation);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 18;  // 6 triangles in the 'F', 3 points per triangle
        gl.drawArrays(primitiveType, offset, count);
    }

    function setGeometry(gl) {
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                // left column
                0, 0,
                30, 0,
                0, 150,
                0, 150,
                30, 0,
                30, 150,

                // top rung
                30, 0,
                100, 0,
                30, 30,
                30, 30,
                100, 0,
                100, 30,

                // middle rung
                30, 60,
                67, 60,
                30, 90,
                30, 90,
                67, 60,
                67, 90,
            ]),
            gl.STATIC_DRAW);
    }
}