import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Expire the JWT cookie
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    response.cookies.set({
      name: "token",
      value: "",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0), // instantly expire
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
