export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 📊 Fetch earnings per mode of payment for current month
    const rentals = await prisma.rental.findMany({
      where: {
        isPickedUp: true,
        pickupDate: { gte: startOfMonth },
      },
    });

    const earnings = rentals.reduce((acc, rental) => {
      const mode = rental.finalPaymentMode || "Unknown";
      acc[mode] = (acc[mode] || 0) + (rental.finalPayment || 0);
      return acc;
    }, {});

    // 📉 Fetch total expenses for current month
    const expenses = await prisma.expense.findMany({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });

    const expenseSummary = expenses.reduce((acc, expense) => {
      const mode = expense.mode || "Unknown";
      acc[mode] = (acc[mode] || 0) + (expense.amount || 0);
      return acc;
    }, {});

    return NextResponse.json(
      { earnings, expenses: expenseSummary },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
