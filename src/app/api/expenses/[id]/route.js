import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH: Update a single expense
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { amount, paymentMode, description, date } = body;

    const updated = await prisma.expense.update({
      where: { id },
      data: {
        amount: parseFloat(amount),
        paymentMode,
        description,
        createdAt: date ? new Date(date) : undefined,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Failed to update expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}
