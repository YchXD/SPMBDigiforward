import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { available: false, message: "No email provided" },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    const exists = (rows as any[]).length > 0;

    return NextResponse.json({
      available: !exists,
    });
  } catch (err: any) {
    console.error("Check email API error:", err);
    return NextResponse.json(
      { available: false, message: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
