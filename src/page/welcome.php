<?php include '../../layout.php'; ?>

<style>
    .stroke {
        -webkit-text-stroke: 1px #cdcdcdff;
    }
</style>

<section class="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">

    <div class="w-full flex-1 rounded-lg shadow-lg bg-white flex flex-col items-center justify-center font-[poppins] p-6 md:p-12 lg:p-16">
        <img src="https://smkantartika2-sda.sch.id/wp-content/uploads/2023/09/favicon.png" class="w-30 mb-10" alt="">
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-center">Selamat Datang!</h1>
        <p class="text-neutral-600 text-center mt-3 max-w-md">
            Ikuti tahapan proses pendaftaran dengan teliti dan sesuai dengan data kamu ya! 🌟
        </p>

        <div class="flex flex-col lg:flex-row w-full max-w-2xl gap-3 mt-6 justify-center">

            <!-- Backdrop Text -->
            <h1 class="absolute hidden lg:block text-[100px] font-bold text-transparent select-none pointer-events-none leading-none text-center stroke">
                Selamat Datang!
            </h1>

            <!-- Tombol -->
            <a href="../../src/page/jenjang.php"
                class="flex-1 p-3 bg-[#4f5686] rounded-lg cursor-pointer text-center text-white hover:bg-[#41466e] transition z-10">
                Daftar
            </a>
            <a href="../../src/page/signin.php" class="flex-1 p-3 bg-[#da3732] rounded-lg cursor-pointer text-center text-white hover:bg-[#b52a26] transition z-10">
                Masuk
            </a>
        </div>

    </div>

</section>