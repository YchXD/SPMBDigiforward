'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: number;
  email: string;
  nama: string;
  sekolah_nama?: string;
}

interface UserStatus {
  user: User;
  jalur: any;
  data_diri_complete: boolean;
  berkas_count: number;
  payment_status: string;
  kartu_generated: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await fetch('/api/user-status.php');
      const result = await response.json();

      if (result.success) {
        setUserStatus(result.data);

        // Check access restrictions
        const restrictedPaths = ['/dashboard/datadiri', '/dashboard/berkas', '/dashboard/pembayaran', '/dashboard/kartu'];
        if (restrictedPaths.includes(pathname) && !result.data.jalur) {
          router.push('/dashboard/jalur');
        }
      } else {
        router.push('/signin');
      }
    } catch (error) {
      console.error('Error checking user status:', error);
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

  if (!userStatus) {
    return null;
  }

  const menuItems = [
    { href: '/dashboard/jalur', icon: 'fa-route', label: 'Pilih Jalur', enabled: true },
    { href: '/dashboard/pembayaran', icon: 'fa-credit-card', label: 'Pembayaran', enabled: userStatus.jalur },
    { href: '/dashboard/datadiri', icon: 'fa-user-edit', label: 'Data Diri', enabled: userStatus.payment_status === 'paid' },
    { href: '/dashboard/berkas', icon: 'fa-file-upload', label: 'Upload Berkas', enabled: !!userStatus.data_diri_complete },
    { href: '/dashboard/kartu', icon: 'fa-id-card', label: 'Kartu Peserta', enabled: userStatus.berkas_count >= 5 },
  ];
  const isActive = menuItems.some((item) => pathname === item.href);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-md p-4 flex flex-col justify-between transform transition-transform duration-300 z-50
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0`}
      >

        <div>
          <div className="flex items-center justify-center mb-6">
            <img src="/images/favicon.png" alt="SMK Antartika 2" className="h-10" />
          </div>

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 p-2 rounded transition-colors w-full ${pathname === "/dashboard"
              ? "text-blue-900 bg-blue-50 font-medium"
              : "text-gray-800 hover:bg-blue-50 hover:text-blue-900"
              }`}
          >
            <i className="fa-solid fa-house"></i>
            <span>Dashboard</span>
          </Link>

          <div className="relative w-full">
            {/* Dropdown button */}
            <button
              onClick={() => setOpen(!open)}
              className={`w-full flex items-center justify-between px-2 py-2 rounded-lg transition-colors
                ${isActive
                  ? "text-blue-900 bg-blue-50 font-medium"
                  : "text-gray-800 hover:bg-blue-50"
                }`}
            >
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-bars pr-2"></i>
                <span>SPMB</span>
              </span>
              <i className={`fa-solid fa-chevron-${open ? "up" : "down"} text-xs`} />
            </button>

            {/* Dropdown items */}
            {open && (
              <ul className="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 space-y-1 p-2">
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
                        setOpen(false); // close dropdown on click
                      }}
                    >
                      <i className={`fa-solid ${item.icon}`}></i>
                      <span>{item.label}</span>
                      {!item.enabled && <i className="fa-solid fa-lock text-xs ml-auto"></i>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {/* Pengumuman */}
            <Link
              href="/dashboard/pengumuman"
              className={`flex items-center gap-3 p-2 rounded transition-colors w-full ${pathname === "/dashboard/pengumuman"
                ? "text-blue-900 bg-blue-50 font-medium"
                : "text-gray-800 hover:bg-blue-50 hover:text-blue-900"
                }`}
            >
              <i className="fa-solid fa-trophy"></i>
              <span>Pengumuman</span>
            </Link>
            {/* Bantuan */}
            <Link
              href="/dashboard/bantuan"
              className={`flex items-center gap-3 p-2 rounded transition-colors w-full ${pathname === "/dashboard/bantuan"
                ? "text-blue-900 bg-blue-50 font-medium"
                : "text-gray-800 hover:bg-blue-50 hover:text-blue-900"
                }`}
            >
              <i className="fa-solid fa-phone"></i>
              <span>bantuan</span>
            </Link>
          </div>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-950 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 bg-blue-900 text-white p-3 pl-4 pr-4 rounded-md md:hidden z-50"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="sticky top-0 bg-white shadow-sm border-b p-6 z-40">
          <div className="flex justify-between items-center">
            <h1 className="invisible md:visible text-xl font-bold text-gray-900">SPMB Nextedu Smart2</h1>
            <div className="text-sm text-gray-600">
              Selamat datang, <span className="font-bold text-blue-600">{userStatus.user.nama}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 ">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}