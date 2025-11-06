'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Swal: any;
  }
}

interface Kelulusan {
  id: number,
  nomor_peserta: number,
  status: string,
  catatan: string,
  diumumkan_at: string,
  created_at: string,
  updated_at: string
}

export default function KartuPage() {
  const [loading, setLoading] = useState(true);
  const [KelulusanList, setKelulusanList] = useState<Kelulusan[]>([]);

  useEffect(() => {
    setLoading(false);
    fetchPembayaran()
  }, [])

  const fetchPembayaran = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pengumuman", {
        method: "GET",
      });

      const result = await response.json();
      console.log(result)

      if (result.success) {
        setKelulusanList(result.kelulusan_rows);
      }
    } catch (error) {
      console.error("Error fetching pembayaran:", error);
    } finally {
      setLoading(false);
    };
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
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
      <div className="min-h-full bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-start">
            <img
              src="/images/megaphone.png"
              alt="Pengumuman"
              className="w-30 h-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Pengumuman</h1>
              <p className="mt-1 text-sm text-gray-600">
                Informasi mengenai kelulusanmu dapat dilihat di sini
              </p>
            </div>
          </div>
          {/* Content box */}
          <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
            {KelulusanList.length === 0 ? (
              < p className="text-sm text-gray-600">
                Belum ada pengumuman. Nantikan pengumuman kelulusan hanya di web ini ya!.
              </p>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto rounded-xl">
                  <table className="w-full table-fixed divide-y divide-gray-200 text-left">
                    <thead className="bg-gradient-to-r from-blue-700 to-blue-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Peserta</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Dinyatakan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Diumumkan pada</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {KelulusanList.map((kel) => (
                        <tr key={kel.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">{kel.nomor_peserta}</td>
                          <td className="px-6 py-4 whitespace-normal uppercase">{(kel.status.replaceAll('_', ' '))}</td>
                          <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{formatDate(kel.diumumkan_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {KelulusanList.map((kel) => (
                    <div key={kel.id} className="p-4 border rounded-lg shadow-sm">
                      <div className="text-sm font-medium text-gray-900">Peserta: {kel.nomor_peserta}</div>
                      <div className="mt-1">Dinyatakan: {(kel.status.replaceAll('_', ' '))}</div>
                      <div className="text-sm text-gray-500">Tanggal: {formatDate(kel.diumumkan_at)}</div>
                      <div className="mt-3">
                        {kel.status === "lulus" && (
                          <span className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded text-xs">
                            <i className="fa-solid fa-cake-candles mr-1"></i>
                            Selamat!
                          </span>
                        )}
                        {kel.status === "tidak_lulus" && (
                          <span className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded text-xs">
                            <i className="fa-solid fa-face-frown mr-1"></i>
                            Yahh, lain hari ya!
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}