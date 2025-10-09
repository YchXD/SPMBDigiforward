import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const input = await req.json();
        const method = input.method ?? "";
        const email = input.email?.trim() ?? "";
        const phone = input.phone?.trim() ?? "";
        const cookieStore = await cookies();

        if (!method || (method !== "email" && method !== "whatsapp")) {
            return NextResponse.json({ success: false, message: "Metode tidak valid" });
        }

        let user: any = null;
        if (method === "email") {
            if (!email) return NextResponse.json({ success: false, message: "Email harus diisi" });
            const [rows]: any = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
            user = rows[0];
        } else if (method === "whatsapp") {
            if (!phone) return NextResponse.json({ success: false, message: "Nomor WhatsApp harus diisi" });
            const [rows]: any = await pool.execute("SELECT id FROM users WHERE wa = ?", [phone]);
            user = rows[0];
        }

        if (!user) {
            return NextResponse.json({
                success: false,
                message: method === "email" ? "Email tidak ditemukan!" : "Nomor WhatsApp tidak ditemukan!",
            });
        }

        const userId = user.id;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // create table if not exists
        await pool.execute(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

        // insert OTP
        await pool.execute(
            `INSERT INTO password_resets (user_id, otp, expires_at, created_at)
       VALUES (?, ?, ?, NOW())`,
            [userId, otp, expiresAt]
        );

        // Send OTP
        if (method === "email") {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: `"SPMB Admin" <${process.env.MAIL_USER}>`,
                to: email,
                subject: "Kode OTP Reset Password",
                html: `<p>Kode OTP Anda adalah <b>${otp}</b>. Berlaku selama 10 menit.</p>`,
            });
            cookieStore.set("reset_user_id", userId);
            cookieStore.set("reset_method", method);
            cookieStore.set("otp_verified", "false");

            return NextResponse.json({ success: true, message: "OTP sudah dikirim ke email!", id: userId });
        } else if (method === "whatsapp") {
            const res = await fetch(
                `http://localhost:4000/send-otp?phone=${encodeURIComponent(phone)}&otp=${encodeURIComponent(String(otp))}`,
            );

            if (!res.ok) {
                return NextResponse.json({ success: false, message: "Gagal mengirim OTP WhatsApp!" });
            }
            cookieStore.set("reset_user_id", userId);
            cookieStore.set("reset_method", method);
            cookieStore.set("otp_verified", "false");

            return NextResponse.json({ success: true, message: "OTP sudah dikirim ke WhatsApp!" });
        }

        return NextResponse.json({ success: false, message: "Metode tidak dikenali" });
    } catch (err: any) {
        console.error("OTP error:", err);
        return NextResponse.json({ success: false, message: "Server error: " + err.message });
    }
}
