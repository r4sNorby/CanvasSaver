/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var newShape;
var shapes = [];
var canvas = $("#myCanvas")[0];
var ctx = canvas.getContext("2d");
var id = 0;
var canvasBoundary = $("#myCanvas")[0].getBoundingClientRect(); // make x/y relative to canvas
var dragOK = false;
//var selectedShape;

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmousemove = mouseMove;

function makeRectangle() {
    newShape = {
        id: id += 1,
        x: parseInt($('#rx').val(), 10),
        y: parseInt($('#ry').val(), 10),
        width: parseInt($('#width').val(), 10),
        height: parseInt($('#height').val(), 10)
    };

    shapes.push(newShape);
    drawShape(newShape);
}

function makeCircle() {
    newShape = {
        id: id += 1,
        x: parseInt($('#cx').val(), 10),
        y: parseInt($('#cy').val(), 10),
        radius: parseInt($('#radius').val(), 10)
    };

    shapes.push(newShape);
    drawShape(newShape);
}

function drawShape(shape) {
    // decide if the shape is a rect or circle
    // (it's a rect if it has a width property)
    if (shape.width) {
        var rectangle = new Path2D();

        // Startpos X, Y, width, height
        rectangle.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.stroke(rectangle);
        console.log("Drawing rect");
    } else {
        ctx.beginPath();
        // Center of arc X and Y, radius, startAngle, endAngle
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "green";
        ctx.fill();
        console.log("Drawing circle");
    }
}

function mouseDown(e) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = e.clientX - canvasBoundary.left;
    var my = e.clientY - canvasBoundary.top;

    // test each shape to see if mouse is inside
    dragOK = false;
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        // decide if the shape is a rect or circle               
        if (shape.width) {
            // test if the mouse is inside this rect
            if (mx > shape.x && mx < shape.x + shape.width && my > shape.y && my < shape.y + shape.height) {
                // if yes, set that rects isDragging=true
                console.log("Dragging rect");
                dragOK = true;
                shape.isDragging = true;
            }
        } else {
            var dx = shape.x - mx;
            var dy = shape.y - my;
            // test if the mouse is inside this circle
            if (dx * dx + dy * dy < shape.radius * shape.radius) {
                console.log("Dragging circle");
                dragOK = true;
                shape.isDragging = true;
            }
        }
    }
    // save the current mouse position
    startX = mx;
    startY = my;
}

// handle mouse moves
function mouseMove(e) {
    // if we're dragging anything...
    if (dragOK) {

        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // get the current mouse position
        var mx = e.clientX - canvasBoundary.left;
        var my = e.clientY - canvasBoundary.top;

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX;
        var dy = my - startY;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            if (shape.isDragging) {
                shape.x += dx;
                shape.y += dy;
            }
        }

        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;

    }
}

// handle mouseup events
function mouseUp(e) {
    var found;
    if (dragOK) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // clear all the dragging flags
        dragOK = false;
        for (var i = 0; i < shapes.length; i++) {
            shapes[i].isDragging = false;
        }
    }

    var mx = e.clientX - canvasBoundary.left;
    var my = e.clientY - canvasBoundary.top;

    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];

        if (shape.width) {
            if (mx > shape.x && mx < shape.x + shape.width && my > shape.y && my < shape.y + shape.height) {
                console.log("MX: " + mx + " - MY: " + my + "\nClicked: " + shape.id + "\nX: " + shape.x + " - Y: " + shape.y + "\nWidth: " + shape.width + " - Height: " + shape.height);
                found = true;
                break;
            }
        } else {
            var dx = shape.x - mx;
            var dy = shape.y - my;
            // test if the mouse is inside this circle
            if (dx * dx + dy * dy < shape.radius * shape.radius) {
                console.log("DX: " + dx + " - DY: " + dy + "\nClicked: " + shape.id + "\nX: " + shape.x + " - Y: " + shape.y + "\nRadius * radius: " + shape.radius * shape.radius);
                found = true;
                break;
            }
        }
    }

    if (found !== true) {
        console.log("Clicked Canvas at X: " + mx + " - Y: " + my);
    } else {
        found === false;
    }
}

function draw() {
    ctx.clearRect(0, 0, 300, 300);
    // redraw each shape in the shapes[] array
    for (var i = 0; i < shapes.length; i++) {
        drawShape(shapes[i]);
        if (i > 10) {
            break;
        }
    }
}

function drawAll() {
    ctx.clearRect(0, 0, 300, 300);
    // redraw each shape in the shapes[] array
    for (var i = 0; i < shapes.length; i++) {
        // decide if the shape is a rect or circle
        // (it's a rect if it has a width property)
        if (shapes[i].width) {
            console.log("Drawing rect");
            drawRectangle(shapes[i]);
        } else {
            console.log("Drawing circle");
            drawCircle(shapes[i]);
        }
        if (i > 10) {
            break;
        }
    }
}

function saveCanvas(canvasObj) {
    $.ajax({
        url: "saveCanvas.php",
        type: "post",
        data: {
            canvasObj: JSON.stringify(canvasObj)
        },
        success: function (response) {
            alert(response);
        }
    });
}

function loadCanvas(canvasID) {
    $.ajax({
        url: "loadCanvas.php",
        type: "post",
        data: {
            canvasID: canvasID
        },
        success: function (response) {
            var obj = JSON.parse(response);
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            ctx.stroke();
        }
    });
}