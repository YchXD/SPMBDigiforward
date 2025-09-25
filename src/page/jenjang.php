<?php include '../../layout.php'; ?>

<style>
    .stroke {
        -webkit-text-stroke: 1px #cdcdcdff;
    }
</style>

<section class="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">

    <div class="w-full flex-1 rounded-lg relative bg-white flex flex-col font-[poppins] p-6 md:p-12 lg:p-16">

        <!-- Header -->
        <div class="h-fit w-full mb-6 flex flex-wrap items-center">
            <div class="flex justify-center items-center">
                <a href="./welcome.php" class="p-2 rounded-lg bg-neutral-100 transition-all hover:bg-neutral-200">
                    <i class="fa-solid fa-caret-left"></i>
                </a>
            </div>
            <div class="flex-1 text-start md:text-center ml-2 md:ml-0 mt-2 md:mt-0">
                <h1 class="font-semibold text-lg md:text-2xl font-[arial] leading-none">
                    Silahkan pilih jenjang yang ingin kamu masuki
                </h1>
                <p class="text-xs mt-2 text-neutral-800 md:text-sm">
                    Sebelum kamu memilih sekolah, pilih jenjangmu dulu, yuk!
                </p>
            </div>
        </div>

        <!-- Container Card -->
        <div class="w-full flex flex-wrap gap-4 justify-center mt-10">

            <!-- Card SMP -->
            <div class="flex flex-col bg-white rounded-2xl overflow-hidden 
                        w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
                <div class="w-full h-48 md:h-52 lg:h-56">
                    <img src="https://ppdb.telkomschools.sch.id/image/SMP.png" alt="SMP"
                        class="w-full h-full object-cover rounded-t-2xl">
                </div>
                <div class="flex flex-1 flex-col items-center text-center p-4">
                    <h3 class="font-bold text-2xl text-gray-900">SMP</h3>
                    <p class="text-sm text-gray-600 mt-2 mb-3">
                        Nikmati pengalaman belajar yang berkualitas di SMP Antartika dengan komunitas yang dinamis 🏃
                    </p>
                    <button onclick="pilihjenjang('SMP')" class="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition">
                        Pilih
                    </button>
                </div>
            </div>

            <!-- Card SMA -->
            <div class="flex flex-col bg-white rounded-2xl overflow-hidden 
                        w-full sm:w-[50%] lg:w-[45%] xl:w-[18%]  h-auto md:h-[420px] lg:h-[440px]">
                <div class="w-full h-48 md:h-52 lg:h-56">
                    <img src="https://ppdb.telkomschools.sch.id/image/sma-new.png" alt="SMA"
                        class="w-full h-full object-cover rounded-t-2xl">
                </div>
                <div class="flex flex-1 flex-col items-center text-center p-4">
                    <h3 class="font-bold text-2xl text-gray-900">SMA</h3>
                    <p class="text-sm text-gray-600 mt-2 mb-3">
                        Dapatkan kesempatan untuk mengembangkan potensi akademik dan non-akademik di SMA Antartika 📖
                    </p>
                    <button onclick="pilihjenjang('SMA')" class="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition">
                        Pilih
                    </button>
                </div>
            </div>

            <!-- Card SMK -->
            <div class="flex flex-col bg-white rounded-2xl overflow-hidden 
                        w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
                <div class="w-full h-48 md:h-52 lg:h-56">
                    <img src="https://ppdb.telkomschools.sch.id/image/smk-img.png" alt="SMK"
                        class="w-full h-full object-cover rounded-t-2xl">
                </div>
                <div class="flex flex-1 flex-col items-center text-center p-4">
                    <h3 class="font-bold text-2xl text-gray-900">SMK</h3>
                    <p class="text-sm text-gray-600 mt-2 mb-3">
                        Dapatkan pendidikan kejuruan di SMK Antartika yang berfokus pada persiapan karir yang kokoh 💼
                    </p>
                    <button onclick="pilihjenjang('SMK')" class="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition">
                        Pilih
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
    function pilihjenjang(jenjang) {
        Swal.fire({
            title: "Konfirmasi",
            title: "Konfirmasi",
            text: "Anda memilih jenjang " + jenjang,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Lanjut",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "sekolah.php?jenjang=" + jenjang;
            }
        });
    }
</script>