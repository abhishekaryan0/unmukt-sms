import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/crypto";

// In-memory OTP storage for password resets (simulating SMS / WhatsApp OTP delivery)
const resetOtpStore = new Map<string, { otp: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action = "request_otp", identifier, otp, newPassword } = body;

    const cleanIdentifier = String(identifier || "").trim().toLowerCase();
    const cleanMobile = cleanIdentifier.replace(/\D/g, "").slice(-10);

    if (!cleanIdentifier) {
      return NextResponse.json(
        { success: false, error: "Please provide your registered email address or 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Step 1: Request OTP
    if (action === "request_otp") {
      // Find user by email or by customer profile's mobile
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: cleanIdentifier },
            cleanMobile.length === 10 ? { customer: { mobile: cleanMobile } } : {},
          ],
        },
        include: { customer: true },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "No account found matching this email or mobile number." },
          { status: 404 }
        );
      }

      // Generate 6-digit OTP
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      resetOtpStore.set(user.email, { otp: generatedOtp, expiresAt });
      if (user.customer?.mobile) {
        resetOtpStore.set(user.customer.mobile, { otp: generatedOtp, expiresAt });
      }

      return NextResponse.json({
        success: true,
        message: `Verification code sent to registered mobile (${user.customer?.mobile ? `+91 ${user.customer.mobile.slice(0, 3)}****${user.customer.mobile.slice(-3)}` : user.email})`,
        // In local/sandbox development we surface the demo OTP for ease of testing
        hintOtp: generatedOtp,
      });
    }

    // Step 2: Verify OTP & Reset Password
    if (action === "reset_password") {
      if (!otp || String(otp).trim().length !== 6) {
        return NextResponse.json(
          { success: false, error: "Please enter a valid 6-digit verification code." },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      // Verify OTP
      const stored = resetOtpStore.get(cleanIdentifier) || (cleanMobile.length === 10 ? resetOtpStore.get(cleanMobile) : null);
      if (!stored) {
        return NextResponse.json(
          { success: false, error: "Verification code expired or not requested. Please request a new code." },
          { status: 400 }
        );
      }

      if (Date.now() > stored.expiresAt) {
        resetOtpStore.delete(cleanIdentifier);
        return NextResponse.json(
          { success: false, error: "Verification code has expired. Please request a new one." },
          { status: 400 }
        );
      }

      if (stored.otp !== String(otp).trim()) {
        return NextResponse.json(
          { success: false, error: "Invalid verification code. Please check and try again." },
          { status: 400 }
        );
      }

      // Find user
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: cleanIdentifier },
            cleanMobile.length === 10 ? { customer: { mobile: cleanMobile } } : {},
          ],
        },
      });

      if (!user) {
        return NextResponse.json({ success: false, error: "User account not found." }, { status: 404 });
      }

      // Hash new password using PBKDF2
      const newPasswordHash = hashPassword(newPassword);

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });

      // Clear OTP
      resetOtpStore.delete(cleanIdentifier);
      if (cleanMobile.length === 10) resetOtpStore.delete(cleanMobile);

      return NextResponse.json({
        success: true,
        message: "Your password has been reset successfully. You can now log in.",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
