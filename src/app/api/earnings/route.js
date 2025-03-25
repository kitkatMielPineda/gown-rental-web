import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const rentals = await prisma.rental.findMany(); // ✅ Fetch all rentals regardless of isPickedUp

    const expenses = await prisma.expense.findMany();

    const groupedEarnings = {};
    const groupedExpenses = {};

    rentals.forEach((rental) => {
      const date = new Date(rental.pickupDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!groupedEarnings[monthKey]) {
        groupedEarnings[monthKey] = {
          GCASH: 0,
          Maya: 0,
          GoTyme: 0,
          BPI: 0,
          BDO: 0,
          UnionBank: 0,
          Metrobank: 0,
          Cash: 0,
        };
      }

      // Add down payment
      if (rental.downPaymentMode) {
        groupedEarnings[monthKey][rental.downPaymentMode] += Number(
          rental.downPayment || 0
        );
      }

      // Add final payment
      if (rental.finalPaymentMode) {
        groupedEarnings[monthKey][rental.finalPaymentMode] += Number(
          rental.finalPayment || 0
        );
      }
    });

    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!groupedExpenses[monthKey]) {
        groupedExpenses[monthKey] = 0;
      }

      groupedExpenses[monthKey] += Number(expense.amount || 0);
    });

    return NextResponse.json(
      { earnings: groupedEarnings, expenses: groupedExpenses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching earnings/expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch earnings data" },
      { status: 500 }
    );
  }
}
