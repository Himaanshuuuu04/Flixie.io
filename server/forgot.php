<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET,POST");

$conn = new mysqli("localhost", "root", "", "Profile");

if ($conn->connect_error) {
    echo json_encode(["result" => "Failed to connect to MySQL: " . $conn->connect_error]);
    exit();
} else {
    $edata = file_get_contents("php://input");
    $ddate = json_decode($edata, true);

    if (is_null($ddate)) {
        echo json_encode(["result" => "Invalid JSON data received"]);
        exit();
    }

    $username = $ddate["username"];
    $securityQuestion = $ddate["securityQuestion"];
    $securityAnswer = $ddate["securityAnswer"];
    $newPassword = $ddate["newPassword"];

    // Check if all required fields are provided
    if ($username != "" && $securityQuestion != "" && $securityAnswer != "" && $newPassword != "") {
        // Verify username, security question, and answer
        $checkSql = "SELECT * FROM userdata WHERE username = '$username' AND securityquestion = '$securityQuestion' AND securityAnswer = '$securityAnswer'";
        $checkResult = $conn->query($checkSql);

        if ($checkResult->num_rows > 0) {
            // Update the password
            $updateSql = "UPDATE userdata SET password = '$newPassword' WHERE username = '$username'";
            if ($conn->query($updateSql) === TRUE) {
                echo json_encode(["result" => "Password updated successfully!"]);
            } else {
                echo json_encode(["result" => "Error updating password: " . $conn->error]);
            }
        } else {
            echo json_encode(["result" => "Incorrect username, security question, or answer."]);
        }
    } else {
        echo json_encode(["result" => "All fields are required"]);
        exit();
    }
}

$conn->close();
