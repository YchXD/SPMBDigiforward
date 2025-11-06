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

        // const userId = decoded.user?.id;

        // function safeParam(value: any) {
        //     return value === undefined ? null : value;
        // }

        const [kelulusan] = await pool.execute(
            // `SELECT * FROM kelulusan WHERE status = 'lulus'`
            `SELECT
                k.id,
                k.user_id,
                u.nomor_peserta,
                k.status,
                k.diumumkan_at
            FROM kelulusan k
            LEFT JOIN kartu u
                ON k.user_id = u.user_id
            WHERE u.nomor_peserta != 'null';
            `
        );
        const kelulusan_rows = (kelulusan as any[]);
        if (kelulusan != null) {
            return NextResponse.json({
                success: true,
                kelulusan_rows,
            });
        } else {
            return NextResponse.json({
                success: false,
                kelulusan_rows: null,
            });
        }

    } catch (err: any) {
        console.error("User API error:", err);
        return NextResponse.json(
            { success: false, message: "Server error: " + err.message },
            { status: 500 }
        );
    }
}
