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
    $email = $ddate["email"];
    $password = $ddate["password"];
    $securityAnswer = $ddate["securityAnswer"];
    $securityQuestion = $ddate["securityQuestion"];

    $result = "";

    // Check if all required fields are filled
    if ($username != "" && $email != "" && $password != "" && $securityAnswer != "" && $securityQuestion != "") {
        // Check if email or username already exists
        $checkSql = "SELECT * FROM userdata WHERE email = '$email' OR username = '$username'";
        $checkResult = $conn->query($checkSql);

        if ($checkResult->num_rows > 0) {
            $existingRecord = $checkResult->fetch_assoc();
            if ($existingRecord['email'] === $email) {
                $result = "An account with this email already exists. Please log in.";
            } elseif ($existingRecord['username'] === $username) {
                $result = "An account with this username already exists. Please choose a different username.";
            }
        } else {
            // Insert new user data if neither email nor username exists
            $sql = "INSERT INTO userdata (username, email, password, securityquestion, securityAnswer) 
                    VALUES ('$username', '$email', '$password', '$securityQuestion', '$securityAnswer');";

            if ($conn->query($sql) === TRUE) {
                $result = "Registration Successful!";
            } else {
                $result = "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    } else {
        echo json_encode(["result" => "All fields are required"]);
        exit();
    }
}

$conn->close();
echo json_encode(["result" => $result]);
?>
