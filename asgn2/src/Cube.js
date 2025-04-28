// Cube.js

class Cube {
    constructor(opacity=1.0) {
        this.type = "cube";
        this.color = [1.0, 1.0, 1.0, opacity];
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;
        
        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the matrix to u_ModelMatrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);

        // Simulate lighting
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);


        drawTriangle3D([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
        drawTriangle3D([0.0,1.0,0.0, 1.0,1.0,1.0, 1.0,1.0,0.0]);

        drawTriangle3D([0.0,0.0,1.0, 1.0,0.0,1.0, 1.0,1.0,1.0]);
        drawTriangle3D([0.0,0.0,1.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);

        drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,1.0]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,1.0, 0.0,0.0,1.0]);

        drawTriangle3D([1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0]);
        drawTriangle3D([1.0,0.0,0.0, 1.0,1.0,1.0, 1.0,0.0,1.0]);
        drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0]);
        drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,1.0, 0.0,1.0,1.0]);
    }
}