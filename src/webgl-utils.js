function compileShader(gl, shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
        throw "could not compile shader:" + gl.getShaderInfoLog(shader);
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    // 创建一个程序
    var program = gl.createProgram();
    // 附上着色器
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // 链接到程序
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        throw "program failed to link:" + gl.getProgramInfoLog(program);
    }
    return program;
}