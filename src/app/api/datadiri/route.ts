// src/app/api/data_diri/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

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

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const conn = await pool.getConnection();
    try {
      // Try to get data_diri first
      const [rows]: any = await conn.execute(
        "SELECT * FROM data_diri WHERE user_id = ?",
        [userId]
      );

      let data = rows[0];
      if (!data) {
        const [userRows]: any = await conn.execute(
          "SELECT nisn, nama, wa, tanggal_lahir FROM users WHERE id = ?",
          [userId]
        );
        data = userRows[0] || {};
      }

      return NextResponse.json({ success: true, data });
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("GET error:", err);
    return NextResponse.json({ success: false, message: "Database error: " + err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const input = await req.json();
    const required = [
      "nisn",
      "tempat_lahir",
      "jenis_kelamin",
      "agama",
      "alamat",
      "no_hp",
      "asal_sekolah",
    ];

    for (const field of required) {
      if (!input[field]) {
        return NextResponse.json(
          { success: false, message: `Field ${field} harus diisi` },
          { status: 400 }
        );
      }
    }

    const dateOnly = input.tanggal_lahir.split('T')[0];

    const conn = await pool.getConnection();
    try {
      const [exists]: any = await conn.execute(
        "SELECT id FROM data_diri WHERE user_id = ?",
        [userId]
      );
      console.log(input, dateOnly)

      if (exists.length > 0) {
        await conn.execute(
          `UPDATE data_diri SET 
            nisn = ?, tempat_lahir = ?, jenis_kelamin = ?, agama = ?, alamat = ?, 
            no_hp = ?, no_hp_ortu = ?, asal_sekolah = ?, nama_ayah = ?, nama_ibu = ?, 
            pekerjaan_ayah = ?, pekerjaan_ibu = ?, penghasilan_ortu = ?, tanggal_lahir = ?, tahun_lulus = ?, nik = ?, nama_lengkap = ?, updated_at = NOW()
           WHERE user_id = ?`,
          [
            input.nisn,
            input.tempat_lahir,
            input.jenis_kelamin,
            input.agama,
            input.alamat,
            input.no_hp,
            input.no_hp_ortu || "",
            input.asal_sekolah,
            input.nama_ayah || "",
            input.nama_ibu || "",
            input.pekerjaan_ayah || "",
            input.pekerjaan_ibu || "",
            input.penghasilan_ortu || "",
            dateOnly || "",
            input.tahun_lulus || "",
            input.nik || "",
            input.nama_lengkap || "",
            userId,
          ]
        );
      } else {
        // Insert new record
        await conn.execute(
          `INSERT INTO data_diri 
            (user_id, nisn, tempat_lahir, jenis_kelamin, agama, alamat, no_hp, asal_sekolah, 
            nama_ayah, nama_ibu, pekerjaan_ayah, pekerjaan_ibu, penghasilan_ortu, no_hp_ortu, nik, tahun_lulus, tanggal_lahir, nama_lengkap)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            input.nisn,
            input.tempat_lahir,
            input.jenis_kelamin,
            input.agama,
            input.alamat,
            input.no_hp,
            input.asal_sekolah,
            input.nama_ayah || "",
            input.nama_ibu || "",
            input.pekerjaan_ayah || "",
            input.pekerjaan_ibu || "",
            input.penghasilan_ortu || "",
            input.no_hp_ortu || "",
            input.nik || "",
            input.tahun_lulus || "",
            dateOnly,
            input.nama_lengkap || ""
          ]
        );
      }

      await conn.execute(
        `UPDATE users SET nisn = ?, nama = ?, wa = ? WHERE id = ?`,
        [
          input.nisn ?? null,
          input.nama_lengkap ?? null,
          input.no_hp ?? null,
          userId ?? null
        ]
      );

      return NextResponse.json({ success: true, message: "Data diri berhasil disimpan" });
    } finally {
      conn.release();
    }
  } catch (err: any) {
    console.error("POST error:", err);
    return NextResponse.json({ success: false, message: "Database error: " + err.message }, { status: 500 });
  }
}
