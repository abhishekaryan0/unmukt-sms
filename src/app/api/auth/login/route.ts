import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, portal } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query user with customer profile
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        customer: true,
        agency: true,
      },
    });

    if (!user || user.passwordHash !== password) {
      return NextResponse.json(
        { success: false, error: "Invalid email address or passcode" },
        { status: 401 }
      );
    }

    // Role check depending on portal
    if (portal === "admin" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied. Administrator privileges required." },
        { status: 403 }
      );
    }

    if (portal === "client" && user.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Please use the Admin Portal for administrator accounts." },
        { status: 403 }
      );
    }

    const session = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role === "SUPER_ADMIN" ? "super_admin" : "client",
      businessName: user.customer?.businessName || (user.role === "SUPER_ADMIN" ? "SMS Unmukt Platform" : "Business Account"),
      category: user.customer?.businessCategory || "Enterprise",
      phone: user.customer?.mobile || "+91 98112 34567",
      avatar: user.avatar,
      token: `jwt_pg_${user.id}_${Date.now()}`,
    };

    const response = NextResponse.json({
      success: true,
      session,
      customer: user.customer,
    });

    // Set auth cookie safely encoded
    const cookieName = user.role === "SUPER_ADMIN" ? "smsunmukt_admin_session" : "smsunmukt_client_session";
    response.cookies.set(cookieName, encodeURIComponent(JSON.stringify(session)), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
