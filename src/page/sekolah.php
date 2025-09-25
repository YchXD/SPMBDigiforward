<?php include '../../layout.php'; ?>
<?php
include '../../config.php'; // sudah termasuk koneksi $pdo
?>



<style>
    .stroke {
        -webkit-text-stroke: 1px #cdcdcdff;
    }
</style>

<section class="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">

    <div class="w-full flex-1 rounded-lg shadow-lg bg-white flex flex-col items-center justify-center font-[poppins] p-6 md:p-12 lg:p-16">

        <!-- Header -->
        <div class="h-fit w-full mb-6 flex flex-wrap items-center">
            <div class="flex justify-center items-center">
                <a href="./jenjang.php" class="p-2 rounded-lg bg-neutral-100 transition-all hover:bg-neutral-200">
                    <i class="fa-solid fa-caret-left"></i>
                </a>
            </div>
            <div class="flex-1 text-start md:text-center ml-2 md:ml-0 mt-2 md:mt-0">
                <h1 class="font-semibold text-lg md:text-2xl font-[arial] leading-none">
                    Silahkan pilih sekolah sesuai Keinginanmu
                </h1>
                <p class="text-xs mt-2 text-neutral-800 md:text-sm">

                    Oke, sekarang pilih sekolah yang ingin kamu daftar ya!
                </p>
            </div>
        </div>

        <div class="w-full flex-1 flex-inline lg:flex flex-wrap gap-4 justify-center mt-5">

            <div class="flex-1 bg-white p-5 rounded-lg shadow">
                <!-- Search + List (kiri) -->
                <div class="flex flex-col bg-white rounded-lg shadow p-4 h-full">
                    <div class="flex items-center border rounded-lg px-3 py-2 mb-3">
                        <input type="text" id="searchInput" placeholder="Cari Nama Sekolah..." class="flex-1 outline-none border-0 focus:ring-0 text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M9 17a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                    </div>
                    <!-- <div class="max-h-72 overflow-y-auto">
                        <h2 class="font-bold mb-2"><?= htmlspecialchars($jenjang) ?></h2>
                        <ul id="schoolList" class="space-y-2">
                            <?php foreach ($sekolah[$jenjang] as $index => $item): ?>
                                <li class="text-gray-600 hover:text-blue-900 hover:bg-blue-100 p-1 rounded-md cursor-pointer" onclick="showPreview(<?= htmlspecialchars(json_encode($item)) ?>)">
                                    <?= htmlspecialchars($item['nama']) ?>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div> -->
                    <div class="max-h-72 overflow-y-auto">
                        <h2 class="font-bold mb-2"><?= htmlspecialchars($jenjang) ?></h2>
                        <ul id="schoolList" class="space-y-2">
                            <?php foreach ($listSekolah as $index => $item): ?>
                                <li
                                    class="text-gray-600 hover:text-blue-900 hover:bg-blue-100 p-1 rounded-md cursor-pointer"
                                    onclick='showPreview(<?= json_encode($item, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>)'>
                                    <?= htmlspecialchars($item['nama']) ?>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="flex-1 bg-white p-5 rounded-lg shadow">
                <!-- Preview (kanan) -->
                <div id="previewArea" class="text-center text-gray-400 flex justify-center h-full">
                    <p>Pilih sekolah dari daftar untuk melihat detail</p>
                </div>
            </div>

        </div>
</section>

<!-- Script filter pencarian -->
<script>
    const searchInput = document.getElementById("searchInput");
    const schoolList = document.getElementById("schoolList");

    searchInput.addEventListener("keyup", function() {
        const filter = this.value.toLowerCase();
        const items = schoolList.getElementsByTagName("li");
        for (let i = 0; i < items.length; i++) {
            const text = items[i].textContent || items[i].innerText;
            items[i].style.display = text.toLowerCase().includes(filter) ? "" : "none";
        }
    });
</script>

<script>
    const kodeMap = <?= json_encode($mapData, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) ?>;

    function showPreview(data) {
        const container = document.getElementById("previewArea");

        // encode data untuk SweetAlert nanti
        const sekolah = encodeURIComponent(data.nama);

        container.innerHTML = `
    <div class="w-full rounded-lg overflow-hidden font-[roboto]">
      <img src="${data.gambar}" alt="${data.nama}" class="w-full h-48 object-cover rounded-t-lg">
      <div class="p-4">
        <h2 class="text-xl font-bold mb-2 text-start text-neutral-800">${data.nama}</h2>
        <hr class="my-2">
        <p class="flex items-center gap-2 text-gray-600 text-semibold mb-1 text-start">
          <i class="fa-solid fa-location-dot"></i> ${data.alamat}
        </p>
        <p class="flex items-center gap-2 text-gray-600 text-semibold mb-4">
          <i class="fa-solid fa-phone"></i> ${data.telp}
        </p>
        <p class="text-neutral-400 mb-4 text-start">${data.deskripsi}</p>
        <button onclick="konfirmasiPilih('${data.nama}')" class="w-full bg-indigo-900 cursor-pointer hover:bg-indigo-1000 text-white py-2 rounded-lg">Pilih</button>
      </div>
    </div>
  `;
    }

    function konfirmasiPilih(namaSekolah) {
        Swal.fire({
            title: "Konfirmasi",
            text: "Apakah Anda yakin ingin memilih " + namaSekolah + "?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ya, pilih",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                // mapping kode Lemdik
                // const kodeMap = {
                //     "SMK Antartika 1 Sidoarjo": 1,
                //     "SMK Antartika 2 Sidoarjo": 2,
                //     "SMA Antartika Sidoarjo": 3,
                //    "SMA Antartika Surabaya": 4,
                //     "SMP Antartika Surabaya": 5
                // };
                const kode = kodeMap[namaSekolah] ?? 0;
                if (kode > 0) {
                    window.location.href = "signup.php?lemdik=" + kode;
                } else {
                    Swal.fire("Error", "Kode sekolah tidak ditemukan!", "error");
                }
            }
        });
    }
</script>