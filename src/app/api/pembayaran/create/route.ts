import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const merchantCode = process.env.DUITKU_MERCHANT_CODE || "";
const apiKey = process.env.DUITKU_API_KEY || "";
const productDetails = "Pembayaran PPDB";
const email = "user@email.com";
const phoneNumber = "08123456789";
const callbackUrl = process.env.TUNNEL + "/api/pembayaran/callback";
const returnUrl = process.env.TUNNEL + "/dashboard/datadiri";

function safeParam(value: any) {
  return value === undefined ? null : value;
}

async function getUserIdFromCookie() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    //console.log(decoded)
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

    return NextResponse.json({ success: true, data: rows });
  } catch (err: any) {
    console.error("Payment GET error:", err);
    return NextResponse.json(
      { success: false, message: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const action = body.action ?? "";
    console.log("action received:", action);

    if (action === "create_payment") {
      const jalur_id = body.jalur_id;
      if (!jalur_id) {
        return NextResponse.json({ success: false, message: "Jalur ID harus diisi" });
      }

      // Get jalur info
      const [jalurRows]: any = await pool.execute(
        "SELECT * FROM jalur WHERE id = ? AND status = 'aktif'",
        [safeParam(jalur_id)]
      );
      const jalur = jalurRows[0];
      if (!jalur) {
        return NextResponse.json({ success: false, message: "Jalur tidak ditemukan atau tidak aktif" });
      }

      // Check if payment already exists
      const [exists]: any = await pool.execute(
        "SELECT id FROM pembayaran WHERE user_id = ? AND jalur_id = ? AND status != 'failed'",
        [safeParam(userId), safeParam(jalur_id)]
      );
      // if (exists.length > 0) {
      //   return NextResponse.json({ success: false, message: "Pembayaran sudah ada" });
      // }

      // Create new payment
      const invoice_id = `INV-${userId}-${jalur_id}-${Date.now()}`;
      const amount = jalur.biaya;
      const expired_at = new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await pool.execute(
        "INSERT INTO pembayaran (user_id, jalur_id, invoice_id, amount, expired_at) VALUES (?, ?, ?, ?, ?)",
        [safeParam(userId), safeParam(jalur_id), invoice_id, amount, expired_at]
      );

      const paymentAmount = Math.round(amount);
      const merchantOrderId = invoice_id;
      const signature = crypto
        .createHash("md5")
        .update(merchantCode + merchantOrderId + paymentAmount + apiKey)
        .digest("hex");

      const params = {
        merchantCode,
        paymentAmount,
        merchantOrderId,
        productDetails,
        email,
        phoneNumber,
        callbackUrl,
        returnUrl,
        signature,
        paymentMethod: "VC",
      };

      const res = await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const result = await res.json();
      const payment_url = result?.paymentUrl || null;

      await pool.execute("UPDATE pembayaran SET payment_url = ? WHERE invoice_id = ?", [
        payment_url,
        invoice_id,
      ]);

      return NextResponse.json({
        success: true,
        message: "Invoice berhasil dibuat",
        data: { invoice_id, amount, payment_url, expired_at },
      });
    }

    if (action === "check_status") {
      const invoice_id = body.invoice_id;
      const [rows]: any = await pool.execute(
        "SELECT * FROM pembayaran WHERE invoice_id = ? AND user_id = ?",
        [safeParam(invoice_id), safeParam(userId)]
      );
      const payment = rows[0];
      console.log(payment)
      if (!payment) {
        return NextResponse.json({ success: false, message: "Pembayaran tidak ditemukan" });
      }

      return NextResponse.json({ success: true, data: payment });

    }

  } catch (err: any) {
    console.error("Payment POST error:", err);
    return NextResponse.json(
      { success: false, message: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
