var newShape;
var shapes = [];
var canvas = $("#myCanvas")[0];
var ctx = canvas.getContext("2d");
var id = 0;
var canvasBoundary = $("#myCanvas")[0].getBoundingClientRect(); // make x/y relative to canvas
var dragOK = false;
var selectedShape;
var startX;
var startY;

function makeRectangle() {
    newShape = {
        id: id += 1,
        x: parseInt($('#rx').val(), 10),
        y: parseInt($('#ry').val(), 10),
        width: parseInt($('#width').val(), 10),
        height: parseInt($('#height').val(), 10),
        zIndex: 1
    };

    shapes.push(newShape);
    // Sort the Z-Index of shapes - the new shape needs zIndex = 1
    sortIndex("adjust");
    drawShape(newShape);
    console.log("Drawing rect");
}

function makeCircle() {
    newShape = {
        id: id += 1,
        x: parseInt($('#cx').val(), 10),
        y: parseInt($('#cy').val(), 10),
        radius: parseInt($('#radius').val(), 10),
        zIndex: 1
    };

    shapes.push(newShape);
    // Sort the Z-Index of shapes - the new shape needs zIndex = 1
    sortIndex("adjust");
    drawShape(newShape);
    console.log("Drawing circle");
}

function drawShape(shape) {
    // decide if the shape is a rect or circle
    // (it's a rect if it has a width property)
    if (shape.width) {
        var rectangle = new Path2D();

        // Startpos X, Y, width, height
        rectangle.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.stroke(rectangle);
    } else {
        ctx.beginPath();
        // Center of arc X and Y, radius, startAngle, endAngle
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "yellow";
        ctx.fill();
    }
}

$(canvas).on("mousedown", function (e) {
    var foundShape;
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    var mx = e.clientX - canvasBoundary.left;
    var my = e.clientY - canvasBoundary.top;

    // test each shape to see if mouse is inside
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        // decide if the shape is a rect or circle               
        if (shape.width) {
            // test if the mouse is inside this rect
            if (mx > shape.x && mx < shape.x + shape.width && my > shape.y && my < shape.y + shape.height) {
                console.log("Clicked: " + shape.id);
                foundShape = true;
                selectedShape = shape;
                break;
            }
        } else {
            var dx = shape.x - mx;
            var dy = shape.y - my;
            // test if the mouse is inside this circle
            if (dx * dx + dy * dy < shape.radius * shape.radius) {
                console.log("Clicked shape with ID: " + shape.id);
                foundShape = true;
                selectedShape = shape;
                break;
            }
        }
    }

    if (foundShape !== true) {
        console.log("Clicked Canvas at X: " + mx + " - Y: " + my);
    } else {
        // If a shape was found, set foundShape to false.
        foundShape === false;
        // Set the selected shapes isDragging property to true
        selectedShape.isDragging = true;
        dragOK = true;
        // Sort the Z-Index of shapes - selectedShape needs zIndex = 1
        sortIndex("switch");
        reDrawCanvas();
    }

    // save the current mouse position
    startX = mx;
    startY = my;
});

// handle mouse moves
$(canvas).on("mousemove", function (e) {
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

        // move the selectedShape by the
        // distance the mouse has moved
        // since the last mousemove
        if (selectedShape.isDragging) {
            selectedShape.x += dx;
            selectedShape.y += dy;
        }
        // redraw the scene with the new positions
        reDrawCanvas();

        // reset the starting mouse position for the next mousemove
        startX = mx;
        startY = my;

        updateList();
    }
});

// handle mouseup events
$(canvas).on("mouseup", function (e) {
    // if we were dragging anything...
    if (dragOK) {
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();

        // clear all the dragging flags
        dragOK = false;
        selectedShape.isDragging = false;
    }
});

function reDrawCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, 300, 300);
    // redraw each shape in the shapes[] array
    for (var i = shapes.length - 1; i >= 0; i--) {
        drawShape(shapes[i]);
    }
    console.log("Redrawing Canvas");
}

function reset() {
    // Clear the canvas
    ctx.clearRect(0, 0, 300, 300);
    id = 0;
    shapes = [];
    updateList();
}

function sortIndex(mode) {
    // Function to sort the Z-Index
    if (mode === "adjust") {
        // Move all Z-Indices up by one
        for (i = 0; i < shapes.length; i++) {
            if (shapes[i].id < shapes.length) {
                shapes[i].zIndex += 1;
            }
        }
    }

    if (mode === "switch") {
        // If you clicked on the current zIndex = 1, don't change anything
        if (selectedShape.zIndex !== 1) {
            // Move all Z-Indices up by one...
            for (i = 0; i < shapes.length; i++) {
                // ...except the selected shapes Z-Index
                if (shapes[i].zIndex < selectedShape.zIndex) {
                    shapes[i].zIndex += 1;
                }
            }
            // Set the selected shapes Z-Index to 1
            selectedShape.zIndex = 1;
        }
    }

    // Sort the shapes by Z-Index
    shapes.sort(function (a, b) {
        return a.zIndex - b.zIndex;
    });

    updateList();
}

function updateList() {
    // Update the list of shapes on the page
    $("#tableRectangles tr").remove();
    $("#tableCircles tr").remove();
    $("#tableRectangles tbody").append("<tr><th>ID</th><th>X</th><th>Y</th><th>Width</th><th>Height</th><th>Z-Index</th></tr>");
    $("#tableCircles tbody").append("<tr><th>ID</th><th>X</th><th>Y</th><th>Radius</th><th>Z-Index</th></tr>");
    for (i = 0; i < shapes.length; i++) {
        if (shapes[i].width) {
            $("#tableRectangles tbody").append("<tr><td>" + shapes[i].id + "</td><td>" + shapes[i].x + "</td><td>" + shapes[i].y + "</td><td>" + shapes[i].width + "</td><td>" + shapes[i].height + "</td><td>" + shapes[i].zIndex + "</td></tr>");
        } else {
            $("#tableCircles tbody").append("<tr><td>" + shapes[i].id + "</td><td>" + shapes[i].x + "</td><td>" + shapes[i].y + "</td><td>" + shapes[i].radius + "</td><td>" + shapes[i].zIndex + "</td></tr>");
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