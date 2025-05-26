// Triangle.js

class Triangle {
    constructor() {
        this.type = "triangle";
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.vertexBuffer = null;
        this.uvBuffer = null;
        this.normalsBuffer = null;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, size);

        var d = this.size / 200.0;
       
        drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
        
    }
}

class InvertedTriangle extends Triangle {
    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, size);

        var d = this.size / 200.0;
        // Reversed triangle
        drawTriangle([xy[0]+d, xy[1], xy[0]+d, xy[1]+d, xy[0], xy[1]+d]);
    }
}


function drawTriangle(vertices) {
    var n = 3;

    // Improve performance by avoiding unnecessary buffer creation
    if (this.vertexBuffer == null) {
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log("Failed to create the buffer object");
            return false;
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function drawTriangle3D(vertices) {
    var n = 3;

    // Improve performance by avoiding unnecessary buffer creation
    if (this.vertexBuffer == null) {
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log("Failed to create the buffer object");
            return false;
        }
    }
    

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function drawTriangle3DUV(vertices, uv) {
    var n = 3;

    // Improve performance by avoiding unnecessary buffer creation
    if (this.vertexBuffer == null) {
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log("Failed to create the buffer object");
            return false;
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);


    if (this.uvBuffer == null) {
        this.uvBuffer = gl.createBuffer();
        if (!this.uvBuffer) {
            console.log("Failed to create the buffer object");
            return false;
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}

function drawTriangle3DUVNormal(vertices, uv, normals) {
    var n = 3;

    // Improve performance by avoiding unnecessary buffer creation
    if (this.vertexBuffer == null) {
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log("Failed to create the buffer object");
            return false;
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);


    if (this.uvBuffer == null) {
        this.uvBuffer = gl.createBuffer();
        if (!this.uvBuffer) {
            console.log("Failed to create the buffer object");
            return false;
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    if (this.normalsBuffer == null) {
        this.normalsBuffer = gl.createBuffer();
        if (!this.normalsBuffer) {
            console.log("Failed to create the buffer object");
            return false;
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    gl.drawArrays(gl.TRIANGLES, 0, n);

}


