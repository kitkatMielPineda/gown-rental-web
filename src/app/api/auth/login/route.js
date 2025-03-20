import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const prisma = new PrismaClient();
const SECRET_KEY = "your_secret_key"; // Change this in production!

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Login Request:", body);
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Debug Prisma Connection
    const testConnection = await prisma.$queryRaw`SELECT 1`;
    console.log("Prisma Connected:", testConnection);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.trim() || "" },
    });
    console.log("User found:", user);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return NextResponse.json(
      { message: "Login successful", token, user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 });
  }
}
