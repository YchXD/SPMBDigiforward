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
            <p className="text-sm text-gray-600">
              Belum ada pengumuman. Nantikan pengumuman kelulusan hanya di web ini ya!.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}