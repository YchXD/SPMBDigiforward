'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';
import { useState } from 'react';

declare global {
  interface Window {
    Swal: any;
  }
}

export default function jurusan() {
  const handlejurusanSelection = (jurusan: string) => {
    if (jurusan == typeof String) {

    }
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        title: "Konfirmasi",
        text: `Anda memilih jurusan ${jurusan}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Lanjut",
        cancelButtonText: "Batal"
      }).then((result: any) => {
        if (result.isConfirmed) {
          window.location.href = `/signup?jurusan=${jurusan}`;
        }
      });
    } else {
      // Fallback jika SweetAlert belum loaded
      if (confirm(`Anda memilih jurusan ${jurusan}. Lanjutkan?`)) {
        window.location.href = `/signup?jurusan=${jurusan}`;
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-blue-900 px-4 py-10 md:px-20">
      <div className="w-full flex-1 rounded-lg relative bg-white flex flex-col font-poppins p-6 md:p-12 lg:p-16">
        {/* Header */}
        <div className="h-fit w-full mb-6 flex flex-wrap items-center">
          <div className="flex justify-center items-center">
            <Link href="/welcome" className="p-2 rounded-lg bg-neutral-100 transition-all hover:bg-neutral-200">
              <FontAwesomeIcon icon={faCaretLeft} />
            </Link>
          </div>
          <div className="flex-1 text-start md:text-center ml-2 md:ml-0 mt-2 md:mt-0">
            <h1 className="font-bold text-xl md:text-2xl font-arial leading-none">
              Silahkan pilih jurusan yang ingin kamu masuki
            </h1>
            <p className="text-xs mt-2 text-neutral-800 md:text-sm">
              Sebelum kamu memilih sekolah, pilih jurusanmu dulu, yuk!
            </p>
          </div>
        </div>

        {/* Container Card */}
        <div className="w-full flex flex-wrap xl:flex-nowrap gap-4 justify-center mt-10">
          {/* Card Akutansi */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100
                          w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
            <div className="w-full h-48 md:h-52 lg:h-56">
              <img
                src="images/akutansi.png"
                alt="akutansi"
                className="w-full h-full object-cover aspect-square rounded-t-2xl"
              />
            </div>
            <div className="flex flex-1 flex-col items-center text-center p-4">
              <h3 className="font-bold text-2xl text-gray-900">Akuntansi</h3>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                Pelajari pencatatan dan analisis keuangan untuk mengelola bisnis dengan tepat 💰📊
              </p>
              <button
                onClick={() => handlejurusanSelection('AKUTANSI')}
                className="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition"
              >
                Pilih
              </button>
            </div>
          </div>
          {/* Card DKV */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100
                          w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
            <div className="w-full h-48 md:h-52 lg:h-56">
              <img
                src="images/dkv.png"
                alt="DKV"
                className="w-full h-full object-cover aspect-square rounded-t-2xl"
              />
            </div>
            <div className="flex flex-1 flex-col items-center text-center p-4">
              <h3 className="font-bold text-2xl text-gray-900">DKV</h3>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                Kembangkan kreativitas dan keterampilan di Jurusan DKV/Multimedia 🎨
              </p>
              <button
                onClick={() => handlejurusanSelection('DKV')}
                className="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition"
              >
                Pilih
              </button>
            </div>
          </div>
          {/* Card Perbankan */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100
                          w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
            <div className="w-full h-48 md:h-52 lg:h-56">
              <img
                src="images/akutansi.png"
                alt="akutansi"
                className="w-full h-full object-cover aspect-square rounded-t-2xl"
              />
            </div>
            <div className="flex flex-1 flex-col items-center text-center p-4">
              <h3 className="font-bold text-2xl text-gray-900">PB</h3>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                Pelajari pencatatan dan analisis keuangan untuk mengelola bisnis dengan tepat 💰📊
              </p>
              <button
                onClick={() => handlejurusanSelection('PB')}
                className="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition"
              >
                Pilih
              </button>
            </div>
          </div>

          {/* Card RPL */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100
                          w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
            <div className="w-full h-48 md:h-52 lg:h-56">
              <img
                src="images/rpl.png"
                alt="RPL"
                className="w-full h-full object-cover aspect-square rounded-t-2xl"
              />
            </div>
            <div className="flex flex-1 flex-col items-center text-center p-4">
              <h3 className="font-bold text-2xl text-gray-900">RPL</h3>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                Bangun kemampuan merancang dan membuat aplikasi dan website di Jurusan RPL 💻✨
              </p>
              <button
                onClick={() => handlejurusanSelection('RPL')}
                className="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition"
              >
                Pilih
              </button>
            </div>
          </div>

          {/* Card TKJ */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100
                          w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
            <div className="w-full h-48 md:h-52 lg:h-56">
              <img
                src="images/tkj.png"
                alt="TKJ"
                className="w-full h-full object-cover aspect-square rounded-t-2xl"
              />
            </div>
            <div className="flex flex-1 flex-col items-center text-center p-4">
              <h3 className="font-bold text-2xl text-gray-900">TKJ</h3>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                Pelajari jaringan komputer dan teknologi perangkat keras di Jurusan TKJ 🌐🔧
              </p>
              <button
                onClick={() => handlejurusanSelection('TKJ')}
                className="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition"
              >
                Pilih
              </button>
            </div>
          </div>
          {/* Card TM */}
          <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100
                          w-full sm:w-[50%] lg:w-[45%] xl:w-[18%] h-auto md:h-[420px] lg:h-[440px]">
            <div className="w-full h-48 md:h-52 lg:h-56">
              <img
                src="images/tm.png"
                alt="TM"
                className="w-full h-full object-cover aspect-square rounded-t-2xl"
              />
            </div>
            <div className="flex flex-1 flex-col items-center text-center p-4">
              <h3 className="font-bold text-2xl text-gray-900">TM</h3>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                Pelajari gabungan mesin, elektronik, dan komputer untuk membuat robot dan sistem otomatis 🤖⚙️
              </p>
              <button
                onClick={() => handlejurusanSelection('TM')}
                className="cursor-pointer mt-auto w-full px-6 py-2 rounded-lg bg-[#4f5686] text-white hover:bg-[#41466e] transition"
              >
                Pilih
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}