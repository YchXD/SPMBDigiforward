'use client';

import { useState, useEffect } from 'react';

interface Pembayaran {
  allowRetry: boolean;
  id: number;
  invoice_id: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_url: string;
  jalur_nama: string;
  jalur_biaya: number;
  created_at: string;
  expired_at: string;
}

declare global {
  interface Window {
    Swal: any;
  }
}
interface Jalur {
  id: number;
  nama: string;
  deskripsi: string;
  periode_mulai: string;
  periode_selesai: string;
  biaya: number;
  status: string;
}

export default function PembayaranPage() {
  const [pembayaranList, setPembayaranList] = useState<Pembayaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [indexpay, setindexpay] = useState(1)
  

  useEffect(() => {
    fetchPembayaran();
    fetch("/api/user_jalur")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log("Fetched:", data);
          setJalur(data.user_jalur);
        }
      });
    fetchPembayaran();
  }, []);
  useEffect(() => {
    fetchPembayaran().then(async () => {
      const res = await fetch("/api/pembayaran/expirecheck");
      const data = await res.json();
      if (data.success) {
        setPembayaranList(prev =>
          prev.map(p => {
            const found = data.data.find((d: any) => d.id === p.id);
            return found ? { ...p, allowRetry: found.allowRetry } : p;
          })
        );
      }
    });
  }, []);
  const [jalur, setJalur] = useState<any>(null);
  useEffect(() => {
  }, []);
  const fetchPembayaran = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pembayaran/create", {
        method: "GET",
      });

      const result = await response.json();

      if (result.success) {
        setPembayaranList(result.data);
      } else {
        console.error("Failed to fetch pembayaran:", result.message);
      }
    } catch (error) {
      console.error("Error fetching pembayaran:", error);
    } finally {
      setLoading(false);
    }
  };


  const createPayment = async (jalurId: number) => {
    setCreating(true);

    try {
      const response = await fetch('/api/pembayaran/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_payment', jalur_id: jalurId })
      });

      const result = await response.json();

      if (result.success) {
        if (window.Swal) {
          window.Swal.fire({
            title: "Invoice Dibuat",
            text: "Invoice pembayaran berhasil dibuat!",
            icon: "success",
            confirmButtonText: "Ok"
          }).then(() => { window.location.reload });
        }
        fetchPembayaran();
      } else {
        if (window.Swal) {
          window.Swal.fire({
            title: "Error",
            text: result.message,
            icon: "error",
            confirmButtonText: "Ok"
          }).then(() => { window.location.reload });
        }
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      if (window.Swal) {
        window.Swal.fire({
          title: "Error",
          text: "Terjadi kesalahan sistem",
          icon: "error",
          confirmButtonText: "Ok"
        }).then(() => { window.location.reload });
      }
    } finally {
      setCreating(false);
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Lunas</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Menunggu</span>;
      case 'failed':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Gagal</span>;
      case 'expired':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Kadaluarsa</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">-</span>;
    }
  };

  const indexmethod = [
    {
      id: 1,
      paymethod: ""
    }
  ]

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
  //console.log('pembayaran response:', pembayaranList);
  //console.log('jalur:', jalur);
  return (
    <div className="space-y-6">
      {/* Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <i className="fa-solid fa-triangle-exclamation text-yellow-600 mt-0.5 mr-3"></i>
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Perhatian:</p>
            <p className="mt-1">Semua biaya yang sudah dibayarkan tidak dapat dikembalikan</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4">
          <h1 className="text-lg font-bold text-white">Metode Pembayaran</h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <button className={indexpay === 1 ? "flex items-center h-16 gap-2 p-3 outline-3 outline-blue-500 rounded-lg bg-white hover:outline-4 cursor-pointer transition-colors" : "flex items-center h-16 gap-2 p-3 outline rounded-lg bg-white hover:bg-blue-50 cursor-pointer transition-colors"}
              onClick={() => setindexpay(1)}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg" className="h-4" alt="BNI" />
              <span className="text-sm">Virtual Account</span>
            </button>
            <button className={indexpay === 2 ? "flex items-center h-16 gap-2 p-3 outline-3 outline-blue-500 rounded-lg bg-white hover:outline-4 cursor-pointer transition-colors" : "flex items-center h-16 gap-2 p-3 outline rounded-lg bg-white hover:bg-blue-50 cursor-pointer transition-colors"}
              onClick={() => setindexpay(2)}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/BANK_BRI_logo_%28vertical%29.svg/640px-BANK_BRI_logo_%28vertical%29.svg.png" className="h-5" alt="BRI" />
              <span className="text-sm">Virtual Account</span>
            </button>
            <button className={indexpay === 3 ? "flex items-center h-16 gap-2 p-3 outline-3 outline-blue-500 rounded-lg bg-white hover:outline-4 cursor-pointer transition-colors" : "flex items-center h-16 gap-2 p-3 outline rounded-lg bg-white hover:bg-blue-50 cursor-pointer transition-colors"}
              onClick={() => setindexpay(3)}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/640px-Logo_QRIS.svg.png" className="h-4" alt="QRIS" />
              <span className="text-sm">QRIS</span>
            </button>
            <button className={indexpay === 4 ? "flex items-center h-16 gap-2 p-3 outline-3 outline-blue-500 rounded-lg bg-white hover:outline-4 cursor-pointer transition-colors" : "flex items-center h-16 gap-2 p-3 outline rounded-lg bg-white hover:bg-blue-50 cursor-pointer transition-colors"}
              onClick={() => setindexpay(4)}
            >
              <i className="fa-brands fa-cc-visa text-blue-700 text-xl"></i>
              <span className="text-sm">Kartu Kredit</span>
            </button>
            <button className={indexpay === 5 ? "flex items-center h-16 gap-2 p-3 outline-3 outline-blue-500 rounded-lg bg-white hover:outline-4 cursor-pointer transition-colors" : "flex items-center h-16 gap-2 p-3 outline rounded-lg bg-white hover:bg-blue-50 cursor-pointer transition-colors"}
              onClick={() => setindexpay(5)}
            >
              <i className="fa-solid fa-wallet text-green-600 text-xl"></i>
              <span className="text-sm">E-Wallet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4">
          <h2 className="text-lg font-bold text-white">Riwayat Pembayaran</h2>
        </div>

        <div className="p-6">
          {pembayaranList.length === 0 ? (
            <div className="text-center py-8">
              <i className="fa-solid fa-receipt text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Belum ada riwayat pembayaran</p>
              <button
                onClick={() => jalur && createPayment(jalur.id)}
                disabled={!jalur}
                className="mt-4 w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {creating ? "Membuat..." : "Buat Pembayaran"}
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-fixed divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jalur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pembayaranList.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        {/* Debug log inline */}
                        {(() => {
                          console.log("payment row:", payment);
                          return null;
                        })()}
                        <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">{payment.invoice_id}</td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{payment.jalur_nama}</td>
                        <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                        <td className="px-6 py-4 whitespace-normal">{getStatusBadge(payment.status)}</td>
                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{formatDate(payment.created_at)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {payment.status === "pending" && payment.payment_url && (
                            <a
                              href={payment.payment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              <i className="fa-solid fa-external-link-alt mr-1"></i>
                              Bayar
                            </a>
                          )}
                          {payment.status === "paid" && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              <i className="fa-solid fa-check mr-1"></i>
                              Selesai
                            </span>
                          )}
                          {payment.status === "expired" && payment.allowRetry && (
                            <div className='px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>
                              <i className="fa-solid fa-arrows-rotate mr-1"></i>
                              <button
                                onClick={() => jalur && createPayment(jalur.id)}
                                disabled={!jalur}>
                                {creating ? 'Proses...' : "Buat Lagi"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {pembayaranList.map((payment) => (
                  <div key={payment.id} className="p-4 border rounded-lg shadow-sm">
                    {/* Debug log inline */}
                    {(() => {
                      console.log("payment row:", payment);
                      return null;
                    })()}
                    <div className="text-sm font-medium text-gray-900">Invoice: {payment.invoice_id}</div>
                    <div className="text-sm text-gray-600">Jalur: {payment.jalur_nama}</div>
                    <div className="text-sm font-medium text-gray-900">Jumlah: {formatCurrency(payment.amount)}</div>
                    <div className="mt-1">{getStatusBadge(payment.status)}</div>
                    <div className="text-sm text-gray-500">Tanggal: {formatDate(payment.created_at)}</div>
                    <div className="mt-3">
                      {payment.status === "pending" && payment.payment_url && (
                        <a
                          href={payment.payment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          <i className="fa-solid fa-external-link-alt mr-1"></i>
                          Bayar
                        </a>
                      )}
                      {payment.status === "paid" && (
                        <span className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-600 rounded text-xs">
                          <i className="fa-solid fa-check mr-1"></i>
                          Selesai
                        </span>
                      )}
                      {payment.status === "expired" && payment.allowRetry && (
                        <div className='block w-full text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>
                          <i className="fa-solid fa-arrows-rotate mr-1"></i>
                          <button
                            onClick={() => jalur && createPayment(jalur.id)}
                            disabled={!jalur}>
                            {creating ? 'Proses...' : "Buat Lagi"}
                          </button>
                        </div>
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
  );
}