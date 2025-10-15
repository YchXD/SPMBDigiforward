-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 10, 2025 at 06:06 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `antartika`
--

-- --------------------------------------------------------

--
-- Table structure for table `berkas`
--

CREATE TABLE `berkas` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `jenis_berkas` enum('kk','akta','ijazah','foto','rapor') NOT NULL,
  `nama_file` varchar(255) NOT NULL,
  `path_file` varchar(500) NOT NULL,
  `ukuran_file` int DEFAULT '0',
  `status` enum('pending','verified','rejected') DEFAULT 'pending',
  `keterangan` text,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `berkas`
--

INSERT INTO `berkas` (`id`, `user_id`, `jenis_berkas`, `nama_file`, `path_file`, `ukuran_file`, `status`, `keterangan`, `uploaded_at`) VALUES
(1, 1, 'kk', 'RobloxScreenShot20241031_185257865.png', '../uploads/berkas/1/kk_1758955571.png', 1851207, 'verified', NULL, '2025-09-27 06:46:11'),
(2, 1, 'akta', '708118892_98971573980608_1751905804864.png', '../uploads/berkas/1/akta_1758955577.png', 660358, 'verified', NULL, '2025-09-27 06:46:17'),
(3, 1, 'ijazah', '708118892_122372797638019_1754405701410.png', '../uploads/berkas/1/ijazah_1758955581.png', 967259, 'verified', NULL, '2025-09-27 06:46:21'),
(4, 1, 'foto', '708118892_98971573980608_1751908092110.png', '../uploads/berkas/1/foto_1758955593.png', 725481, 'verified', NULL, '2025-09-27 06:46:33'),
(5, 1, 'rapor', 'RobloxScreenShot20250110_135757829.png', '../uploads/berkas/1/rapor_1758955599.png', 1576092, 'verified', NULL, '2025-09-27 06:46:39'),
(6, 4, 'kk', 'RobloxScreenShot20241228_213043046.png', '../uploads/berkas/4/kk_1759033401.png', 1586582, 'pending', NULL, '2025-09-28 04:23:21'),
(7, 4, 'akta', 'RobloxScreenShot20241229_231853017.png', '../uploads/berkas/4/akta_1759033407.png', 1592761, 'pending', NULL, '2025-09-28 04:23:27'),
(8, 4, 'ijazah', 'RobloxScreenShot20250110_130704186.png', '../uploads/berkas/4/ijazah_1759033413.png', 1977251, 'pending', NULL, '2025-09-28 04:23:33'),
(9, 4, 'foto', '708118892_122372797638019_1754405722908.png', '../uploads/berkas/4/foto_1759033424.png', 1326287, 'pending', NULL, '2025-09-28 04:23:44'),
(10, 4, 'rapor', '708118892_98971573980608_1751905563634.png', '../uploads/berkas/4/rapor_1759033434.png', 630322, 'pending', NULL, '2025-09-28 04:23:54'),
(11, 5, 'kk', 'Screenshot_20250927_095429.jpg', '../uploads/berkas/5/kk_1759038551.jpg', 735271, 'pending', NULL, '2025-09-28 05:49:11'),
(12, 5, 'akta', 'Screenshot_20250927_100210.jpg', '../uploads/berkas/5/akta_1759038559.jpg', 460212, 'pending', NULL, '2025-09-28 05:49:19'),
(13, 5, 'ijazah', 'Screenshot_20250926_162549.jpg', '../uploads/berkas/5/ijazah_1759038573.jpg', 736901, 'pending', NULL, '2025-09-28 05:49:33'),
(15, 5, 'rapor', 'Screenshot_20250925_134640.jpg', '../uploads/berkas/5/rapor_1759038606.jpg', 431000, 'pending', NULL, '2025-09-28 05:50:06'),
(23, 5, 'foto', 'Minecraft cat ♥️.jpg', '../uploads/berkas/5/foto_1759061201.jpg', 119088, 'pending', NULL, '2025-09-28 12:06:41'),
(28, 9, 'kk', 'localhost_3000_signin(Samsung Galaxy S20 Ultra).png', '../uploads/berkas/9/kk_1759072822.png', 301416, 'pending', NULL, '2025-09-28 15:20:22'),
(29, 9, 'akta', 'localhost_3000_dashboard(Samsung Galaxy S20 Ultra).png', '../uploads/berkas/9/akta_1759072828.png', 277616, 'pending', NULL, '2025-09-28 15:20:28'),
(30, 9, 'ijazah', 'localhost_3000_dashboard_kartu(Samsung Galaxy S20 Ultra) (1).png', '../uploads/berkas/9/ijazah_1759072834.png', 696548, 'pending', NULL, '2025-09-28 15:20:34'),
(31, 9, 'foto', 'Minecraft cat ♥️.jpg', '../uploads/berkas/9/foto_1759072840.jpg', 119088, 'pending', NULL, '2025-09-28 15:20:40'),
(32, 9, 'rapor', 'localhost_3000_dashboard_kartu(Samsung Galaxy S20 Ultra).png', '../uploads/berkas/9/rapor_1759072848.png', 199261, 'pending', NULL, '2025-09-28 15:20:48'),
(33, 7, 'kk', 'COVER YT PASLON 1.png', '../uploads/berkas/7/kk_1759104973.png', 1638589, 'pending', NULL, '2025-09-29 00:16:13'),
(34, 7, 'akta', 'Haikal_SPMB202500009.png', '../uploads/berkas/7/akta_1759104982.png', 532556, 'pending', NULL, '2025-09-29 00:16:22'),
(35, 7, 'ijazah', 'localhost_3000_signin(Samsung Galaxy S20 Ultra).png', '../uploads/berkas/7/ijazah_1759104991.png', 301416, 'pending', NULL, '2025-09-29 00:16:31'),
(36, 7, 'foto', 'Minecraft cat ♥️.jpg', '../uploads/berkas/7/foto_1759104998.jpg', 119088, 'pending', NULL, '2025-09-29 00:16:38'),
(37, 7, 'rapor', 'latihan soal STS XII.pdf', '../uploads/berkas/7/rapor_1759105021.pdf', 293953, 'pending', NULL, '2025-09-29 00:17:01'),
(38, 11, 'kk', 'Screenshot 2025-09-05 202621.png', '../uploads/berkas/11/kk_1759125017.png', 392205, 'pending', NULL, '2025-09-29 05:50:17'),
(39, 11, 'foto', 'Screenshot 2025-09-03 132826.png', '../uploads/berkas/11/foto_1759125043.png', 72793, 'pending', NULL, '2025-09-29 05:50:43'),
(40, 11, 'ijazah', 'Screenshot 2025-08-30 013329.png', '../uploads/berkas/11/ijazah_1759125064.png', 721848, 'pending', NULL, '2025-09-29 05:51:04'),
(41, 11, 'akta', 'Screenshot 2025-09-13 074433.png', '../uploads/berkas/11/akta_1759125137.png', 1412258, 'pending', NULL, '2025-09-29 05:52:17'),
(42, 11, 'rapor', 'Screenshot 2025-06-16 200140.png', '../uploads/berkas/11/rapor_1759125151.png', 1027079, 'pending', NULL, '2025-09-29 05:52:31'),
(43, 13, 'kk', 'Screenshot 2025-09-21 191203.png', '../uploads/berkas/13/kk_1759194743.png', 26462, 'pending', NULL, '2025-09-30 01:12:23'),
(44, 13, 'akta', 'Screenshot 2025-09-22 222707.png', '../uploads/berkas/13/akta_1759194749.png', 14632, 'pending', NULL, '2025-09-30 01:12:29'),
(45, 13, 'ijazah', 'Screenshot 2025-09-27 150215.png', '../uploads/berkas/13/ijazah_1759194755.png', 297492, 'pending', NULL, '2025-09-30 01:12:35'),
(46, 13, 'foto', 'Screenshot 2025-09-27 191028.png', '../uploads/berkas/13/foto_1759194765.png', 373119, 'pending', NULL, '2025-09-30 01:12:45'),
(47, 13, 'rapor', 'Screenshot 2025-09-22 221832.png', '../uploads/berkas/13/rapor_1759194769.png', 42125, 'pending', NULL, '2025-09-30 01:12:49'),
(48, 15, 'kk', 'Gray and White Simple Minimalist Car Sale Promotion Instagram Story.png', '..\\uploads\\berkas\\15\\kk_1759921476131.png', 396922, 'pending', NULL, '2025-10-08 11:04:36'),
(52, 15, 'akta', 'download 3.jpg', '../uploads/berkas/15/akta_1759921628206.jpg', 99624, 'pending', NULL, '2025-10-08 11:07:08'),
(53, 15, 'ijazah', 'download 3.jpg', '\\uploads\\berkas\\15\\ijazah_1759918678091.jpg', 99624, 'pending', NULL, '2025-10-08 10:17:58'),
(54, 15, 'foto', '66d711b1dedb2b00119607f9-1987_f40_image04.png', '../uploads/berkas/15/foto_1759921671406.png', 893470, 'pending', NULL, '2025-10-08 11:07:51'),
(55, 15, 'rapor', 'WhatsApp Image 2025-07-31 at 21.40.13_28e4c364.jpg', '\\uploads\\berkas\\15\\rapor_1759919527490.jpg', 21237, 'pending', NULL, '2025-10-08 10:32:07'),
(67, 2, 'kk', 'Screenshot_1756996129.png', '../uploads/berkas/2/kk_1760109524265.png', 81423, 'pending', NULL, '2025-10-10 15:18:44');

