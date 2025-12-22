import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Шаардлагатай мэдээлэл дутуу байна" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry) {
      return NextResponse.json(
        { error: "Буруу эсвэл хүчингүй токен байна" },
        { status: 400 }
      );
    }

    if (user.resetTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Токены хүчинтэй хугацаа дууссан байна" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: "Нууц үг амжилттай солигдлоо",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Алдаа гарлаа. Дахин оролдоно уу." },
      { status: 500 }
    );
  }
}
