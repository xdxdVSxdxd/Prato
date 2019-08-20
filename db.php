<?php
	$conn;

$DB_NAME = "Prato";
$DB_HOST = "localhost";
$DB_USER = "Prato";
$DB_PWD = "yyduu//usdioo9I";

try {
    $conn = new PDO("mysql:host=" . $DB_HOST . ";dbname=" . $DB_NAME , $DB_USER, $DB_PWD);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connected successfully";
    }
catch(PDOException $e)
    {
    // echo "Connection failed: " . $e->getMessage();
    }
?>