-- --------------------------------------------------------

--
-- Table structure for table `data_diri`
--

CREATE TABLE `data_diri` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `nisn` varchar(20) DEFAULT NULL,
  `nik` varchar(100) NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') DEFAULT NULL,
  `agama` varchar(50) DEFAULT NULL,
  `alamat` text,
  `no_hp` varchar(20) DEFAULT NULL,
  `no_hp_ortu` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `asal_sekolah` varchar(200) DEFAULT NULL,
  `nama_ayah` varchar(100) DEFAULT NULL,
  `nama_ibu` varchar(100) DEFAULT NULL,
  `pekerjaan_ayah` varchar(100) DEFAULT NULL,
  `pekerjaan_ibu` varchar(100) DEFAULT NULL,
  `penghasilan_ortu` enum('< 1 juta','1-3 juta','3-5 juta','> 5 juta') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tanggal_lahir` date DEFAULT NULL,
  `tahun_lulus` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `data_diri`
--

INSERT INTO `data_diri` (`id`, `user_id`, `nama_lengkap`, `nisn`, `nik`, `tempat_lahir`, `jenis_kelamin`, `agama`, `alamat`, `no_hp`, `no_hp_ortu`, `asal_sekolah`, `nama_ayah`, `nama_ibu`, `pekerjaan_ayah`, `pekerjaan_ibu`, `penghasilan_ortu`, `created_at`, `updated_at`, `tanggal_lahir`, `tahun_lulus`) VALUES
(1, 1, '', '0076996471', '', 'Surabaya', 'Laki-laki', 'Islam', 'Jl Ngawi Pak Amba', '6287886820365', '', 'SMP 2 Buduran', 'Iqbal', 'Faliq', 'Programmer', 'Yapping', '> 5 juta', '2025-09-27 06:43:28', '2025-09-27 06:43:28', NULL, 0),
(2, 3, '', '8787776418741741', '', 'Surabaya', 'Laki-laki', 'Islam', 'SIdoarjo', '+6287886820365', '', 'SMP 2 Buduran', 'Iqbal', 'sherin', 'karyawan', 'ibu rumah tangga', '> 5 juta', '2025-09-27 11:49:22', '2025-09-27 11:49:22', NULL, 0),
(3, 4, '', '6586286621621142', '', 'Surabaya', 'Laki-laki', 'Islam', 'Antartika 2 Sidoarjo', '+6287886820365', '', 'SMP 2 Buduran', 'Iqbal', 'sherin', 'karyawan', 'Yapping', '> 5 juta', '2025-09-28 04:23:00', '2025-09-28 04:23:00', NULL, 0),
(4, 5, '', '2937296183628', '', 'Sidoarjo', 'Laki-laki', 'Islam', 'Oma Pesona Buduran Blok G2 nomor 20', '+6285183103656', '', 'Smpn 2 buduran', 'Budi', 'Siti', 'Karyawan', 'Ibu rumah tangga', '> 5 juta', '2025-09-28 05:48:26', '2025-09-28 06:01:23', NULL, 0),
(6, 9, '', '18416274154714087', '', 'Siapa yang tau', 'Laki-laki', 'Islam', 'siapa yang mau', '+6298187421681', '', 'cerita kita', 'sulit dicana', 'kalau disana', 'sulit dicerna', 'awww', '> 5 juta', '2025-09-28 15:16:54', '2025-09-28 15:16:54', NULL, 0),
(7, 7, '', '22223', '', 'Siapa yang tau', 'Laki-laki', 'Islam', 'sidokare', '+6285746113606', '', 'cerita kita', 'sulit dicana', 'kalau disana', 'sulit dicerna', 'Yapping', '> 5 juta', '2025-09-29 00:15:37', '2025-09-29 00:15:37', NULL, 0),
(8, 11, '', '9912394300400', '', 'Sidoarjo', 'Laki-laki', 'Islam', 'Kebonagung Rt 17 Rw 05, Sukodono Sidoarjo', '+6285746113606', '', 'SMPN1 SUKODONO SIDOARJO', 'ayah', 'ibu', 'asdaaa', 'dsdaa', '> 5 juta', '2025-09-29 05:49:29', '2025-09-29 05:49:29', NULL, 0),
(9, 13, '', '351535535776', '', 'Surabaya', 'Laki-laki', 'Islam', 'sidoarjo', '+6281345266522', '', 'SMP', 'akkk', 'ibu', 'swasta', 'negeri', '1-3 juta', '2025-09-30 01:10:23', '2025-09-30 01:10:23', NULL, 0),
(10, 15, '', '14214311124139', '', 'Surabaya', 'Laki-laki', 'Hindu', 'testing with next routes api!', '+621841874871248', '', 'SMP 2 Buduran Sidoarjo', 'Budi', 'sherin', 'swasta', 'negeri', '1-3 juta', '2025-10-08 09:37:45', '2025-10-08 09:41:32', NULL, 0),
(11, 2, 'halo kakak dan mbak mbak', '9498488743', '18416274154714087', 'Mars lebo', 'Laki-laki', 'Kristen', 'woilah cik ', '+6287886820365', '+6288888888888', 'SMPN 67 Lebo', 'itu dia ', 'iya juga', 'benar lagi', 'nah inilah', '< 1 juta', '2025-10-10 14:53:09', '2025-10-10 15:08:18', '2008-12-07', 2020);

-- --------------------------------------------------------

--
-- Table structure for table `jalur`
--

CREATE TABLE `jalur` (
  `id` int NOT NULL,
  `nama` varchar(100) NOT NULL,
  `deskripsi` text,
  `periode_mulai` date NOT NULL,
  `periode_selesai` date NOT NULL,
  `biaya` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `jalur`
--

INSERT INTO `jalur` (`id`, `nama`, `deskripsi`, `periode_mulai`, `periode_selesai`, `biaya`, `status`, `created_at`, `updated_at`) VALUES
(1, 'BATCH INDEN', 'Jalur pendaftaran batch inden dengan kuota terbatas', '2025-05-05', '2025-09-20', 150000.00, 'aktif', '2025-09-27 04:55:02', '2025-09-29 05:38:59'),
(2, 'BATCH 1', 'Jalur pendaftaran batch pertama', '2025-09-20', '2025-10-24', 150000.00, 'nonaktif', '2025-09-27 04:55:02', '2025-09-27 04:55:02'),
(3, 'BATCH 2', 'Jalur pendaftaran batch kedua', '2025-10-25', '2025-12-15', 175000.00, 'aktif', '2025-09-27 04:55:02', '2025-09-27 04:55:02'),
(4, 'BATCH 3', 'Jalur pendaftaran batch ketiga', '2025-12-16', '2026-02-28', 200000.00, 'aktif', '2025-09-27 04:55:02', '2025-09-27 04:55:02'),
(5, 'BATCH INDEN', 'Jalur pendaftaran batch inden dengan kuota terbatas', '2025-05-05', '2025-09-20', 150000.00, 'nonaktif', '2025-09-27 04:55:36', '2025-09-27 04:55:36'),
(6, 'BATCH 1', 'Jalur pendaftaran batch pertama', '2025-09-20', '2025-10-24', 150000.00, 'nonaktif', '2025-09-27 04:55:36', '2025-09-27 04:55:36'),
(7, 'BATCH 2', 'Jalur pendaftaran batch kedua', '2025-10-25', '2025-12-15', 175000.00, 'aktif', '2025-09-27 04:55:36', '2025-09-27 04:55:36'),
(8, 'BATCH 3', 'Jalur pendaftaran batch ketiga', '2025-12-16', '2026-02-28', 1000000.00, 'aktif', '2025-09-27 04:55:36', '2025-09-29 05:40:17');

-- --------------------------------------------------------

--
-- Table structure for table `kartu`
--

CREATE TABLE `kartu` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `nomor_peserta` varchar(20) NOT NULL,
  `qr_code` text,
  `status` enum('draft','active','expired') DEFAULT 'draft',
  `generated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kartu`
--

INSERT INTO `kartu` (`id`, `user_id`, `nomor_peserta`, `qr_code`, `status`, `generated_at`) VALUES
(1, 1, '2025-00001', NULL, 'active', '2025-09-27 06:53:16'),
(2, 4, '2025-00004', NULL, 'active', '2025-09-28 04:24:08'),
(3, 5, '2025-00005', NULL, 'active', '2025-09-28 09:01:52'),
(11, 9, '2025-00009', NULL, 'active', '2025-09-28 15:50:38'),
(12, 7, '2025-00007', NULL, 'active', '2025-09-29 00:17:32'),
(13, 11, '2025-00011', NULL, 'active', '2025-09-29 05:53:42'),
(14, 13, '2025-00013', NULL, 'active', '2025-09-30 01:12:54'),
(15, 15, '2025-00015', NULL, 'active', '2025-10-08 11:08:17');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `user_id`, `otp`, `expires_at`, `created_at`) VALUES
(27, 13, '680491', '2025-09-30 01:26:04', '2025-09-30 01:16:04'),
(37, 5, '522398', '2025-10-09 11:42:43', '2025-10-09 04:32:42'),
(38, 5, '779513', '2025-10-09 11:43:12', '2025-10-09 04:33:12'),
(40, 7, '921150', '2025-10-09 11:51:24', '2025-10-09 04:41:24'),
(41, 7, '160270', '2025-10-09 11:53:01', '2025-10-09 04:43:01'),
(42, 7, '438156', '2025-10-09 12:06:16', '2025-10-09 04:56:16'),
(43, 7, '491657', '2025-10-09 12:06:47', '2025-10-09 04:56:46'),
(44, 7, '831694', '2025-10-09 12:07:17', '2025-10-09 04:57:17');

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `jalur_id` int NOT NULL,
  `invoice_id` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','failed','expired') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_url` text,
  `duitku_reference` varchar(100) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `expired_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pembayaran`
