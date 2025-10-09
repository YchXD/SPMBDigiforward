import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Load secret key from environment variable
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Example: GET /api/auth/session
export async function GET(req: NextRequest) {
  try {
    // Read cookies (token)
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify JWT
    const decoded = jwt.verify(token, SECRET_KEY) as { user: any };

    return NextResponse.json({
      success: true,
      user: decoded.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
