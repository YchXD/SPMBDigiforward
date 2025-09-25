<?php
session_start();
include __DIR__ . '/../../../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $nama = $_POST['nama'] ?? '';
    $tanggal_lahir = $_POST['tanggal_lahir'] ?? '';
    $wa = $_POST['wa'] ?? '';
    $nik = $_POST['nik'] ?? '';

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // cek email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        $_SESSION['message'] = "Email sudah terdaftar, silakan login!";
        $_SESSION['message_type'] = 'error';
    } else {
        // insert user baru
        $stmt = $pdo->prepare("INSERT INTO users (email, password, nama, tanggal_lahir, wa, nik) VALUES (?, ?, ?, ?, ?, ?)");
        if ($stmt->execute([$email, $hashedPassword, $nama, $tanggal_lahir, $wa, $nik])) {
            $_SESSION['user'] = [
                'id' => $pdo->lastInsertId(),
                'email' => $email,
                'nama' => $nama
            ];
            $_SESSION['message'] = "Pendaftaran berhasil, selamat datang $nama!";
            $_SESSION['message_type'] = 'success';
        } else {
            $_SESSION['message'] = "Terjadi kesalahan saat menyimpan data!";
            $_SESSION['message_type'] = 'error';
        }
    }
}

// redirect ke login jika belum login
if (!isset($_SESSION['user'])) {
    header("Location: ../welcome.php");
    exit;
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Home</title>
</head>

<body>
    <?php if (isset($_SESSION['message'])): ?>
        <div style="color: <?= $_SESSION['message_type'] === 'success' ? 'green' : 'red' ?>">
            <?= $_SESSION['message'] ?>
        </div>
        <?php unset($_SESSION['message'], $_SESSION['message_type']); ?>
    <?php endif; ?>

    <h1>Selamat datang, <?= $_SESSION['user']['nama'] ?></h1>
    <p>Email: <?= $_SESSION['user']['email'] ?></p>
    <p><a href="../../controller/logout.php">Logout</a></p>
</body>

</html>