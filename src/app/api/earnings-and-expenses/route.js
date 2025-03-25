import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const rentals = await prisma.rental.findMany({
      //   where: { isPickedUp: true },
    });

    const expenses = await prisma.expense.findMany();

    const months = new Set();

    const paymentModes = [
      "GCASH",
      "Maya",
      "GoTyme",
      "BPI",
      "BDO",
      "UnionBank",
      "Metrobank",
      "Cash",
    ];

    const summary = {};

    // Earnings
    rentals.forEach((rental) => {
      const monthKey = new Date(rental.pickupDate).toISOString().slice(0, 7);
      months.add(monthKey);

      if (!summary[monthKey]) {
        summary[monthKey] = {};
        paymentModes.forEach((mode) => {
          summary[monthKey][mode] = { earnings: 0, expenses: 0 };
        });
      }

      if (rental.downPaymentMode) {
        summary[monthKey][rental.downPaymentMode].earnings +=
          Number(rental.downPayment) || 0;
      }
      if (rental.finalPaymentMode) {
        summary[monthKey][rental.finalPaymentMode].earnings +=
          Number(rental.finalPayment) || 0;
      }
    });

    // Expenses
    expenses.forEach((expense) => {
      const monthKey = new Date(expense.createdAt).toISOString().slice(0, 7);
      months.add(monthKey);

      if (!summary[monthKey]) {
        summary[monthKey] = {};
        paymentModes.forEach((mode) => {
          summary[monthKey][mode] = { earnings: 0, expenses: 0 };
        });
      }

      if (expense.paymentMode) {
        summary[monthKey][expense.paymentMode].expenses +=
          Number(expense.amount) || 0;
      }
    });

    // Format result
    const formatted = Array.from(months)
      .sort((a, b) => new Date(a) - new Date(b))
      .map((monthKey) => {
        const monthLabel = new Date(monthKey + "-01").toLocaleString(
          "default",
          {
            month: "long",
            year: "numeric",
          }
        );

        let totalEarnings = 0;
        let totalExpenses = 0;

        paymentModes.forEach((mode) => {
          totalEarnings += summary[monthKey][mode].earnings;
          totalExpenses += summary[monthKey][mode].expenses;
        });

        return {
          month: monthKey,
          monthLabel,
          totalEarnings,
          totalExpenses,
          breakdown: summary[monthKey],
        };
      });

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error fetching earnings/expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
