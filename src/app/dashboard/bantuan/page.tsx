'use client';

import { useState, useEffect } from 'react';

declare global {
  interface Window {
    Swal: any;
  }
}

export default function KartuPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [])

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
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bantuan</h1>
          <p className="mt-1 text-sm text-gray-600">
            Jangan ragu untuk menghubungi kami. Kami siap membantu!
          </p>
        </div>

        {/* Dark header strip */}
        <div className="relative mt-6 bg-gradient-to-r from-blue-700 to-blue-900 shadow-sm rounded-lg p-6 min-h-55 sm:min-h-40 z-10">
          <p className="text-xl text-white font-bold flex items-center justify-center gap-2 mt-5">
            <i className="fa-solid fa-phone-volume"></i>
            Hubungi Kami
          </p>

          {/* White overlapping card */}
          <div className="absolute left-4 right-4 -bottom-12 bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left info */}
            <div className="flex items-center gap-2 text-gray-700">
              <i className="fa-solid fa-location-dot"></i>
              <span>Admin SMK Antartika 2 Sidoarjo</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 text-gray-700">
              <i className="fa-solid fa-phone"></i>
              <span>62-antartika-2</span>
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600 transition"
            >
              <i className="fa-brands fa-whatsapp"></i>
              WhatsApp
            </a>
          </div>
        </div>
        <div className="relative -mt-6 bg-stone-50 border border-gray-200 shadow-sm rounded-lg p-6 min-h-35 sm:min-h-40 z-0"></div>
      </div>
    </div>
  );
}