<?php
session_start();
include __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT id, email, password, nama FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user'] = [
            'id' => $user['id'],
            'email' => $user['email'],
            'nama' => $user['nama']
        ];
        header("Location: ../page/pendaftar/home.php");
        exit;
    } else {
        $_SESSION['message'] = "Email atau password salah!";
        $_SESSION['message_type'] = 'error';
        header("Location: ../page/signin.php");
        exit;
    }
}
?>
