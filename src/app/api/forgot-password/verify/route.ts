import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const input = await req.json();
        const otp = String(input.otp ?? "").trim();
        const cookieStore = await cookies();
        const userId = cookieStore.get("reset_user_id")?.value;
        //const method = cookieStore.get("reset_method")?.value;
        const otp_verified = cookieStore.get("otp_verified")?.value;
        const user_Id = input.user_id;
        if (!otp) return NextResponse.json({ success: false, message: "OTP harus diisi" });
        if (!userId) return NextResponse.json({ success: false, message: "User ID tidak ditemukan" });

        // get latest OTP record
        const [rows]: any = await pool.execute(
            "SELECT * FROM password_resets WHERE user_id = ? ORDER BY id DESC LIMIT 1",
            [userId]
        );
        const reset = rows[0];

        if (!reset)
            return NextResponse.json({ success: false, message: "Tidak ada OTP untuk pengguna ini" });

        const now = new Date();
        const expiresAt = new Date(reset.expires_at);

        if (reset.otp === otp && expiresAt > now) {
            cookieStore.set("otp_verified", "true");
            return NextResponse.json({
                success: true,
                message: "OTP valid, silakan buat password baru.",
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "OTP salah atau sudah kadaluarsa!",
            });
        }
    } catch (err: any) {
        console.error("Verify OTP error:", err);
        return NextResponse.json({
            success: false,
            message: "Server error: " + err.message,
        });
    }
}
