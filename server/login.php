<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$conn = new mysqli("localhost", "root", "", "Profile");
if ($conn->connect_error) {
    echo json_encode(["result" => "Failed to connect to MySQL: " . $conn->connect_error]);
    exit();
}

$edata = file_get_contents("php://input");
$ddate = json_decode($edata, true);

if (is_null($ddate)) {
    echo json_encode(["result" => "Invalid JSON data received"]);
    exit();
}

$email = $ddate["email"] ?? '';
$password = $ddate["password"] ?? '';
$result = "";

if (!empty($email) && !empty($password)) {
    $sql = "SELECT * FROM userdata WHERE email = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $queryResult = $stmt->get_result();

    if ($queryResult->num_rows > 0) {
        $result = "Login Successful!";
    } else {
        $result = "Invalid email or password.";
    }
    $stmt->close();
} else {
    echo json_encode(["result" => "All fields are required"]);
    exit();
}

$conn->close();
echo json_encode(["result" => $result]);
