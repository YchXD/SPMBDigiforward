import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

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
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [jalurRows] = await pool.execute(
      "SELECT * FROM jalur ORDER BY periode_mulai ASC"
    );

    return NextResponse.json({ success: true, data: jalurRows });
  } catch (err: any) {
    console.error("Jalur GET error:", err);
    return NextResponse.json(
      { success: false, message: "Database error: " + err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const jalur_id = body.jalur_id ?? null;

    if (!jalur_id) {
      return NextResponse.json(
        { success: false, message: "Jalur ID harus diisi" },
        { status: 400 }
      );
    }

    // ✅ Check jalur exists and active
    const [jalurRows] = await pool.execute(
      "SELECT * FROM jalur WHERE id = ? AND status = 'aktif'",
      [jalur_id]
    );
    const jalur = (jalurRows as any[])[0];
    if (!jalur) {
      return NextResponse.json({
        success: false,
        message: "Jalur tidak ditemukan atau tidak aktif",
      });
    }

    // ✅ Check if user already selected a jalur
    const [userJalurRows] = await pool.execute(
      "SELECT id FROM user_jalur WHERE user_id = ?",
      [userId]
    );
    if ((userJalurRows as any[]).length > 0) {
      return NextResponse.json({
        success: false,
        message: "Anda sudah memilih jalur pendaftaran",
      });
    }

    // ✅ Insert user_jalur
    await pool.execute(
      "INSERT INTO user_jalur (user_id, jalur_id, status) VALUES (?, ?, 'aktif')",
      [userId, jalur_id]
    );

    return NextResponse.json({
      success: true,
      message: "Jalur berhasil dipilih",
    });
  } catch (err: any) {
    console.error("Jalur POST error:", err);
    return NextResponse.json(
      { success: false, message: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
