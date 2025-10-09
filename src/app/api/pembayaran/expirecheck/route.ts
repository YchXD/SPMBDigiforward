import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function safeParam(value: any) {
    return value === undefined ? null : value;
}

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

export async function GET() {
    try {
        const userId = await getUserIdFromCookie();
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Fetch all invoices for this user
        const [rows]: [any[], any] = await pool.execute(
            `
  SELECT p.*, j.nama AS jalur_nama, j.biaya AS jalur_biaya
  FROM pembayaran p
  JOIN jalur j ON p.jalur_id = j.id
  WHERE p.user_id = ?
  ORDER BY p.created_at DESC
  `,
            [safeParam(userId)]
        );

        if (rows.length > 0) {
            const hasPaid = rows.some((p) => p.status === "paid");
            const hasPending = rows.some((p) => p.status === "pending");

            if (hasPaid) {
                // If any paid exists, no retries allowed at all
                for (const payment of rows) payment.allowRetry = false;
            } else if (hasPending) {
                // If a pending invoice exists, don't allow retries either
                for (const payment of rows) payment.allowRetry = false;
            } else {
                // Otherwise mark only the most recent expired invoice
                let retryMarked = false;
                for (const payment of rows) {
                    if (payment.status === "expired" && !retryMarked) {
                        payment.allowRetry = true;
                        retryMarked = true;
                    } else {
                        payment.allowRetry = false;
                    }
                }
            }
        }

        return NextResponse.json({ success: true, data: rows });

    } catch (err: any) {
        console.error("Payment GET error:", err);
        return NextResponse.json(
            { success: false, message: "Server error: " + err.message },
            { status: 500 }
        );
    }
}
