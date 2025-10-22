import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/lib/db";

const MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE || "";
const API_KEY = process.env.DUITKU_API_KEY || "";

export async function POST(req: NextRequest) {
  const logPrefix = new Date().toISOString();
  const logs: string[] = [];

  try {
    const rawBody = await req.text();
    logs.push(`${logPrefix} - RAW: ${rawBody}`);

    // Duitku sometimes sends application/x-www-form-urlencoded
    const params = new URLSearchParams(rawBody);
    const data = Object.fromEntries(params.entries());

    if (!data || Object.keys(data).length === 0) {
      logs.push(`${logPrefix} - ERROR: Data kosong`);
      return NextResponse.json({ error: "INVALID" }, { status: 400 });
    }

    const { amount, merchantOrderId, signature } = data;

    // === Signature Validation ===
    const expectedSignature = crypto
      .createHash("md5")
      .update(`${MERCHANT_CODE}${amount}${merchantOrderId}${API_KEY}`)
      .digest("hex");

    logs.push(
      `${logPrefix} - SIGNATURE CHECK: expected=${expectedSignature}, got=${signature}`
    );

    if (signature !== expectedSignature) {
      logs.push(`${logPrefix} - ERROR: Invalid signature`);
      return NextResponse.json({ error: "INVALID SIGNATURE" }, { status: 400 });
    }

    // === Update database ===
    try {
      const [result] = await pool.execute(
        "UPDATE pembayaran SET status = 'paid', paid_at = NOW() WHERE invoice_id = ?",
        [merchantOrderId]
      );
      logs.push(`${logPrefix} - DB UPDATED: ${JSON.stringify(data)}`);
      console.log("Duitku callback received:", data);
    } finally {
    }

    await writeLog(logs);
    console.log("merchantOrderId from Duitku:", merchantOrderId);
    return NextResponse.json({ message: "SUCCESS" });
  } catch (err: any) {
    logs.push(`${logPrefix} - ERROR: ${err.message}`);
    await writeLog(logs);
    return NextResponse.json({ error: "DB ERROR" }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  return NextResponse.json({ error: "THIS IS ONLY FOR POST" }, { status: 400 });
}

// Helper: write logs to file (like callback_log.txt)
import fs from "fs";
import path from "path";
async function writeLog(lines: string[]) {
  const logFile = path.join(process.cwd(), "callback_log.txt");
  await fs.promises.appendFile(logFile, lines.join("\n") + "\n", "utf8");
  try {
    // Ensure file exists
    await fs.promises.mkdir(path.dirname(logFile), { recursive: true });
    await fs.promises.appendFile(logFile, lines.join("\n") + "\n", "utf8");
  } catch (err) {
    console.error("Failed to write callback log:", err);
  }
}
