// World.jss

// SHADERS
// Vertex Shader
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotation;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotation * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }
`;

// Fragment Shader
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform vec4 u_FragColor;
    uniform int u_UseTexture;
    void main() {
        if (u_UseTexture == -3) {
            gl_FragColor = texture2D(u_Sampler1, v_UV);
        } else if (u_UseTexture == -2) {
            gl_FragColor = u_FragColor;
        } else if (u_UseTexture == -1) {
            gl_FragColor = vec4(v_UV, 0.0, 1.0);
        } else if (u_UseTexture == 0) {
            gl_FragColor = texture2D(u_Sampler0, v_UV);
        } else {
            gl_FragColor = vec4(1,.2,.2,1);
        }          
    }
`;

// Global variables
let canvas;
let g_camera;
let gl;
let a_Position;
let u_ViewMatrix;
let u_ProjectionMatrix;
let a_UV;
let u_Sampler0;
let u_Sampler1;
let u_UseTexture;
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

    g_camera = new Camera(canvas);


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

    // Get storage location of u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    if (!u_ViewMatrix) {
        console.log("Failed to get the storage location of u_ViewMatrix");
        return;
    }
    // Get storage location of u_ProjectionMatrix
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
    if (!u_ProjectionMatrix) {
        console.log("Failed to get the storage location of u_ProjectionMatrix");
        return;
    }

    // Get storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, "a_UV");
    if (a_UV < 0) {
        console.log("Failed to get the storage location of a_UV");
        return;
    }

    // Get the storage location of u_Sampler0
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }

    // Get the storage location of u_Sampler1
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }

    // Get storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    if (!u_FragColor) {
        console.log("Failed to get the storage location of u_FragColor");
        return;
    }

    // Get storage location of u_UseTexture
    u_UseTexture = gl.getUniformLocation(gl.program, "u_UseTexture");
    if (!u_UseTexture) {
        console.log("Failed to get the storage location of u_UseTexture");
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

function initTextures(index) {
    var image = new Image();  // Create the image object
    if (!image) {
        console.log('Failed to create the image object');
        return false;
    }
    // Register the event handler to be called on loading an image
    image.onload = function () { sendImageToTEXTURE(image, index); };
    // Tell the browser to load an image

    if (index === 0) {
        image.src = 'stone_veneer.jpg';
    } else if (index === 1) {
        image.src = 'floor.jpg';
    }

    return true;
}



function sendImageToTEXTURE(image, index = 0) {
    let texture0 = null;
    let texture1 = null;

    // Load stone veneer texture
    if (index === 0) {
        texture0 = gl.createTexture();
        if (!texture0) {            
            console.log('Failed to create the texture0 object');
            return false;
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
        // Enable texture unit0
        gl.activeTexture(gl.TEXTURE0);
        // Bind the texture object to the target
        gl.bindTexture(gl.TEXTURE_2D, texture0);

        // Set the texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // Set the texture image
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        // Set the texture unit 0 to the sampler
        gl.uniform1i(u_Sampler0, 0);
    
    // Load floor ground texture
    } else {
        texture1 = gl.createTexture();

        if (!texture1) {
            console.log('Failed to create the texture1 object');
            return false;
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
        // Enable texture unit0
        gl.activeTexture(gl.TEXTURE1);
        // Bind the texture object to the target
        gl.bindTexture(gl.TEXTURE_2D, texture1);

        // Set the texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // Set the texture image
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        // Set the texture unit 0 to the sampler
        gl.uniform1i(u_Sampler1, 1);
    }
}

function convertEventCoordinatesToGL(event) {
    var x = event.clientX;
    var y = event.clientY;
    var rect = event.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

    return ([x, y]);
}

function drawCube(M, color, textureNum = 0) {
    var cube = new Cube();
    // M.scale(0.5, 0.5, 0.5);
    cube.color = color;
    cube.matrix = M;
    cube.textureNum = textureNum;
    cube.render();
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick() {

    g_seconds = performance.now() / 1000.0 - g_startTime;

    renderScene();

    requestAnimationFrame(tick);
}


const WORLD_SIZE = 32;
var g_map = [
    [4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 0, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 4],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [4, 0, 1, 0, 0, 0, 2, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 1, 0, 0, 4, 0, 0, 2, 0, 1, 0, 4],
    [3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [4, 0, 0, 0, 3, 0, 3, 0, 0, 4, 0, 0, 1, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0, 4],
    [3, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 0, 2, 0, 0, 0, 1, 0, 1, 0, 0, 3, 2, 1, 3, 0, 0, 2, 0, 0, 1, 0, 0, 4, 0, 0, 3, 0, 0, 2, 0, 4],
    [3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [4, 2, 0, 0, 0, 0, 3, 1, 1, 1, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 1, 0, 0, 4, 0, 0, 3, 0, 0, 2, 4],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
    [4, 3, 2, 1, 1, 2, 3, 3, 1, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 2, 0, 0, 3, 0, 0, 1, 0, 3, 4],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 1, 2, 3, 1, 3, 2, 1, 1, 0, 0, 3, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 3, 2, 1, 2, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 4],
    [4, 0, 1, 0, 0, 0, 2, 1, 1, 3, 0, 0, 3, 0, 0, 2, 0, 0, 3, 4, 0, 1, 0, 0, 3, 0, 0, 2, 0, 1, 0, 3],
    [3, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 3, 2, 2, 2, 2, 3, 0, 0, 3, 0, 0, 1, 0, 0, 3, 0, 0, 4, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 3],
    [4, 2, 3, 0, 1, 2, 2, 0, 1, 3, 0, 3, 0, 0, 4, 0, 0, 2, 0, 0, 1, 0, 0, 4, 0, 0, 3, 2, 1, 2, 0, 4],
    [3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3],
    [4, 2, 1, 0, 0, 0, 3, 0, 0, 1, 0, 0, 3, 0, 0, 2, 0, 0, 3, 0, 0, 1, 0, 0, 4, 0, 0, 3, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 0, 0, 3, 3, 0, 1, 0, 0, 2, 0, 0, 3, 3, 2, 1, 0, 0, 4, 0, 0, 2, 0, 0, 3, 0, 0, 1, 0, 0, 3],
    [3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 3, 0, 0, 2, 0, 0, 1, 0, 0, 4, 0, 0, 3, 1, 2, 2, 3, 3],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3],
    [3, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
    [3, 4, 3, 4, 3, 0, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 3, 4, 4],
];



function drawMap() {
    for (let x = 0; x < WORLD_SIZE; x++) {
        for (let y = 0; y < WORLD_SIZE; y++) {
            let height = g_map[x][y];
            if (height >= 1) {
                for (let z = 0; z < height; z++) {
                    let shade = 0.1 + 0.2 * height;
                    drawCube(
                        new Matrix4().translate(x - (WORLD_SIZE / 2), -0.75 + z, y - (WORLD_SIZE / 2)),
                        [shade, shade, shade], 0
                    );
                }
            }
        }
    }
}


function renderScene() {

    var startTime = performance.now();

    // var projMat = new Matrix4();
    // projMat.setPerspective(60, 1 * canvas.width / canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);

    // var viewMat = new Matrix4();
    // viewMat.setLookAt(
    //     g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
    //     g_camera.lookAt.elements[0], g_camera.lookAt.elements[1], g_camera.lookAt.elements[2],
    //     g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
    // ); // Eye point, Look at point, Up direction
    gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);

    var globalRotateMatrix = new Matrix4().rotate(gAnimalGlobalRotation, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotation, false, globalRotateMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Floor
    var floor = new Cube();
    floor.textureNum = -3;
    floor.color = [0.0, 1.0, 0.0, 1.0];
    floor.matrix.translate(0, -.75, 0.0);
    floor.matrix.scale(50, 0, 50);
    floor.matrix.translate(-.5, 0, -.5);
    floor.render();

    // Sky
    var sky = new Cube();
    sky.textureNum = -2;
    sky.color = [0.0, 0.0, 1.0, 1.0];
    sky.matrix.scale(50, 50, 50);
    sky.matrix.translate(-.5, -.5, -.5);
    sky.render();

    drawMap();

    // drawCube(new Matrix4().setTranslate(0, 0, 0).scale(1.5, 1.5, 1.5), g_selectedColor);
    // drawCube(new Matrix4().setTranslate(.5, -.5, .5).rotate(45, 0, 1, 0).scale(.5, .5, .5), g_selectedColor, 1);

    var endTime = performance.now();
    var duration = endTime - startTime;
    sendTextToHtml("ms:" + Math.floor(duration) + " fps: " + Math.floor(10000 / duration) / 10, "performance");

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
    document.onkeydown = keydown;

    // document.getElementById("angleSlider").addEventListener("mousemove", function () {
    //     gAnimalGlobalRotation = this.value;
    //     renderScene();
    // });
}

function keydown(ev) {
    switch (ev.key) {
        case "w":
            g_camera.moveForward();
            break;
        case "a":
            g_camera.moveLeft();
            break;
        case "s":
            g_camera.moveBackwards();
            break;
        case "d":
            g_camera.moveRight();
            break;
        case "q":
            g_camera.panLeft();
            break;
        case "e":
            g_camera.panRight();
            break;
    }
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

    initTextures(0);
    initTextures(1);

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    requestAnimationFrame(tick);
}