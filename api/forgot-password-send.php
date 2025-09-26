<?php
include 'config.php';
require_once '../mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit();
}

error_log("Raw input: " . file_get_contents('php://input'));
error_log("Decoded input: " . print_r($input, true));

if (!is_array($input)) {
    $input = $_POST ?: $_GET;
}
$method = isset($input['method']) ? $input['method'] : '';
$email  = isset($input['email']) ? $input['email'] : '';
$phone  = isset($input['phone']) ? $input['phone'] : '';



if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit();
}

$email = trim($input['email'] ?? '');

if ($method === 'email') {
    if (empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Email harus diisi']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
} elseif ($method === 'whatsapp') {
    if (empty($phone)) {
        echo json_encode(['success' => false, 'message' => 'Nomor WhatsApp harus diisi']);
        exit();
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE wa = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch();
}

try {
    if ($user) {
        $_SESSION['reset_user_id'] = $user['id'];
        $user_id = $user['id'];
        $otp = rand(100000, 999999);
        $expires_at = date("Y-m-d H:i:s", strtotime("+10 minutes"));

        // ensure table exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            otp VARCHAR(6) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )");

        $stmt = $pdo->prepare("INSERT INTO password_resets (user_id, otp, expires_at, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$user_id, $otp, $expires_at]);

        if ($method === 'email') {
            if (sendOtpMail($email, $otp)) {
                echo json_encode(['success' => true, 'message' => 'OTP sudah dikirim ke email!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Gagal mengirim OTP email!']);
            }
        } elseif ($method === 'whatsapp') {
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "http://localhost:4000/send-otp?phone=" . urlencode($phone) . "&otp=" . urlencode($otp));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            $err = curl_error($ch);
            curl_close($ch);

            if ($err) {
                error_log("Baileys request error: $err");
                echo json_encode(['success' => false, 'message' => 'Gagal mengirim OTP WhatsApp!']);
            } else {
                echo json_encode(['success' => true, 'message' => 'OTP sudah dikirim ke WhatsApp!']);
            }
        }
    } else {
        echo json_encode(['success' => false, 'message' => $method === 'email' ? 'Email tidak ditemukan!' : 'Nomor WhatsApp tidak ditemukan!']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
