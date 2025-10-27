'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { time } from 'console';


interface Jalur {
  kuota: number;
  id: number;
  nama: string;
  deskripsi: string;
  periode_mulai: string;
  periode_selesai: string;
  biaya: number;
  status: string;
}

declare global {
  interface Window {
    Swal: any;
  }
}

export default function JalurPage() {
  const [jalurList, setJalurList] = useState<Jalur[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJalur, setSelectedJalur] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchJalur();
  }, []);

  const fetchJalur = async () => {
    try {
      const response = await fetch('/api/jalur');
      const result = await response.json();

      if (result.success) {
        setJalurList(result.data);
      }
    } catch (error) {
      console.error('Error fetching jalur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJalur = async (jalur: Jalur) => {
    if (jalur.status !== 'aktif') {
      if (window.Swal) {
        window.Swal.fire({
          title: "Tidak Tersedia",
          text: "Jalur ini sedang tidak aktif",
          icon: "warning",
          confirmButtonText: "Ok"
        });
      }
      return;
    }

    if (window.Swal) {
      const result = await window.Swal.fire({
        title: "Konfirmasi Pilihan",
        text: `Apakah Anda yakin memilih jalur ${jalur.nama}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Pilih",
        cancelButtonText: "Batal"
      });

      if (result.isConfirmed) {
        try {
          const response = await fetch('/api/jalur', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jalur_id: jalur.id })
          });

          const result = await response.json();

          if (result.success) {
            await window.Swal.fire({
              title: "Berhasil",
              text: "Jalur berhasil dipilih!",
              icon: "success",
              confirmButtonText: "Ok"
            }).then(() => {
              router.push("/dashboard/pembayaran");
            });
          } else {
            window.Swal.fire({
              title: "Error",
              text: result.message,
              icon: "error",
              confirmButtonText: "Ok"
            });
          }
        } catch (error) {
          console.error('Error selecting jalur:', error);
          window.Swal.fire({
            title: "Error",
            text: "Terjadi kesalahan sistem",
            icon: "error",
            confirmButtonText: "Ok"
          });
        }
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <i className="fa-solid fa-triangle-exclamation text-yellow-600 mt-0.5 mr-3"></i>
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Perhatian:</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Jadwal dapat berubah sewaktu-waktu</li>
              <li>Semua biaya yang sudah dibayarkan tidak dapat dikembalikan</li>
              <li>Pastikan memilih jalur dengan teliti</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Jalur List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4">
          <h1 className="text-lg font-bold text-white">Daftar Jalur Pendaftaran</h1>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Jalur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Periode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Biaya</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Kuota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jalurList.map((jalur) => (
                <tr key={jalur.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-blue-700 break-words whitespace-normal">
                    <div>{jalur.nama}</div>
                    <div className="text-gray-500">{jalur.deskripsi}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 break-words whitespace-normal">
                    {formatDate(jalur.periode_mulai)} - {formatDate(jalur.periode_selesai)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words whitespace-normal">
                    {formatCurrency(jalur.biaya)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words whitespace-normal">
                    {jalur.kuota}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${jalur.status === "aktif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {jalur.status === "aktif" ? "Dibuka" : "Ditutup"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleSelectJalur(jalur)}
                      disabled={jalur.status !== "aktif"}
                      className={`px-4 py-2 rounded-lg transition-colors ${jalur.status === "aktif"
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      Pilih
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {jalurList.map((jalur) => (
            <div key={jalur.id} className="p-4">
              <div className="text-sm font-medium text-blue-700">{jalur.nama}</div>
              <div className="text-sm text-gray-500 mb-2">{jalur.deskripsi}</div>
              <div className="text-sm text-gray-900">
                <span className="font-medium">Periode:</span>{" "}
                {formatDate(jalur.periode_mulai)} - {formatDate(jalur.periode_selesai)}
              </div>
              <div className="text-sm text-gray-900">
                <span className="font-medium">Biaya:</span> {formatCurrency(jalur.biaya)}
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${jalur.status === "aktif"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                    }`}
                >
                  {jalur.status === "aktif" ? "Dibuka" : "Ditutup"}
                </span>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => handleSelectJalur(jalur)}
                  disabled={jalur.status !== "aktif"}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${jalur.status === "aktif"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Pilih
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}