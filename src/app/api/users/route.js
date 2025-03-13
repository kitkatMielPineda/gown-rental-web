import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 📌 GET: Fetch All Users */
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/** 📌 POST: Create a New User */
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: { name, email, password }, // Store hashed password in production
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
