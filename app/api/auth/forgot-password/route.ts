import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Имэйл хаяг оруулна уу" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "Хэрэв имэйл хаяг бүртгэлтэй бол сэргээх линк илгээх болно",
      });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // In production, send email here
    // For now, we'll just log the reset URL
    const resetUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/auth/reset-password?token=${resetToken}`;

    console.log("Password reset URL:", resetUrl);
    console.log("Send this to:", email);

    // TODO: Implement email sending
    // await sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({
      message: "Хэрэв имэйл хаяг бүртгэлтэй бол сэргээх линк илгээх болно",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 }
    );
  }
}
