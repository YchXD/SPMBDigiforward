<?php include '../../layout.php'; ?>

<?php
include '../../config.php';
session_start();

// Ambil lemdik dari URL
$lemdik = $_GET['lemdik'] ?? null;
$namaSekolah = null;
$gambarSekolah = null;

if ($lemdik) {
    $stmt = $pdo->prepare("SELECT nama, gambar FROM sekolah WHERE kode_lemdik = :lemdik");
    $stmt->execute(['lemdik' => $lemdik]);
    $sekolah = $stmt->fetch();

    if ($sekolah) {
        $namaSekolah = $sekolah['nama'];
        $gambarSekolah = $sekolah['gambar'];
    } else {
        // Kalau lemdik tidak valid, redirect ke halaman pilihan jenjang
        header("Location: ./jenjang.php");
        exit;
    }
} else {
    // Kalau lemdik tidak ada, redirect ke halaman pilihan jenjang
    header("Location: ./jenjang.php");
    exit;
}
?>

<style>
    .stroke {
        -webkit-text-stroke: 1px ghostwhite;
    }
</style>

<section class="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">

    <div class="w-full flex-1 rounded-lg shadow-lg bg-white flex flex-col items-center justify-center font-[poppins] p-6 md:p-12 lg:p-16">

        <!-- Header -->
        <div class="h-fit w-full mb-6 flex items-center">
            <a href="./jenjang.php" class="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition">
                <i class="fa-solid fa-caret-left"></i>
            </a>
        </div>

        <div class="w-full flex-1 flex flex-wrap gap-4 justify-center">

            <!-- Form -->
            <div class="flex-1 bg-white p-5 rounded-lg flex flex-col items-center gap-2 font-[roboto]">

                <img src="../../public/images/favicon (1).png" class="w-20 shadow-md p-2 rounded-lg" alt="">
                <h1 class="text-3xl font-bold text-neutral-700">Satu Langkah Lagi..</h1>
                <p class="text-sm text-neutral-400 text-center">Isilah data-data di bawah ini untuk melakukan pendaftaran akun terlebih dahulu ya! ✏️</p>

                <div class="w-full max-w-2xl">
                    <form x-data="multiStepForm()" x-ref="form"
                        @submit.prevent="handleSubmit"
                        action="../controller/signup_process.php" method="post"
                        class="w-full flex flex-col gap-4">

                        <!-- Hidden lemdik -->
                        <input type="hidden" name="lemdik" value="<?= htmlspecialchars($lemdik) ?>">

                        <!-- STEP 1 -->
                        <div x-show="step === 1" x-transition class="flex flex-col gap-2">

                            <!-- Email -->
                            <div>
                                <p class="text-neutral-400 text-sm">Email</p>
                                <div class="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                                    <i class="fa-solid fa-envelope p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                                    <input type="email" name="email" x-model="formData.email"
                                        class="flex-1 px-3 py-2 outline-none text-sm" required>
                                </div>
                            </div>

                            <!-- Password -->
                            <div>
                                <p class="text-neutral-400 text-sm">Password</p>
                                <div class="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                                    <i class="fa-solid fa-key p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                                    <input :type="show ? 'text' : 'password'"
                                        x-model="password"
                                        class="flex-1 px-3 py-2 outline-none text-sm" required>
                                    <button type="button" @click="show = !show" class="px-3 text-neutral-500 hover:text-neutral-700">
                                        <i :class="show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                                    </button>
                                </div>

                                <!-- Rules -->
                                <div x-show="password.length > 0" class="p-3 border border-neutral-400 rounded-lg bg-[#f9f9f9] text-sm mb-2" x-transition>
                                    <p class="text-neutral-400 mb-2 font-semibold">Ketentuan Kata Sandi:</p>
                                    <ul class="space-y-2 text-neutral-400 list-disc">
                                        <li class="flex items-center justify-between">
                                            <span>Minimal 8 karakter dan maksimal 16 karakter</span>
                                            <i :class="lengthValid ? 'fa-solid fa-check text-green-600' : 'fa-solid fa-times text-red-500'"></i>
                                        </li>
                                        <li class="flex items-center justify-between">
                                            <span>Gabungan huruf besar dan kecil</span>
                                            <i :class="caseValid ? 'fa-solid fa-check text-green-600' : 'fa-solid fa-times text-red-500'"></i>
                                        </li>
                                        <li class="flex items-center justify-between">
                                            <span>Minimal satu angka</span>
                                            <i :class="numberValid ? 'fa-solid fa-check text-green-600' : 'fa-solid fa-times text-red-500'"></i>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Konfirmasi Password -->
                            <div>
                                <p class="text-neutral-400 text-sm">Konfirmasi Password</p>
                                <div class="flex items-center border rounded-lg overflow-hidden relative"
                                    :class="confirm && confirm !== password ? 'border-red-500' : 'border-neutral-400'">
                                    <i class="fa-solid fa-key p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                                    <input :type="showConfirm ? 'text' : 'password'"
                                        x-model="confirm"
                                        class="flex-1 px-3 py-2 outline-none text-sm">
                                    <button type="button" @click="showConfirm = !showConfirm" class="px-3 text-neutral-500 hover:text-neutral-700">
                                        <i :class="showConfirm ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                                    </button>
                                    <i x-show="confirm && confirm !== password" class="fa-solid fa-triangle-exclamation text-red-500 absolute right-10"></i>
                                </div>
                            </div>

                            <!-- Tombol Lanjut -->
                            <button type="button"
                                @click="goNext"
                                :disabled="!isValid"
                                class="w-full bg-[#4f5686] mt-4 hover:bg-[#41466e] text-white py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                                Lanjut
                            </button>
                        </div>

                        <!-- STEP 2 -->
                        <div x-show="step === 2" x-transition class="space-y-4">

                            <!-- Nama Lengkap -->
                            <div>
                                <p class="text-neutral-400 text-sm">Nama Lengkap Calon Siswa</p>
                                <div class="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                                    <i class="fa-solid fa-user p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                                    <input type="text" name="nama" x-model="formData.nama"
                                        class="flex-1 px-3 py-2 outline-none text-sm" required>
                                </div>
                            </div>

                            <!-- Tanggal Lahir -->
                            <div>
                                <p class="text-neutral-400 text-sm">Tanggal Lahir Calon Siswa</p>
                                <div class="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                                    <i class="fa-solid fa-calendar-days p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                                    <input type="date" name="tanggal_lahir" x-model="formData.tanggal_lahir"
                                        class="flex-1 px-3 py-2 outline-none text-sm" required>
                                </div>
                            </div>

                            <!-- Nomor WhatsApp -->
                            <div>
                                <p class="text-neutral-400 text-sm">Nomor WhatsApp Ortu/Wali</p>
                                <div class="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                                    <select x-model="waCode" @change="updateWA" class="px-2 py-2 border-r bg-gray-50 text-lg outline-none cursor-pointer">
                                        <option value="+62">🇮🇩</option>
                                        <option value="+60">🇲🇾</option>
                                        <option value="+65">🇸🇬</option>
                                    </select>
                                    <span class="px-3 py-2 border-r text-sm text-neutral-600 bg-gray-50" x-text="waCode"></span>
                                    <input type="text" class="flex-1 px-3 py-2 text-sm outline-none"
                                        x-model="waNumber" @input="updateWA"
                                        oninput="this.value=this.value.replace(/[^0-9]/g,'')" required>
                                    <input type="hidden" name="wa" x-model="formData.wa">
                                </div>
                            </div>

                            <!-- NIK -->
                            <div>
                                <p class="text-neutral-400 text-sm">NIK Calon Siswa</p>
                                <div class="flex items-center border border-neutral-400 rounded-lg overflow-hidden">
                                    <i class="fa-solid fa-id-card p-2 h-full border-r border-neutral-400 text-neutral-400"></i>
                                    <input type="text" name="nik" x-model="formData.nik"
                                        class="flex-1 px-3 py-2 outline-none text-sm"
                                        oninput="this.value=this.value.replace(/[^0-9]/g,'')" required>
                                </div>
                            </div>

                            <!-- Tombol Daftar -->
                            <button type="submit"
                                class="w-full bg-[#4f5686] hover:bg-[#41466e] text-white py-2 rounded-lg font-medium transition mt-4">
                                Daftar
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            <!-- Bagian kanan -->
            <div class="flex-1 bg-gradient-to-br from-sky-800 to-sky-600 rounded-lg shadow hidden lg:flex flex-col gap-3 relative">
                <h1 class="text-center opacity-70 text-transparent stroke text-[7rem] xl:text-[12rem] font-bold h-[1em] z-[0]">PPDB</h1>
                <div class="w-full p-2 justify-center absolute mt-15 xl:mt-30 flex flex-col items-center ">
                    <img src="https://ppdb.telkomschools.sch.id/image/signUp/background_title.png" class="w-40 xl:w-73 absolute z-[1]" alt="">
                    <p class="text-white z-[2] font-bold relative text-sm xl:text-lg"><?= htmlspecialchars($namaSekolah) ?></p>
                </div>
                <div class="w-full min-h-30 relative z-[1] flex flex-col items-center justify-center">
                    <img src="<?= htmlspecialchars($gambarSekolah) ?>" class="max-w-50 xl:max-w-md rounded-lg border border-5 border-neutral-200" alt="">
                </div>
            </div>

        </div>
