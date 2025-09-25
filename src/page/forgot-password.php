<?php
session_start();
include __DIR__ . '/../../config.php';
include __DIR__ . '/../../mailer.php';

$step = 1;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Step 1: kirim OTP ke email
    if (isset($_POST['email'])) {
        $email = trim($_POST['email']);

        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            $user_id = $user['id'];
            $otp = rand(100000, 999999);
            $expires_at = date("Y-m-d H:i:s", strtotime("+10 minutes"));

            $stmt = $pdo->prepare("INSERT INTO password_resets (user_id, otp, expires_at, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->execute([$user_id, $otp, $expires_at]);

            if (sendOtpMail($email, $otp)) {
                $_SESSION['reset_email'] = $email;
                $_SESSION['reset_user_id'] = $user_id;
                $step = 2;
                $_SESSION['message'] = "OTP sudah dikirim ke email!";
                $_SESSION['message_type'] = "success";
            } else {
                $_SESSION['message'] = "Gagal mengirim OTP!";
                $_SESSION['message_type'] = "error";
            }
        } else {
            $_SESSION['message'] = "Email tidak ditemukan!";
            $_SESSION['message_type'] = "error";
        }
    }

    // Step 2: verifikasi OTP
    elseif (isset($_POST['otp'])) {
        $otp = trim($_POST['otp']);
        $user_id = $_SESSION['reset_user_id'] ?? null;

        if ($user_id) {
            $stmt = $pdo->prepare("SELECT * FROM password_resets WHERE user_id = ? ORDER BY id DESC LIMIT 1");
            $stmt->execute([$user_id]);
            $reset = $stmt->fetch();

            if ($reset && $reset['otp'] == $otp && strtotime($reset['expires_at']) > time()) {
                $step = 3;
                $_SESSION['otp_verified'] = true;
                $_SESSION['message'] = "OTP valid, silakan buat password baru.";
                $_SESSION['message_type'] = "success";
            } else {
                $_SESSION['message'] = "OTP salah atau sudah kadaluarsa!";
                $_SESSION['message_type'] = "error";
                $step = 2;
            }
        }
    }

    // Step 3: reset password
    elseif (isset($_POST['new_password'])) {
        $email = $_SESSION['reset_email'] ?? null;
        $user_id = $_SESSION['reset_user_id'] ?? null;

        if ($email && $user_id && !empty($_SESSION['otp_verified'])) {
            $hashedPassword = password_hash($_POST['new_password'], PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
            if ($stmt->execute([$hashedPassword, $user_id])) {
                unset($_SESSION['reset_email'], $_SESSION['reset_user_id'], $_SESSION['otp_verified']);
                $_SESSION['message'] = "Password berhasil direset, silakan login.";
                $_SESSION['message_type'] = "success";
                header("Location: signin.php");
                exit;
            } else {
                $_SESSION['message'] = "Gagal mereset password!";
                $_SESSION['message_type'] = "error";
            }
        }
    }
}
?>

<?php include '../../layout.php'; ?>
<style>
    .stroke {
        -webkit-text-stroke: 1px #cdcdcdff;
    }
</style>

<section class="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">

    <div class="w-full flex-1 rounded-lg shadow-lg bg-white flex flex-col items-center justify-center font-[poppins] p-6 md:p-12 lg:p-16 relative">
        <img src="https://smkantartika2-sda.sch.id/wp-content/uploads/2023/09/favicon.png" class="w-30 mb-10" alt="">
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-center">Lupa Password</h1>
        <p class="text-neutral-600 text-center mt-3 max-w-md">
            Ikuti langkah berikut untuk reset password akun kamu. 🔑
        </p>

        <?php if (!empty($_SESSION['message'])): ?>
            <div class="mt-4 p-3 rounded text-white 
                <?= $_SESSION['message_type'] === 'error' ? 'bg-red-500' : 'bg-green-500' ?>">
                <?= $_SESSION['message']; ?>
            </div>
            <?php unset($_SESSION['message'], $_SESSION['message_type']); ?>
        <?php endif; ?>

        <form method="POST" class="w-full max-w-md mt-6 flex flex-col gap-4">
            <?php if ($step === 1): ?>
                <input type="email" name="email" placeholder="Masukkan email kamu"
                    class="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <button type="submit" class="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Kirim OTP</button>

            <?php elseif ($step === 2): ?>
                <input type="text" name="otp" placeholder="Masukkan OTP"
                    class="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <button type="submit" class="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Verifikasi OTP</button>

            <?php elseif ($step === 3): ?>
                <input type="password" name="new_password" placeholder="Password Baru"
                    class="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <button type="submit" class="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Reset Password</button>
            <?php endif; ?>
        </form>
    </div>

</section>
