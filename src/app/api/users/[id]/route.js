import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** 📌 GET: Fetch a User by ID */
export async function GET(req, { params }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/** 📌 PUT: Update a User */
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { name, email, password },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

/** 📌 DELETE: Remove a User */
export async function DELETE(req, { params }) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
