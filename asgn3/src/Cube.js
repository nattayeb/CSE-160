// Cube.js

class Cube {
    constructor(opacity = 1.0) {
        this.type = "cube";
        this.color = [0.0, 1.0, 1.0, opacity];
        this.matrix = new Matrix4();
        this.textureNum = 0;
    }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_UseTexture, this.textureNum);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front face (z = 0)
        drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0], [0.0, 0.0, 1.0, 0.0, 1.0, 1.0]);
        drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0], [0.0, 0.0, 1.0, 1.0, 0.0, 1.0]);

        // Top face (y = 1)
        drawTriangle3DUV([0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0], [0.0, 0.0, 1.0, 0.0, 1.0, 1.0]);
        drawTriangle3DUV([0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0], [0.0, 0.0, 1.0, 1.0, 0.0, 1.0]);

        // Back face (z = 1)
        drawTriangle3DUV([0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0], [0.0, 0.0, 1.0, 0.0, 1.0, 1.0]);
        drawTriangle3DUV([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0], [0.0, 0.0, 1.0, 1.0, 0.0, 1.0]);

        // Left face (x = 0)
        drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0], [0.0, 0.0, 1.0, 0.0, 1.0, 1.0]);
        drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0, 0.0, 1.0]);

        // Right face (x = 1)
        drawTriangle3DUV([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0], [0.0, 0.0, 1.0, 0.0, 1.0, 1.0]);
        drawTriangle3DUV([1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0, 0.0, 1.0]);

        // Bottom face (y = 0)
        drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0], [0.0, 0.0, 1.0, 0.0, 1.0, 1.0]);
        drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0], [0.0, 0.0, 1.0, 1.0, 0.0, 1.0]);
    }
}