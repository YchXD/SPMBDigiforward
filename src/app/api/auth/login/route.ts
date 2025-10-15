import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    const email = input.email || "";
    const password = input.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    const conn = await pool.getConnection();
    console.log("✅ Connected to DB");
    const [rows]: any = await pool.execute(
      "SELECT id, email, password, nama FROM users WHERE email = ?",
      [email]
    );
    conn.release();
    console.log("✅ Query executed:", rows);

    const user = rows[0];
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah" },
        { status: 401 }
      );
    }
    const hash = user.password.replace(/^\$2y\$/, "$2a$");
    const match = await bcrypt.compare(password, hash);
    if (!match) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // === Create JWT ===
    const token = jwt.sign(
      { user: { id: user.id, email: user.email, nama: user.nama } },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    // === Return response with cookie ===
    const res = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: { id: user.id, email: user.email, nama: user.nama },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    return res;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Database error: " + err.message },
      { status: 500 }
    );
  }
}
