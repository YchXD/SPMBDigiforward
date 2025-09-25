<?php
session_start();
include __DIR__ . '/../../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $nama = $_POST['nama'] ?? '';
    $tanggal_lahir = $_POST['tanggal_lahir'] ?? '';
    $wa = $_POST['wa'] ?? '';
    $nik = $_POST['nik'] ?? '';
    $lemdik = $_POST['lemdik'] ?? null;

    // Cek apakah lemdik valid
    $stmt = $pdo->prepare("SELECT id FROM sekolah WHERE kode_lemdik = :lemdik");
    $stmt->execute(['lemdik' => $lemdik]);
    $sekolah = $stmt->fetch();

    if (!$sekolah) {
        $_SESSION['message'] = "Sekolah tidak ditemukan, silakan pilih kembali.";
        $_SESSION['message_type'] = 'error';
        header("Location: ../page/jenjang.php");
        exit;
    }

    $sekolah_id = $sekolah['id'];

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Cek email sudah ada
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        $_SESSION['message'] = "Email sudah terdaftar!";
        $_SESSION['message_type'] = 'error';
        header("Location: ../page/signup.php?lemdik=$lemdik");
        exit;
    }

    // Cek NIK sudah ada
    $stmt = $pdo->prepare("SELECT id FROM users WHERE nik = ?");
    $stmt->execute([$nik]);
    if ($stmt->rowCount() > 0) {
        $_SESSION['message'] = "NIK sudah digunakan untuk pendaftaran!";
        $_SESSION['message_type'] = 'error';
        header("Location: ../page/signup.php?lemdik=$lemdik");
        exit;
    }

    // Insert data user termasuk sekolah
    $stmt = $pdo->prepare("INSERT INTO users (email, password, nama, tanggal_lahir, wa, nik, sekolah_id) 
                           VALUES (?, ?, ?, ?, ?, ?, ?)");
    if ($stmt->execute([$email, $hashedPassword, $nama, $tanggal_lahir, $wa, $nik, $sekolah_id])) {
        $_SESSION['user'] = [
            'id' => $pdo->lastInsertId(),
            'email' => $email,
            'nama' => $nama,
            'sekolah_id' => $sekolah_id
        ];
        header("Location: ../page/pendaftar/home.php");
        exit;
    } else {
        $_SESSION['message'] = "Terjadi kesalahan saat menyimpan data!";
        $_SESSION['message_type'] = 'error';
        header("Location: ../page/signup.php?lemdik=$lemdik");
        exit;
    }
}
?>


