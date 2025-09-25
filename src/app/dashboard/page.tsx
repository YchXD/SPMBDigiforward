'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  nama: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/check-auth.php');
      const result = await response.json();
      
      if (result.success) {
        setUser(result.user);
      } else {
        router.push('/signin');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/signin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout.php', { method: 'POST' });
      router.push('/welcome');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/images/favicon.png" 
                alt="Logo" 
                className="h-8 w-8 mr-3"
              />
              <h1 className="text-xl font-bold text-gray-900">PPDB Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Selamat datang, {user.nama}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dashboard Pendaftar
              </h2>
              <p className="text-gray-600 mb-8">
                Selamat datang di dashboard PPDB SMK Antartika 2 Sidoarjo
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-center">
                    <i className="fa-solid fa-user text-4xl text-blue-600 mb-4"></i>
                    <h3 className="text-lg font-semibold mb-2">Profil Saya</h3>
                    <p className="text-gray-600 text-sm">Kelola informasi profil Anda</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-center">
                    <i className="fa-solid fa-file-text text-4xl text-green-600 mb-4"></i>
                    <h3 className="text-lg font-semibold mb-2">Status Pendaftaran</h3>
                    <p className="text-gray-600 text-sm">Lihat status pendaftaran Anda</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-center">
                    <i className="fa-solid fa-bell text-4xl text-yellow-600 mb-4"></i>
                    <h3 className="text-lg font-semibold mb-2">Notifikasi</h3>
                    <p className="text-gray-600 text-sm">Lihat pengumuman terbaru</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}