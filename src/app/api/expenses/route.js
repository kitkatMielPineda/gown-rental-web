import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ POST: Add new expense
export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, paymentMode, description, createdAt } = body;

    if (!amount || !paymentMode || !description) {
      return NextResponse.json(
        {
          error: "All fields are required (except date, which defaults to now)",
        },
        { status: 400 }
      );
    }

    const newExpense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        paymentMode, // enum value
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error("Error saving expense:", error);
    return NextResponse.json(
      { error: "Failed to save expense" },
      { status: 500 }
    );
  }
}

// ✅ GET: List all expenses
export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}
