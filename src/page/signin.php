<?php include '../../layout.php'; ?>
<?php session_start(); ?>

<style>
    .stroke {
        -webkit-text-stroke: 1px ghostwhite;
    }
</style>

<section class="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">

    <div class="w-full flex-1 rounded-lg shadow-lg bg-white flex flex-col items-center justify-center font-[poppins] p-6 md:p-12 lg:p-16">

        <!-- Header -->
        <div class="h-fit w-full mb-6 flex items-center">
            <a href="./welcome.php" class="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition">
                <i class="fa-solid fa-caret-left"></i>
            </a>
        </div>

        <div class="w-full flex-1 flex flex-wrap gap-4 justify-center">

            <div class="flex-1 bg-white p-5 rounded-lg flex flex-col items-center gap-2 font-[roboto]">

                <img src="../../public/images/favicon (1).png" class="w-20 shadow-md p-2 rounded-lg" alt="">
                <h1 class="text-3xl font-bold text-neutral-700">Selamat Datang!</h1>
                <p class="text-sm text-neutral-400 text-center">Senang melihatmu kembali. Semoga pengalamanmu menyenangkan! 🌟</p>

                <div class="w-full max-w-2xl">
                    <form x-data="multiStepForm()" x-ref="form"
                        @submit.prevent="handleSubmit"
                        action="../controller/signin_process.php" method="post"
                        class="w-full flex flex-col gap-4">

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
                            </div>
                            <a class="underline text-right" href="./forgot-password.php">
                                Lupa kata sandi?
                            </a>
                            <hr>
                            <!-- Tombol Lanjut -->
                            <button type="submit"
                                :disabled="!isValid"
                                class="w-full bg-[#4f5686] mt-4 hover:bg-[#41466e] text-white py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                                Masuk
                            </button>

                            <div class="justify-center justify-items-center">
                                <p>
                                    Belum memiliki akun? <a href="./signup.php" class="underline">Daftar Disini</a>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="flex-1 bg-gradient-to-br from-sky-800 to-sky-600 rounded-lg shadow hidden lg:flex flex-col gap-3 p-4">
                <h1 class="text-center mt-20 text-transparent stroke text-[7rem] xl:text-[12rem] font-bold">PPDB</h1>
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
            formData: {
                email: '',
                password: '',
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
                return this.lengthValid && this.caseValid && this.numberValid 
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
                this.formData.password = this.password;
                if (!this.formData.email || !this.formData.password) {
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