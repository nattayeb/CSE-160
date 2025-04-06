// asg0.js

// Global variables
var canvas;
var ctx;
var x1, y1, x2, y2;

function main() {
    // Retrieve the <canvas> element
    canvas = document.getElementById("example");
    if (!canvas) {
        console.log("Failed to retrieve the <canvas> element");
        return false;
    }

    // Get the rendering context for 2DCG
    ctx = canvas.getContext("2d");

    // Draw a black rectangle
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color

    var v1 = new Vector3([2.5, 2.5, 0]);

    drawVector(v1, 'red');
}

function drawVector(v, color) {
    // Draw a vector 
    let middleX = canvas.width / 2;
    let middleY = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(middleX, middleY);
    ctx.lineTo(middleX + v.elements[0]*20, middleY - v.elements[1]*20);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

function handleDrawEvent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    x1 = document.getElementById("x1").value;
    y1 = document.getElementById("y1").value;
    x2 = document.getElementById("x2").value;
    y2 = document.getElementById("y2").value;

    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);

    drawVector(v1, 'red');
    drawVector(v2, 'blue');
}

function handleDrawOperationEvent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    x1 = document.getElementById("x1").value;
    y1 = document.getElementById("y1").value;
    x2 = document.getElementById("x2").value;
    y2 = document.getElementById("y2").value;

    let v1 = new Vector3([x1, y1, 0]);
    let v2 = new Vector3([x2, y2, 0]);

    drawVector(v1, 'red');
    drawVector(v2, 'blue');

    let operation = document.getElementById("operation").value;
    let scalar = document.getElementById("scalar").value;

    if (operation === "add") {
        let v3 = v1.add(v2);
        drawVector(v3, 'green');
    } else if (operation === "sub") {
        let v3 = v1.sub(v2);
        drawVector(v3, 'green');
    } else if (operation === "mul") {
        let v3 = v1.mul(scalar);
        let v4 = v2.mul(scalar);
        drawVector(v3, 'green');
        drawVector(v4, 'green');
    } else if (operation === "div") {
        let v3 = v1.div(scalar);
        let v4 = v2.div(scalar);
        drawVector(v3, 'green');
        drawVector(v4, 'green');
    } else if (operation === "magnitude") {
        let mv1 = v1.magnitude();
        let mv2 = v2.magnitude();
        
        console.log("Magnitude v1: " + mv1);
        console.log("Magnitude v2: " + mv2);
    } else if (operation === "normalize") {
        let v3 = v1.normalize();
        let v4 = v2.normalize();
        drawVector(v3, 'green');
        drawVector(v4, 'green');
    } else if (operation === "angle") {
        let angle = angleBetween(v1, v2);
        console.log("Angle: " + angle);
    } else if (operation === "area") {
        let area = areaTriangle(v1, v2);
        console.log("Area of the triangle: " + area);
    }
}

function angleBetween(v1, v2) {
    const dot = Vector3.dot(v1, v2);
    const mag1 = v1.magnitude();
    const mag2 = v2.magnitude();
    const angle = Math.acos(dot / (mag1 * mag2)) * 180 / Math.PI;
    return angle;
}

function areaTriangle(v1, v2) {
    const cross = Vector3.cross(v1, v2);
    const area = cross.magnitude() / 2;
    return area;
}
