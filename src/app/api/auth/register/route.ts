import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      nama,
      tanggal_lahir,
      wa,
      nisn,
      lemdik,
      jurusan,
      // jurusanbackup,
    } = body;

    if (
      !email ||
      !password ||
      !nama ||
      !tanggal_lahir ||
      !wa ||
      !nisn ||
      !lemdik ||
      !jurusan
    ) {
      return NextResponse.json(
        { success: false, message: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    const [schoolRows] = await pool.execute(
      "SELECT id FROM sekolah WHERE kode_lemdik = ?",
      [lemdik]
    );
    const school = (schoolRows as any[])[0];
    if (!school) {
      return NextResponse.json({
        success: false,
        message: "Sekolah tidak ditemukan",
      });
    }

    const sekolah_id = school.id;

    const [emailRows] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    if ((emailRows as any[]).length > 0) {
      return NextResponse.json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    const [nisnRows] = await pool.execute("SELECT id FROM users WHERE nisn = ?", [nisn]);
    if ((nisnRows as any[]).length > 0) {
      return NextResponse.json({
        success: false,
        message: "nisn sudah digunakan untuk pendaftaran",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [insertResult]: any = await pool.execute(
      `INSERT INTO users (email, password, nama, tanggal_lahir, wa, nisn, sekolah_id, jurusan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, nama, tanggal_lahir, wa, nisn, sekolah_id, jurusan]
    );
    await pool.execute(
      "UPDATE jalur SET kuota = kuota - 1 WHERE nama = ?",
      [jurusan]
    );

    const newUserId = insertResult.insertId;

    const token = jwt.sign(
      { user: { id: newUserId, email, nama } },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil",
      user: { id: newUserId, email, nama },
    });

    response.cookies.set({
      name: "token",
      value: token,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, 
    });

    return response;
  } catch (err: any) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, message: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