--

INSERT INTO `pembayaran` (`id`, `user_id`, `jalur_id`, `invoice_id`, `amount`, `status`, `payment_method`, `payment_url`, `duitku_reference`, `paid_at`, `expired_at`, `created_at`, `updated_at`) VALUES
(7, 3, 3, 'INV-3-3-1758973589', 175000.00, 'paid', NULL, 'https://sandbox.duitku.com/payment/INV-3-3-1758973589', NULL, NULL, '2025-09-28 04:46:29', '2025-09-27 11:46:29', '2025-09-27 11:47:26'),
(8, 4, 3, 'INV-4-3-1759033285', 175000.00, 'paid', NULL, 'https://sandbox.duitku.com/payment/INV-4-3-1759033285', NULL, NULL, '2025-09-28 21:21:25', '2025-09-28 04:21:25', '2025-09-28 04:21:36'),
(9, 5, 8, 'INV-5-8-1759038375', 200000.00, 'expired', NULL, 'https://sandbox.duitku.com/payment/INV-5-8-1759038375', NULL, NULL, '2025-09-28 22:46:15', '2025-09-28 05:46:15', '2025-10-09 11:34:25'),
(44, 9, 3, 'INV-9-3-1759072365', 175000.00, 'paid', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS25188255FUDDO1KSUF7KD2', NULL, '2025-09-28 15:13:16', '2025-09-29 08:12:45', '2025-09-28 15:12:45', '2025-09-28 15:13:16'),
(45, 10, 8, 'INV-10-8-1759075193', 200000.00, 'paid', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS2518825K8QMOLIN12FTCOR', NULL, '2025-09-28 16:00:31', '2025-09-29 08:59:53', '2025-09-28 15:59:53', '2025-09-28 16:00:31'),
(47, 7, 8, 'INV-7-8-1759104784', 200000.00, 'paid', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS2518825IX14A4QLPZNVBIE', NULL, '2025-09-29 00:13:36', '2025-09-29 17:13:04', '2025-09-29 00:13:04', '2025-09-29 00:13:36'),
(48, 11, 8, 'INV-11-8-1759124453', 1000000.00, 'paid', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS2518825MIBQ70GWPRE8QER', NULL, '2025-09-29 05:43:30', '2025-09-29 22:40:53', '2025-09-29 05:40:53', '2025-09-29 05:43:30'),
(49, 12, 1, 'INV-12-1-1759136849', 150000.00, 'pending', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS25188256MO0FAMDMIZ8EFJ', NULL, NULL, '2025-09-30 02:07:29', '2025-09-29 09:07:29', '2025-09-29 09:07:30'),
(50, 13, 8, 'INV-13-8-1759193745', 1000000.00, 'paid', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS2518825KXZ3ND1DM4S3B3S', NULL, NULL, '2025-09-30 17:55:45', '2025-09-30 00:55:45', '2025-09-30 01:02:42'),
(51, 1, 3, 'INV-1-3-1759195802', 175000.00, 'paid', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS25188250KLDIA524OG5P5C', NULL, '2025-09-30 01:30:54', '2025-09-30 18:30:02', '2025-09-30 01:30:02', '2025-09-30 01:30:54'),
(71, 15, 8, 'INV-15-8-1759834577137', 1000000.00, 'expired', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS2518825ZJJ5X4NEUYH4XRY', NULL, NULL, '2025-10-08 03:56:17', '2025-10-07 10:56:17', '2025-10-07 10:56:29'),
(72, 15, 8, 'INV-15-8-1759835913819', 1000000.00, 'expired', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS25188251PZ47W2NDPYU7CI', NULL, NULL, '2025-10-08 04:18:33', '2025-10-07 11:18:33', '2025-10-07 11:18:57'),
(73, 15, 8, 'INV-15-8-1759839124093', 1000000.00, 'paid', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS2518825IQE3YTASMBA68LE', NULL, '2025-10-07 12:12:38', '2025-10-08 05:12:04', '2025-10-07 12:12:04', '2025-10-08 12:00:22'),
(78, 2, 7, 'INV-2-7-1760010206218', 175000.00, 'expired', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS2518825IVLFCJVWC7B13WT', NULL, NULL, '2025-10-10 04:43:26', '2025-10-09 11:43:26', '2025-10-09 11:43:36'),
(79, 2, 7, 'INV-2-7-1760010235333', 175000.00, 'expired', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS2518825MPJB1WHBE1LZGBB', NULL, NULL, '2025-10-10 04:43:55', '2025-10-09 11:43:55', '2025-10-09 11:59:21'),
(80, 2, 7, 'INV-2-7-1760011179847', 175000.00, 'paid', NULL, 'https://sandbox.duitku.com/topup/v2/TopUpCreditCardPayment.aspx?reference=DS25188256PG1CDJBYXNC0KB', NULL, '2025-10-09 12:02:15', '2025-10-10 04:59:39', '2025-10-09 11:59:39', '2025-10-09 12:02:15');

-- --------------------------------------------------------

--
-- Table structure for table `sekolah`
--

CREATE TABLE `sekolah` (
  `id` int NOT NULL,
  `nama` varchar(255) NOT NULL,
  `alamat` text NOT NULL,
  `telp` varchar(50) DEFAULT NULL,
  `deskripsi` text,
  `gambar` varchar(500) DEFAULT NULL,
  `jenjang` enum('SMP','SMA','SMK') NOT NULL,
  `kode_lemdik` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sekolah`
--

INSERT INTO `sekolah` (`id`, `nama`, `alamat`, `telp`, `deskripsi`, `gambar`, `jenjang`, `kode_lemdik`) VALUES
(1, 'SMK Antartika 1 Sidoarjo', 'Jl. Raya Sidoarjo No.1, Sidoarjo, Jawa Timur', '031-1234567', 'SMK Antartika 1 Sidoarjo berlokasi di pusat kota Sidoarjo.', 'https://radarjatim.id/wp-content/uploads/2024/07/WhatsApp-Image-2024-07-15-at-10.48.34.jpeg', 'SMK', 1),
(2, 'SMK Antartika 2 Sidoarjo', 'Jl. Diponegoro No.10, Sidoarjo, Jawa Timur', '031-7654321', 'SMK Antartika 2 Sidoarjo fokus pada pengembangan teknologi dan bisnis.', 'https://smkantartika2-sda.sch.id/wp-content/uploads/2025/03/image-392x272.png', 'SMK', 2),
(3, 'SMA Antartika Sidoarjo', 'Jl. Pahlawan No.5, Sidoarjo', '031-9876543', 'SMA Antartika Sidoarjo unggul di bidang akademik dan non-akademik.', 'https://smaantarda.sch.id/wp-content/uploads/2024/08/2023-07-06.jpg', 'SMA', 3),
(4, 'SMA Antartika Surabaya', 'Jl. Ahmad Yani No.99, Surabaya', '031-111222', 'SMA Antartika Surabaya terkenal dengan program internasional.', 'https://lh5.googleusercontent.com/p/AF1QipO_bti3gDPnkOoUYW3HMx4vd-b0eUG3xsYziwlD=w408-h306-k-no', 'SMA', 4),
(5, 'SMP Antartika Surabaya', 'Jl. Mayjen Sungkono No.8, Surabaya', '031-333444', 'SMP Antartika Surabaya memberikan pendidikan berbasis karakter.', 'https://lh5.googleusercontent.com/p/AF1QipMG4mLzz5CvVLRjgxkdhv01ETYT1WRoQ0eCHUbh=w203-h360-k-no', 'SMP', 5),
(7, 'placeholder', 'lorem ipsum dolor sit amet', '1-888-8888', 'lorem ipsum dolor sit amet', 'https://i.pinimg.com/474x/a7/ff/3f/a7ff3f9d1acd77d2a90a143f543a1885.jpg', 'SMK', 67);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `wa` varchar(20) NOT NULL,
  `nisn` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sekolah_id` int NOT NULL,
  `jurusan` enum('DKV','RPL','TM','TKJ','AKUTANSI','PB') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `nama`, `tanggal_lahir`, `wa`, `nisn`, `created_at`, `sekolah_id`, `jurusan`) VALUES
(1, 'ItzYchXD@gmail.com', '$2y$10$kzLvTT8AH.KBuikf.rRguuQ55vERlRJDBaoqs5ofAhgtc2y0jwa.2', 'beliau knp jir', '2005-12-24', '+628888888888', '3456789987654323456', '2025-09-26 10:44:03', 7, 'DKV'),
(2, 'ych.cpm@gmail.com', '$2b$10$qUVImFL/RKi2g14NB9YVH.6cE7SG.D4OSjRgvNT.SJXI0FxjkrrW2', 'halo kakak dan mbak mbak', '2008-12-11', '+6287886820365', '9498488743', '2025-09-26 13:39:30', 3, 'DKV'),
(3, 'ych08.cpm2@gmail.com', '$2b$10$RIiSlRGXus9LBF7PsttQtOihDqGyy7NwigfwOyrgYgn/BO0ap.AoW', 'Yoeichi', '2008-11-13', '+6287886820365', '8787776418741741', '2025-09-27 11:43:35', 2, 'RPL'),
(4, 'Yoeichi_08@ymail.com', '$2y$10$U6JQiNj0pJbtT0INCF/zWO2WKHA56ViZsGly6XK1p2y3.tdaNSdFG', 'admin', '2000-02-13', '+6287886820365', '6586286621621142', '2025-09-28 04:13:04', 2, 'RPL'),
(5, 'ych.cpm1@gmail.com', '$2y$10$bE0OTfWSnokk9hVjBFnHQeMRSto8mYnFLip8TPXU.i/qrz83TRrOS', 'Yoeichi Zhafif Rafa Effendi', '2008-11-13', '+6285183103656', '2937296183628', '2025-09-28 05:44:55', 2, 'TKJ'),
(7, 'asasdad@gmail.com', '$2y$10$0.BxqodyQ04Z99w1SsWlIODlO4PIMCgzvNZUpAqgvuU1aMan9eOTO', 'Muhammad iqbal ramadhan al faris', '2008-09-13', '+6285746113606', '22223', '2025-09-28 07:28:20', 2, 'TM'),
(9, 'akuntiktokych@gmail.com', '$2y$10$rXRdalkBJBX5BeYBifGxM.Jqr4KXtydGz1GNJd.Nqii7HoMfdbbSG', 'Haikal', '2000-12-13', '+6298187421681', '18416274154714087', '2025-09-28 12:13:52', 2, 'AKUTANSI'),
(10, 'testpayment@gmail.com', '$2y$10$.7/eK4xkKmXJDyRxpOHybOQ/Ki4MVfLb5zO6wAKA9m2jE7b3R0.BG', 'testaccountpayment', '2000-11-04', '+621331515111', '1531155436447543664', '2025-09-28 15:59:36', 2, 'TM'),
(11, 'farisikbal304@gmail.com', '$2b$10$6lq9XdGYxmz3DDZuUSqhZe6YttgWwJj/Lj1ctrUX.LwyuhXH45K.u', 'Muhammad iqbal ramadhan al faris', '2008-09-13', '+6285746113606', '9912394300400', '2025-09-29 05:37:11', 2, 'TM'),
(12, 'roosetedei@gmail.com', '$2y$10$jW4kBeDSZ4zPx9Z268PSe.F2QmYVw1GVsHxVUO8ef2c2TsZc6Gd6G', 'kocak', '2000-12-12', '+6285668987689', '987656789098765', '2025-09-29 09:06:24', 2, 'RPL'),
(13, 'skrm@gmail.com', '$2y$10$rlE3f9w1UCcYiHcH2Ck1iOTDtqnwn3iJJI0xFKEdVZB2kKPYnVRLW', 'Tub', '2010-01-08', '+6281316023201', '351535535776', '2025-09-30 00:51:31', 2, 'RPL'),
(14, 'carissacantika00@gmail.com', '$2y$10$co2vgb3FDMzwB/QUL5SPgOHohEcIl5e.00uLPTW.5/Rs5h4UjynDW', 'azzahra alviatin', '2009-01-01', '+6287654322145', '123456789012345', '2025-10-02 08:16:30', 2, 'RPL'),
(15, 'woiwoiwoi@gmail.com', '$2b$10$bcAxYO9wMC1pBjkG8IRyyeeCtL43WEPMwzXOabYVs.0rqHbkO.mxi', 'test with full nextjs', '2008-12-11', '+621841874871248', '14214311124139', '2025-10-06 14:35:55', 2, 'PB');

-- --------------------------------------------------------

--
-- Table structure for table `user_jalur`
--

CREATE TABLE `user_jalur` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `jalur_id` int NOT NULL,
  `status` enum('pending','aktif','selesai') DEFAULT 'pending',
  `tanggal_daftar` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_jalur`
--

INSERT INTO `user_jalur` (`id`, `user_id`, `jalur_id`, `status`, `tanggal_daftar`) VALUES
(5, 2, 7, 'aktif', '2025-09-27 07:09:56'),
(6, 3, 3, 'aktif', '2025-09-27 11:45:46'),
(7, 4, 3, 'aktif', '2025-09-28 04:17:37'),
(8, 5, 8, 'aktif', '2025-09-28 05:45:46'),
(10, 7, 8, 'aktif', '2025-09-28 07:32:41'),
(11, 9, 3, 'aktif', '2025-09-28 12:14:05'),
(12, 10, 8, 'aktif', '2025-09-28 15:59:45'),
(13, 11, 8, 'aktif', '2025-09-29 05:40:28'),
(14, 12, 1, 'aktif', '2025-09-29 09:06:52'),
(15, 13, 8, 'aktif', '2025-09-30 00:52:50'),
(21, 1, 1, 'aktif', '2025-09-30 01:47:20'),
(24, 15, 8, 'aktif', '2025-10-06 15:02:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `berkas`
--
ALTER TABLE `berkas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unik_user_jenis` (`user_id`,`jenis_berkas`);

--
-- Indexes for table `data_diri`
--
ALTER TABLE `data_diri`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_data` (`user_id`);

--
-- Indexes for table `jalur`
--
ALTER TABLE `jalur`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kartu`
--
ALTER TABLE `kartu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_peserta` (`nomor_peserta`),
  ADD UNIQUE KEY `unique_user_kartu` (`user_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_id` (`invoice_id`),
  ADD KEY `jalur_id` (`jalur_id`),
  ADD KEY `idx_user_payment` (`user_id`),
  ADD KEY `idx_invoice` (`invoice_id`);

--
-- Indexes for table `sekolah`
--
ALTER TABLE `sekolah`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_lemdik` (`kode_lemdik`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_jalur`
--
ALTER TABLE `user_jalur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_jalur` (`user_id`,`jalur_id`),
  ADD KEY `jalur_id` (`jalur_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `berkas`
--
ALTER TABLE `berkas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `data_diri`
--
ALTER TABLE `data_diri`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `jalur`
--
ALTER TABLE `jalur`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `kartu`
--
ALTER TABLE `kartu`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `sekolah`
--
ALTER TABLE `sekolah`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `user_jalur`
--
ALTER TABLE `user_jalur`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `berkas`
--
ALTER TABLE `berkas`
  ADD CONSTRAINT `berkas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `data_diri`
--
ALTER TABLE `data_diri`
  ADD CONSTRAINT `data_diri_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kartu`
--
ALTER TABLE `kartu`
  ADD CONSTRAINT `kartu_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pembayaran_ibfk_2` FOREIGN KEY (`jalur_id`) REFERENCES `jalur` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_jalur`
--
ALTER TABLE `user_jalur`
  ADD CONSTRAINT `user_jalur_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_jalur_ibfk_2` FOREIGN KEY (`jalur_id`) REFERENCES `jalur` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
