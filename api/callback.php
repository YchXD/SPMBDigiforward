<?php
$logFile = __DIR__ . "/callback_log.txt";

// Ambil raw body
$rawData = file_get_contents("php://input");
file_put_contents($logFile, date("Y-m-d H:i:s") . " - RAW: " . $rawData . PHP_EOL, FILE_APPEND);

// Parse ke array
parse_str($rawData, $data);

// Kalau data kosong, jangan lanjut
if (empty($data)) {
    file_put_contents($logFile, date("Y-m-d H:i:s") . " - ERROR: Data kosong" . PHP_EOL, FILE_APPEND);
    exit("INVALID");
}

// Cek signature
$merchantCode = "DS25188";
$apiKey = "cadf48d101d7384732586d934d3d4430";
$expectedSignature = md5($merchantCode . $data['amount'] . $data['merchantOrderId'] . $apiKey);
file_put_contents(
    $logFile,
    date("Y-m-d H:i:s") . " - SIGNATURE CHECK: expected=$expectedSignature, got={$data['signature']}" . PHP_EOL,
    FILE_APPEND
);

if ($data['signature'] !== $expectedSignature) {
    file_put_contents($logFile, date("Y-m-d H:i:s") . " - ERROR: Invalid signature" . PHP_EOL, FILE_APPEND);
    exit("INVALID SIGNATURE");
}

// === Update database ===
try {
    $pdo = new PDO("mysql:host=localhost;dbname=antartika", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("UPDATE pembayaran SET status = 'paid', paid_at = NOW() WHERE invoice_id = :order_id");
    $stmt->execute([
        ":order_id"   => $data['merchantOrderId']         // invoice
    ]);
    file_put_contents($logFile, date("Y-m-d H:i:s") . " - DB UPDATED: " . json_encode($data) . PHP_EOL, FILE_APPEND);

    echo "SUCCESS"; // wajib balas SUCCESS biar Duitku anggap berhasil
} catch (Exception $e) {
    file_put_contents($logFile, date("Y-m-d H:i:s") . " - DB ERROR: " . $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo "DB ERROR";
}
