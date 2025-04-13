// asg1.js

// SHADERS
// Vertex Shader
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = u_Size;
    }
`;

// Fragment Shader
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`;

// Global variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let gl_ShapesList = [];
let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectedType = 'point';
let g_segmentCount = 10;
let g_Size = 5;


// Function to initialize the WebGL context
function setupWebGL() {
    canvas = document.getElementById("webgl");
    if (!canvas) {
        console.log("Failed to retrieve the <canvas> element");
        return false;
    }

    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return false;
    }
}

// Function to initialize shaders
function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");
        return;
    }

    // Get storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");
        return;
    }

    // Get storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    if (!u_FragColor) {
        console.log("Failed to get the storage location of u_FragColor");
        return;
    }

    // Get storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, "u_Size");
    if (!u_Size) {
        console.log("Failed to get the storage location of u_Size");
        return;
    }
}

function convertEventCoordinatesToGL(event) {
    var x = event.clientX; // x coordinate of a mouse pointer
    var y = event.clientY; // y coordinate of a mouse pointer
    var rect = event.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}

function renderAllShapes() {

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl_ShapesList.forEach(shape => shape.render());
}

function click(event) {
    let [x, y] = convertEventCoordinatesToGL(event);

    let point;
    if (g_selectedType == 'point') {
        point = new Point();
    } else if (g_selectedType == 'triangle') {
        point = new Triangle();
    } else if (g_selectedType == 'circle') {
        point = new Circle();
        point.segments = g_segmentCount;
    }

    point.position = [x, y, 0.0, 1.0];
    point.color = g_selectedColor.slice();
    point.size = g_Size;

    gl_ShapesList.push(point);

    renderAllShapes();
}

function addActionsForHtmlUI() {
    document.getElementById("clear").onclick = () => {
        gl_ShapesList = [];
        renderAllShapes();
    };

    document.getElementById("squares").onclick = () => {
        g_selectedType = 'point';
    };

    document.getElementById("triangles").onclick = () => {
        g_selectedType = 'triangle';
    };

    document.getElementById("circles").onclick = () => {
        g_selectedType = 'circle';
    };

    document.getElementById("redSlider").addEventListener("mouseup", function () {
        g_selectedColor[0] = this.value / 100;
    });

    document.getElementById("greenSlider").addEventListener("mouseup", function () {
        g_selectedColor[1] = this.value / 100;
    });

    document.getElementById("blueSlider").addEventListener("mouseup", function () {
        g_selectedColor[2] = this.value / 100;
    });

    document.getElementById("alphaSlider").addEventListener("mouseup", function () {
        g_selectedColor[3] = this.value / 100;
    });

    document.getElementById("shapeSize").addEventListener("mouseup", function () {
        g_Size = this.value;
    });

    document.getElementById("segmentCount").addEventListener("mouseup", function () {
        g_segmentCount = this.value;
    });

    document.getElementById("draw").onclick = () => {
        drawPicture();
    };
}

function main() {
    setupWebGL();

    connectVariablesToGLSL();

    addActionsForHtmlUI();

    canvas.onmousedown = click;

    canvas.onmousemove = function (event) {
        if (event.buttons == 1) {
            click(event);
        }
    };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

}