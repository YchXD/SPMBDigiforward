import { NextResponse } from "next/server";
import { cookies } from "next/headers";
//import { authOptions } from "@/lib/auth"; // adjust if using next-auth
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

async function getUserIdFromCookie() {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.user?.id ?? null;
    } catch {
        return null;
    }
}

export async function GET() {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const conn = await pool.getConnection();

  try {
    // Fetch kartu info
    const [kartuRows]: any = await conn.execute(
      `SELECT k.*, u.nama, u.email, u.wa, u.jurusan, s.nama AS sekolah_nama
       FROM kartu k
       JOIN users u ON k.user_id = u.id
       LEFT JOIN sekolah s ON u.sekolah_id = s.id
       WHERE k.user_id = ?`,
      [userId]
    );

    const kartu = kartuRows[0];
    if (!kartu) {
      return NextResponse.json({ success: false, data: null });
    }

    // Fetch foto berkas
    const [berkasRows]: any = await conn.execute(
      `SELECT jenis_berkas, nama_file, path_file, ukuran_file, uploaded_at FROM berkas WHERE user_id = ? AND jenis_berkas = 'foto' ORDER BY jenis_berkas ASC`,
      [userId]
    );

    const berkas = berkasRows[0];
    if (berkas) berkas.filename = berkas.path_file?.split("/").pop();

    return NextResponse.json({
      success: true,
      data: { ...kartu, ...(berkas || {}) },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Database error: ${error.message}` },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}

export async function POST(req: Request) {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const conn = await pool.getConnection();
  const { action } = await req.json();

  if (action !== "generate") {
    return NextResponse.json({ success: false, message: "Invalid action" });
  }

  try {
    // Check if user has paid
    const [paymentCheckRows]: any = await conn.execute(
      `SELECT COUNT(*) AS paid_count FROM pembayaran WHERE user_id = ? AND status = 'paid'`,
      [userId]
    );

    if (paymentCheckRows[0].paid_count === 0) {
      return NextResponse.json({
        success: false,
        message: "Selesaikan pembayaran terlebih dahulu",
      });
    }

    // Generate nomor peserta
    const nomorPeserta = `${new Date().getFullYear()}-${String(userId).padStart(5, "0")}`;

    // Insert or update kartu
    await conn.execute(
      `INSERT INTO kartu (user_id, nomor_peserta, status)
       VALUES (?, ?, 'active')
       ON DUPLICATE KEY UPDATE
         nomor_peserta = VALUES(nomor_peserta),
         status = VALUES(status),
         generated_at = NOW()`,
      [userId, nomorPeserta]
    );

    return NextResponse.json({
      success: true,
      message: "Kartu peserta berhasil dibuat",
      nomor_peserta: nomorPeserta,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Database error: ${error.message}` },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
