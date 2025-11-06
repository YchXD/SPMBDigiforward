import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        //console.log("Decoded JWT:", decoded);

        // const userId = decoded.user?.id;

        // function safeParam(value: any) {
        //     return value === undefined ? null : value;
        // }

        const [jurusan] = await pool.execute(
            `SELECT * FROM jurusan`
        );
        const jurusan_rows = (jurusan as any[]);
        if (jurusan != null) {
            return NextResponse.json({
                success: true,
                jurusan_rows,
            });
        } else {
            return NextResponse.json({
                success: false,
                jurusan_rows: null,
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
