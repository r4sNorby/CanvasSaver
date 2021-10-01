<?php

require_once 'connection.php';

$mysqli = new connection();

$canvasID = filter_input(INPUT_POST, 'canvasID');

$sql = "SELECT x, y, width, height FROM canvas
        WHERE canvasID = ?";

$stmt = $mysqli->conn->prepare($sql);

$stmt->bind_param("i", $canvasID);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $JSONresult = '{"x":' . $row["x"] . ',"y":' . $row["y"] . ',"width":' . $row["width"] . ',"height":' . $row["height"] . '}';
    }
    echo $JSONresult;
} else {
    echo "Something went wrong.";
}


