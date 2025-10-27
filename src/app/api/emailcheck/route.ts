import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { cookies } from "next/headers";

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

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
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
