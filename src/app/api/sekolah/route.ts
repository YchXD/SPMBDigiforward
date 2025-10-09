import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lemdik = searchParams.get("lemdik");

    if (!lemdik) {
      return NextResponse.json(
        { success: false, message: "Lemdik parameter is required" },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      "SELECT nama, gambar FROM sekolah WHERE kode_lemdik = ?",
      [lemdik]
    );

    const sekolah = (rows as any[])[0];

    if (sekolah) {
      return NextResponse.json({ success: true, sekolah });
    } else {
      return NextResponse.json({
        success: false,
        message: "Sekolah tidak ditemukan",
      });
    }
  } catch (err: any) {
    console.error("Sekolah API error:", err);
    return NextResponse.json(
      { success: false, message: "Database error: " + err.message },
      { status: 500 }
    );
  }
}
