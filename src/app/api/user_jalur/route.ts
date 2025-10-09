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

        const userId = decoded.user?.id;

        function safeParam(value: any) {
            return value === undefined ? null : value;
        }

        const [userJalur] = await pool.execute(
            `
      SELECT j.* 
            FROM user_jalur uj
            INNER JOIN jalur j ON uj.jalur_id = j.id
            WHERE uj.user_id = ? AND uj.status = 'aktif'
            LIMIT 1
      `,
            [safeParam(userId)]
        );
        const user_jalur = (userJalur as any[])[0];
        if (userJalur != null) {
            return NextResponse.json({
                success: true,
                user_jalur,
            });
        } else {
            return NextResponse.json({
                success: false,
                user_jalur: null,
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