</section>

<script>
    function multiStepForm() {
        return {
            step: 1,
            show: false,
            showConfirm: false,
            password: '',
            confirm: '',
            waNumber: '',
            waCode: '+62',
            formData: {
                email: '',
                password: '',
                nama: '',
                tanggal_lahir: '',
                wa: '',
                nik: ''
            },

            get lengthValid() {
                return this.password.length >= 8 && this.password.length <= 16
            },
            get caseValid() {
                return /[a-z]/.test(this.password) && /[A-Z]/.test(this.password)
            },
            get numberValid() {
                return /\d/.test(this.password)
            },
            get matchValid() {
                return this.password && this.password === this.confirm
            },
            get isValid() {
                return this.lengthValid && this.caseValid && this.numberValid && this.matchValid
            },

            updateWA() {
                this.formData.wa = this.waCode + this.waNumber
            },

            goNext() {
                if (this.isValid) {
                    this.formData.password = this.password;
                    this.step = 2
                } else Swal.fire({
                    title: "Error",
                    text: "Password tidak valid!",
                    icon: "error",
                    confirmButtonText: "Ok"
                })
            },

            handleSubmit() {
                this.updateWA();
                if (!this.formData.email || !this.formData.password || !this.formData.nama || !this.formData.tanggal_lahir || !this.formData.wa || !this.formData.nik) {
                    Swal.fire({
                        title: "Error",
                        text: "Lengkapi semua data!",
                        icon: "error",
                        confirmButtonText: "Ok"
                    });
                    return;
                }
                this.$refs.form.submit();
            }
        }
    }
</script>

<?php if (isset($_SESSION['message'])): ?>
    <script>
        Swal.fire({
            title: "<?= $_SESSION['message_type'] === 'error' ? 'Error' : 'Info' ?>",
            text: "<?= $_SESSION['message'] ?>",
            icon: "<?= $_SESSION['message_type'] ?>",
            confirmButtonText: "OK"
        });
    </script>
<?php unset($_SESSION['message'], $_SESSION['message_type']);
endif; ?>