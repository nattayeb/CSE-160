// BlockyAnimal.js

// SHADERS
// Vertex Shader
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotation;
    void main() {
        gl_Position = u_GlobalRotation * u_ModelMatrix * a_Position;
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
let u_ModelMatrix;
let u_GlobalRotation;
let gl_ShapesList = [];
let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectedType = 'point';
let g_segmentCount = 10;
let gAnimalGlobalRotation = 0;
let g_upperAngle = 0;
let g_lowerAngle = 0;
let g_bodyAngle = 0;
let g_animationOn = false;


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

    gl.enable(gl.DEPTH_TEST);
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

    // Get storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    if (!u_ModelMatrix) {
        console.log("Failed to get the storage location of u_ModelMatrix");
        return;
    }

    // Get storage location of u_GlobalRotateMatrix
    u_GlobalRotation = gl.getUniformLocation(gl.program, "u_GlobalRotation");
    if (!u_GlobalRotation) {
        console.log("Failed to get the storage location of u_GlobalRotation");
        return;
    }

    // Set an initial model matrix to identity
    var identityMat = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityMat.elements);
}

function convertEventCoordinatesToGL(event) {
    var x = event.clientX; 
    var y = event.clientY; 
    var rect = event.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}

function drawCube(M, color) {
    var cube = new Cube();
    cube.color = color;
    cube.matrix = M;
    cube.render();
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0 - g_startTime;

function tick() {

    g_seconds = performance.now()/1000.0 - g_startTime;

    updateAnimationAngles();

    renderScene();

    requestAnimationFrame(tick);
}

function updateAnimationAngles() {
    if (g_animationOn) {
        g_upperAngle = 20 * Math.sin(g_seconds);
        g_lowerAngle = 20 * Math.sin(g_seconds);
        g_bodyAngle = 5 * Math.sin(g_seconds);
    } 
}

function createLimb(x, y, z, opacity) {
    // Upper Arm
    var upperArmMatrix = new Matrix4();
    upperArmMatrix.translate(-0.10 + x, -0.2, 0.0 + z);
    upperArmMatrix.rotate(-5, 1, 0, 0);
    upperArmMatrix.rotate(g_upperAngle, 0, 0, 1);
    upperArmMatrix.scale(0.15, 0.28, 0.15);
    drawCube(upperArmMatrix, [0.6, 0.3, 0.0, opacity]); 

    // Lower Arm
    var lowerArmMatrix = new Matrix4();
    lowerArmMatrix.setTranslate(-0.05 + x, -0.45, 0.0 + z);
    lowerArmMatrix.rotate(5, 1, 0, 0);
    lowerArmMatrix.rotate(-g_lowerAngle, 0, 0, 1);
    var lowerArmBaseMatrix = new Matrix4(lowerArmMatrix); 
    lowerArmMatrix.scale(0.13, 0.28, 0.13);
    lowerArmMatrix.translate(-0.5, 0.0, 0.0);
    drawCube(lowerArmMatrix, [0.6, 0.3, 0.0, opacity]); 

    // Paw
    var pawMatrix = new Matrix4(lowerArmBaseMatrix);
    pawMatrix.translate(0.0, -0.12, 0.0);
    pawMatrix.rotate(g_upperAngle, 0, 0, 1);
    pawMatrix.scale(0.1, 0.1, 0.1);
    pawMatrix.translate(-0.5, 0.0, -0.001);
    drawCube(pawMatrix, [0.2, 0.2, 0.0, opacity]); 
}



function renderScene() {

    var startTime = performance.now();

    var globalRotateMatrix = new Matrix4().rotate(gAnimalGlobalRotation, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotation, false, globalRotateMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // BODY
    var bodyMatrix = new Matrix4();
    bodyMatrix.translate(-0.62, 0.1, -0.05);
    bodyMatrix.rotate(-5, 1, 0, 0);
    bodyMatrix.rotate(g_bodyAngle, 0, 0, 1);
    bodyMatrix.scale(1.1, 0.4, 0.4);
    drawCube(bodyMatrix, [0.7, 0.3, 0.0, 1.0]); 

    // TAIL
    var tailMatrix = new Matrix4(bodyMatrix);
    tailMatrix.translate(0, 0.9, 0.5);
    tailMatrix.rotate(45, 0, 0, 1);
    tailMatrix.scale(0.10, 0.30, 0.15);
    drawCube(tailMatrix, [0.6, 0.3, 0.0, 1.0]); 

    // TAIL TIP
    var tailTipMatrix = new Matrix4(tailMatrix);
    tailTipMatrix.translate(0, 0.8, 0.0);
    tailTipMatrix.rotate(-20, 0, 0, 1);
    drawCube(tailTipMatrix, [0.6, 0.3, 0.2, 0.8]); 

    // NECK
    var neckMatrix = new Matrix4(bodyMatrix);
    neckMatrix.translate(1.0, 0.6, 0.5);
    neckMatrix.rotate(70, 0, 0, 1);
    neckMatrix.scale(0.60, 0.20, 0.15);
    drawCube(neckMatrix, [0.8, 0.8, 0.8, 1.0]); 

    // HEAD
    var headMatrix = new Matrix4(bodyMatrix);
    headMatrix.translate(1.0, 1.2, 0.3);
    headMatrix.scale(0.4, 0.5, 0.5);
    drawCube(headMatrix, [0.9, 0.7, 0.6, 1.0]); 

    // LIMBS
    createLimb(0.4, 0.0, 0.0, 1); 
    createLimb(0.3, 0.0, 0.2, 0.5); 
    createLimb(-0.3, 0.0, 0.0, 1); 
    createLimb(-0.4, 0.0, 0.2, 0.5);

    var endTime = performance.now();
    var duration = endTime - startTime;
    sendTextToHtml("ms:" + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "performance");
        
}

function sendTextToHtml(text, htmlID) {
    document.getElementById(htmlID).innerHTML = text;
}

function click(event) {
    let [x, y] = convertEventCoordinatesToGL(event);

    // Rotate the animal

    gAnimalGlobalRotation = Math.atan2(y, x) * 180 / Math.PI;
    gAnimalGlobalRotation = (gAnimalGlobalRotation + 360) % 360;

    renderScene();
}

function addActionsForHtmlUI() {   

    document.getElementById("animationOnButton").onclick = () => {
        g_animationOn = true;
    };

    document.getElementById("animationOffButton").onclick = () => {
        g_animationOn = false;
    };

    document.getElementById("upperLimbsSlider").addEventListener("mousemove", () => {
        g_upperAngle = document.getElementById("upperLimbsSlider").value;
        renderScene();
    });
    
    document.getElementById("lowerLimbsSlider").addEventListener("mousemove", function () {
        g_lowerAngle = this.value;
        renderScene();
    });

    document.getElementById("angleSlider").addEventListener("mousemove", function () {
        gAnimalGlobalRotation = this.value;
        renderScene();
    });
}

function main() {
    setupWebGL();

    connectVariablesToGLSL();

    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse move
    canvas.onmousemove = function (event) {
        if (event.buttons == 1) {
            click(event);
        }
    };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    requestAnimationFrame(tick);
}