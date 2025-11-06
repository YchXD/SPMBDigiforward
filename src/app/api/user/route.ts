import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }
    //console.log("Decoded JWT:", decoded);

    const userId = decoded.user?.id;

    function safeParam(value: any) {
        return value === undefined ? null : value;
    }

    const [userRows] = await pool.execute(
      `
      SELECT u.id,u.email,u.nama,u.tanggal_lahir,u.jurusan, s.nama AS sekolah_nama
      FROM users u
      LEFT JOIN sekolah s ON u.sekolah_id = s.id
      WHERE u.id = ?
      `,
      [safeParam(userId)]
    );
    const user = (userRows as any[])[0];

    const [jalurRows] = await pool.execute(
      `
      SELECT uj.*, j.nama AS jalur_nama
      FROM user_jalur uj
      JOIN jalur j ON uj.jalur_id = j.id
      WHERE uj.user_id = ?
      `,
      [safeParam(userId)]
    );
    const jalur = (jalurRows as any[])[0] ?? null;

    const [dataDiriRows] = await pool.execute(
      `SELECT id FROM data_diri WHERE user_id = ?`,
      [safeParam(userId)]
    );
    const data_diri_complete = (dataDiriRows as any[]).length > 0;

    const [berkasRows] = await pool.execute(
      `SELECT COUNT(*) AS uploaded_count FROM berkas WHERE user_id = ?`,
      [safeParam(userId)]
    );
    const berkas_count = (berkasRows as any[])[0]?.uploaded_count ?? 0;

    const [paymentRows] = await pool.execute(
      `
      SELECT status FROM pembayaran
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [safeParam(userId)]
    );
    const payment_status = (paymentRows as any[])[0]?.status ?? "none";

    const [kartuRows] = await pool.execute(
      `SELECT id FROM kartu WHERE user_id = ? AND status = 'active'`,
      [safeParam(userId)]
    );
    const kartu_generated = (kartuRows as any[]).length > 0;

    const [kelulusanRows] = await pool.execute(
      `SELECT status FROM kelulusan WHERE user_id = ?`,
      [safeParam(userId)]
    );
    const kelulusan = (kelulusanRows as any[])[0] ?? null;

    return NextResponse.json({
      success: true,
      data: {
        user,
        jalur,
        data_diri_complete,
        berkas_count,
        payment_status,
        kartu_generated,
        kelulusan
      },
    });
  } catch (err: any) {
    console.error("User API error:", err);
    return NextResponse.json(
      { success: false, message: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
