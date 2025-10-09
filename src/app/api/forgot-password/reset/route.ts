import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const user_id = cookieStore.get("reset_user_id")?.value;
  const method = cookieStore.get("reset_method")?.value;
  const otp_verified = cookieStore.get("otp_verified")?.value === "true";
  console.log(user_id,method,otp_verified)

  const { newPassword } = await req.json();

  if (!newPassword) {
    return NextResponse.json({ success: false, message: "Password baru harus diisi" });
  }

  if (!user_id || !otp_verified) {
    return NextResponse.json({ success: false, message: "Session tidak valid" });
  }

  if (method === "email" && !method) {
    return NextResponse.json({ success: false, message: "Session tidak valid ERR Method" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [updateResult] = await pool.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, user_id]
    );

    // Delete reset token
    await pool.execute("DELETE FROM password_resets WHERE user_id = ?", [user_id]);

    return NextResponse.json({
      success: true,
      message: "Password berhasil direset",
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: "Database error: " + err.message,
    });
  }
}
