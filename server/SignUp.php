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
    }
    else
    {
        $edata=file_get_contents("php://input");
        $ddate=json_decode($edata,true);
        if (is_null($ddate)) {
            echo json_encode(["result" => "Invalid JSON data received"]);
            exit();
        }
        $email=$ddate["email"];
        $password=$ddate["password"];
        $securityAnswer=$ddate["securityAnswer"];
        $securityQuestion=$ddate["securityQuestion"];
        $result="";
        if($email!="" && $password!=""&& $securityAnswer!="" && $securityQuestion!=""){
            $sql="INSERT INTO userdata (email, password,securityquestion,securityAnswer) VALUES ('$email', '$password', '$securityQuestion','$securityAnswer');";
                if($conn->query($sql)===TRUE){
                    $result="Registration Successfull ! Redirecting...";
                }
                else{
                    $result="Error: " . $sql . "<br>" . $conn->error;
                }
            
        }
        else
        {
            echo json_encode(["result" => "All fields are required"]);
            exit();
        }
    }
    $conn->close();
    echo json_encode(["result" => $result]);
?>