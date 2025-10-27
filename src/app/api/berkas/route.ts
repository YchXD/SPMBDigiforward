import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";
import { put,del } from "@vercel/blob";
import { randomUUID } from "crypto";

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

        const [rows]: any = await pool.execute(
            "SELECT * FROM berkas WHERE user_id = ? ORDER BY jenis_berkas ASC",
            [userId]
        );

        return NextResponse.json({ success: true, data: rows });
    } catch (err: any) {
        console.error("GET berkas error:", err);
        return NextResponse.json(
            { success: false, message: "Database error: " + err.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = await getUserIdFromCookie();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const form = await req.formData();
        const jenis_berkas = form.get("jenis_berkas") as string;
        const file = form.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ success: false, message: "Tidak ada file yang diupload" });
        }
        if (!jenis_berkas) {
            return NextResponse.json({ success: false, message: "Jenis berkas harus diisi" });
        }

        const allowedTypes = ["kk", "akta", "ijazah", "foto", "rapor"];
        if (!allowedTypes.includes(jenis_berkas)) {
            return NextResponse.json({ success: false, message: "Jenis berkas tidak valid" });
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json({ success: false, message: "Ukuran file maksimal 2MB" });
        }

        const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
        const originalName = file.name;
        const ext = originalName.split(".").pop()?.toLowerCase() || "";

        if (!allowedExtensions.includes(ext)) {
            return NextResponse.json({ success: false, message: "Format file tidak didukung" });
        }

        if (process.env.VERCEL === "true") {
            const filename = `${jenis_berkas}_${Date.now()}_${randomUUID()}.${ext}`;
            const blobPath = `uploads/berkas/${userId}/${filename}`;

            const buffer = Buffer.from(await file.arrayBuffer());

            const { url } = await put(blobPath, buffer, {
                access: "public", 
                contentType: file.type || "application/octet-stream",
            });

            try {
                const [oldRows]: any = await pool.execute(
                    "SELECT path_file FROM berkas WHERE user_id = ? AND jenis_berkas = ?",
                    [userId, jenis_berkas]
                );
                const oldFile = oldRows[0];
                console.log(oldFile.path_file)
                // if (oldFile && fs.existsSync(path.join(process.cwd(), "public", oldFile.path_file))) {
                //     fs.unlinkSync(path.join(process.cwd(), "public", oldFile.path_file));
                // }
                await del(oldFile.path_file)

                await pool.execute(
                    `INSERT INTO berkas (user_id, jenis_berkas, nama_file, path_file, ukuran_file) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                nama_file = VALUES(nama_file), 
                path_file = VALUES(path_file), 
                ukuran_file = VALUES(ukuran_file),
                uploaded_at = NOW(),
                status = "pending"`,
                    [userId, jenis_berkas, originalName, url, file.size]
                );
            } catch {
                console.log("error check berkas route")
            }

            return NextResponse.json({ success: true, message: "Berkas berhasil diupload" });

        } else {
            const uploadDir = path.join(process.cwd(), "uploads", "berkas", String(userId));
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const filename = `${jenis_berkas}_${Date.now()}.${ext}`;
            const filepath = path.join(uploadDir, filename);


            const buffer = Buffer.from(await file.arrayBuffer());
            fs.writeFileSync(filepath, buffer);

            const relativePath = path.join("../uploads/berkas", String(userId), filename).replace(/\\/g, "/");

            try {
                const [oldRows]: any = await pool.execute(
                    "SELECT path_file FROM berkas WHERE user_id = ? AND jenis_berkas = ?",
                    [userId, jenis_berkas]
                );
                const oldFile = oldRows[0];
                if (oldFile && fs.existsSync(path.join(process.cwd(), "public", oldFile.path_file))) {
                    fs.unlinkSync(path.join(process.cwd(), "public", oldFile.path_file));
                }

                await pool.execute(
                    `INSERT INTO berkas (user_id, jenis_berkas, nama_file, path_file, ukuran_file) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                nama_file = VALUES(nama_file), 
                path_file = VALUES(path_file), 
                ukuran_file = VALUES(ukuran_file),
                uploaded_at = NOW(),
                status = "pending"`,
                    [userId, jenis_berkas, originalName, relativePath, file.size]
                );
            } finally {
                
            }
            return NextResponse.json({ success: true, message: "Berkas berhasil diupload" });
        }
    } catch (err: any) {
        console.error("POST berkas error:", err);
        return NextResponse.json(
            { success: false, message: "Server error: " + err.message },
            { status: 500 }
        );
    }
}
