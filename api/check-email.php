<?php
header("Content-Type: application/json");
require __DIR__ . "/config.php";

$email = $_GET['email'] ?? '';

if (!$email) {
    echo json_encode([ "available" => false, "message" => "No email provided" ]);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->rowCount() > 0) {
    echo json_encode([ "available" => false ]);
} else {
    echo json_encode([ "available" => true ]);
}
