<?php

require_once 'connection.php';

$mysqli = new connection();

$canvasJSON = filter_input(INPUT_POST, 'canvasObj');

$canvas = json_decode($canvasJSON);

$sql = "INSERT INTO canvas (x, y, width, height)
        VALUES (?, ?, ?, ?)";

$stmt = $mysqli->conn->prepare($sql);

$stmt->bind_param("iiii", $canvas->x, $canvas->y, $canvas->width, $canvas->height);

if ($stmt->execute()) {
    echo "Done!";
} else {
    echo "Something went wrong.";
}


