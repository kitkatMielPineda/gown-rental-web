import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** 📌 GET: Fetch upcoming rentals & appointments (sorted by earliest) */
export async function GET() {
  try {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    // Fetch upcoming rentals
    const rentals = await prisma.rental.findMany({
      where: { pickupDate: { gte: today, lte: sevenDaysLater } },
      select: {
        id: true,
        name: true,
        pickupDate: true,
        type: "rental", // Add a type identifier
      },
    });

    // Fetch upcoming appointments
    const appointments = await prisma.appointment.findMany({
      where: { date: { gte: today, lte: sevenDaysLater } },
      select: {
        id: true,
        name: true,
        date: true,
        type: "appointment", // Add a type identifier
      },
    });

    // Convert rentals' pickupDate to `date` for unified sorting
    const formattedRentals = rentals.map((r) => ({
      id: r.id,
      name: r.name,
      date: r.pickupDate,
      type: "Rental", // Label for UI
    }));

    // Convert appointments' `date` for unified format
    const formattedAppointments = appointments.map((a) => ({
      id: a.id,
      name: a.name,
      date: a.date,
      type: "Appointment", // Label for UI
    }));

    // Merge and sort by earliest date/time
    const combinedList = [...formattedRentals, ...formattedAppointments].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return NextResponse.json(combinedList, { status: 200 });
  } catch (error) {
    console.error("Error fetching quick preview:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
