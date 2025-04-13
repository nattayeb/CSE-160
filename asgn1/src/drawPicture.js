// drawPicture.js

// Utility to draw a pair of triangles (normal + inverted)
function drawStackedTriangles(x, y, size, color) {
    const d = size / 200.0;
    const x_centered = x - d / 2;

    let tri1 = new Triangle();
    tri1.position = [x_centered, y, 0.0];
    tri1.color = color;
    tri1.size = size;
    gl_ShapesList.push(tri1);

    let tri2 = new InvertedTriangle();
    tri2.position = [x_centered, y, 0.0];
    tri2.color = color;
    tri2.size = size;
    gl_ShapesList.push(tri2);
}

function drawBaseGround(color, size) {
    let x = -1.0;
    let y = -1.0;
    while (x < 1.0) {
        drawStackedTriangles(x, y, size, color);
        x += 0.1;
    }
}

function drawVerticalStack(startY, maxY, startSize, minSize, color) {
    let size = startSize;
    let y = startY;
    while (y < maxY && size >= minSize) {
        let d = size / 200.0;
        drawStackedTriangles(0.0, y, size, color);
        y += d;
        size -= 4;
    }
    return y; // Return last Y reached
}

function drawHorizontalBlade(centerY, direction, startSize, minSize, color) {
    let size = startSize;
    let x = 0.0;
    while (size >= minSize) {
        let d = size / 200.0;
        let y_centered = centerY - d / 2;
        drawStackedTriangles(x, y_centered, size, color);
        x += direction * d;
        size -= 4;
    }
}

function drawVerticalBlade(startY, direction, startSize, minSize, color) {
    let size = startSize;
    let y = startY;
    while (size >= minSize) {
        let d = size / 200.0;
        let yPos = direction > 0 ? y : y - d;
        drawStackedTriangles(0.0, yPos, size, color);
        y += direction * d;
        size -= 4;
    }
}

function drawPicture() {
    const groundSize = 40;
    const trunkSize = 40;
    const trunkMinSize = 10;
    const bladeSize = 30;
    const bladeMinSize = 0;

    const green = [0.0, 1.0, 0.0, 1.0];
    const white = [1.0, 1.0, 1.0, 1.0];
    const bladeColor = [0.0, 0.0, 1.0, 1.0];

    drawBaseGround(green, groundSize);
    const bladeY = drawVerticalStack(-1.0 + (groundSize / 200.0), 1.0, trunkSize, trunkMinSize, white);

    drawHorizontalBlade(bladeY, 1, bladeSize, bladeMinSize, bladeColor);  // Right
    drawHorizontalBlade(bladeY, -1, bladeSize, bladeMinSize, bladeColor); // Left

    drawVerticalBlade(bladeY, 1, bladeSize, bladeMinSize, bladeColor);  // Up
    drawVerticalBlade(bladeY, -1, bladeSize, bladeMinSize, bladeColor); // Down

    renderAllShapes();
}