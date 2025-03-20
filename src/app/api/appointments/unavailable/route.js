import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Missing date parameter" },
        { status: 400 }
      );
    }

    // Fetch appointments on the selected date
    const appointments = await prisma.appointment.findMany({
      where: {
        date: new Date(date),
      },
      select: { time: true }, // Get only the time field
    });

    const unavailableTimes = appointments.map((appt) => appt.time);

    return NextResponse.json(unavailableTimes, { status: 200 });
  } catch (error) {
    console.error("Error fetching unavailable times:", error);
    return NextResponse.json(
      { error: "Failed to fetch unavailable times" },
      { status: 500 }
    );
  }
}
