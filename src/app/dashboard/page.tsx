'use client';

import { Span } from 'next/dist/trace';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface UserStatus {
  user: any;
  jalur: any;
  data_diri_complete: boolean;
  berkas_count: number;
  payment_status: string;
  kartu_generated: boolean;
  kelulusan: any;
}

export default function Dashboard() {
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUserStatus();
  }, []);

  const fetchUserStatus = async () => {
    try {
      const response = await fetch('/api/user', { credentials: "include" });
      const result = await response.json();
      console.log(result)

      if (result.success) {
        setUserStatus(result.data);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userStatus) {
    return null;
  }

  const getStepStatus = (step: number) => {
    switch (step) {
      case 1: return !!userStatus.jalur;
      case 2: return userStatus.payment_status === 'paid';
      case 3: return userStatus.data_diri_complete;
      case 4: return userStatus.berkas_count >= 4;
      case 5: return userStatus.kartu_generated;
      default: return false;
    }
  };
  const menuItems = [
    { href: 'a', label: 'RPL', enabled: true},
    { href: 'b', label: 'TKJ', enabled: true},
    { href: 'c', label: 'PB', enabled: true},
    { href: 'd', label: 'AKL', enabled: true},
    { href: 'e', label: 'TM', enabled: true},
    { href: 'f', label: 'DKV', enabled: true},
  ];
  const isActive = menuItems.some((item) => pathname === item.href);
  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nama Lengkap</p>
            <p className="font-medium wrap-break-word">{userStatus.user.nama}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{userStatus.user.email}</p>
          </div>
          {/* <div>
            <p className="text-sm text-gray-500">Sekolah</p>
            <p className="font-medium">{userStatus.user.sekolah_nama || 'Belum dipilih'}</p>
          </div> */}
          <div>
            <p className="text-sm text-gray-500">Jalur Pendaftaran</p>
            <p className="font-medium">{userStatus.jalur?.jalur_nama || 'Belum dipilih'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Jurusan</p>
            <div className='flex flex-row'>
              {/* <p className="font-medium uppercase">{(userStatus.user.jurusan).replaceAll('_', ' ') || 'Not Found'}</p> */}
              {userStatus.user.jurusan === "tidak_diterima" ? (
                <div className="relative w-full">
                  {/* Dropdown button */}
                  <button
                    onClick={() => setOpen(!open)}
                    className={`w-fit flex items-center justify-between rounded-lg text-gray-800`}
                  >
                    <span className="flex font-medium items-center gap-2">
                      <span className='uppercase'>{(userStatus.user.jurusan).replaceAll('_', ' ') || 'Not Found'}</span>
                    </span>
                    <i className={`fa-solid fa-chevron-${open ? "up" : "down"} text-xs ml-2`} />
                  </button>

                  {/* Dropdown items */}
                  {open && (
                    <ul className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 space-y-1 p-2">
                      <p className='font-medium pt-1 px-3'>Jurusan yang sebelumnya anda pilih tidak diterima, silahkan pilih jurusan baru</p>
                      {menuItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.enabled ? item.href : "#"}
                            className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${pathname === item.href
                              ? "text-blue-900 bg-blue-50 font-medium"
                              : item.enabled
                                ? "text-gray-800 hover:bg-blue-50 hover:text-blue-900"
                                : "text-gray-400 cursor-not-allowed"
                              }`}
                            onClick={(e) => {
                              if (!item.enabled) {
                                e.preventDefault();
                              }
                              setOpen(false);
                            }}
                          >
                            <span>{item.label}</span>
                            {!item.enabled && <i className="fa-solid fa-lock text-xs ml-auto"></i>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <>
                  <p className="font-medium uppercase">{(userStatus.user.jurusan).replaceAll('_', ' ') || 'Not Found'}</p>
                </>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status Pembayaran</p>
            <span className={`px-2 py-1 text-xs rounded-full ${userStatus.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
              userStatus.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
              {userStatus.payment_status === 'paid' ? 'Lunas' :
                userStatus.payment_status === 'pending' ? 'Menunggu' : 'Belum Bayar'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status kelulusan</p>
            <p className={`px-2 py-1 text-xs rounded-full w-fit ${userStatus.kelulusan.status === 'lulus' ? 'bg-green-100 text-green-800' : userStatus.kelulusan.status === 'tidak_lulus' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{userStatus.kelulusan.status === 'lulus' ? 'Anda Lulus!' : userStatus.kelulusan.status === 'tidak_lulus' ? 'Anda tidak lulus' : 'Belum diumumkan'}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Alur Pendaftaran</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <i className="fa-solid fa-book-open-reader mr-2"></i>
            Panduan
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {[
            { step: 1, label: 'Pilih Jalur', icon: 'fa-route' },
            { step: 2, label: 'Bayar Pendaftaran', icon: 'fa-credit-card' },
            { step: 3, label: 'Isi Data Diri', icon: 'fa-user-edit' },
            { step: 4, label: 'Upload Berkas', icon: 'fa-file-upload' },
            { step: 5, label: 'Kartu Peserta', icon: 'fa-id-card' }
          ].map((item, index) => (
            <div key={item.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepStatus(item.step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                  <i className={`fa-solid ${item.icon}`}></i>
                </div>
                <p className="text-xs mt-2 text-center">{item.label}</p>
              </div>
              {index < 4 && (
                <div className={`hidden sm:block w-16 h-0.5 mx-4 ${getStepStatus(item.step + 1) ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <i className="fa-solid fa-route text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Status Jalur</p>
              <p className="text-lg font-semibold">
                {userStatus.jalur ? 'Terpilih' : 'Belum Dipilih'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <i className="fa-solid fa-file-text text-green-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Data Diri</p>
              <p className="text-lg font-semibold">
                {userStatus.data_diri_complete ? 'Lengkap' : 'Belum Lengkap'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <i className="fa-solid fa-file-upload text-yellow-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Berkas Upload</p>
              <p className="text-lg font-semibold">{userStatus.berkas_count}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <i className="fa-solid fa-id-card text-purple-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Kartu Peserta</p>
              <p className="text-lg font-semibold">
                {userStatus.kartu_generated ? 'Tersedia' : 'Belum Tersedia'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Panduan */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>

            <h2 className="text-xl font-bold mb-4">Panduan Pendaftaran PPDB</h2>

            <div className="grid md:grid-cols-2 text-sm leading-relaxed rounded-md overflow-hidden">
              <div className='h-full object-cover'>
                <img src="/images/instruksi.png" alt="instruksi" className='h-full rounded-xl' />
              </div>
              <div className='mt-3 md:ml-3'>
                <p><span className="font-bold">1. Pilih Jalur:</span> Pilih jalur pendaftaran yang sesuai dengan periode dan biaya yang tersedia.</p>
                <p className="mt-2"><span className="font-bold">2. Bayar Pendaftaran:</span> Lakukan pembayaran sesuai nominal yang tertera melalui metode pembayaran yang tersedia.</p>
                <p className="mt-2"><span className="font-bold">3. Isi Data Diri:</span> Lengkapi data diri, data orang tua, dan informasi asal sekolah dengan benar.</p>
                <p className="mt-2"><span className="font-bold">4. Upload Berkas:</span> Upload dokumen yang diperlukan seperti KK, Akta, Ijazah, Foto, dan Rapor.</p>
                <p className="mt-2"><span className="font-bold">5. Kartu Peserta:</span> Setelah semua tahap selesai, download kartu peserta untuk keperluan verifikasi.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}