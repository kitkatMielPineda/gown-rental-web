import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** 📌 POST: Create a new appointment */
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received Appointment Data:", body);

    const { name, contact, date, time, userId } = body;

    if (!name || !contact || !date || !time || !userId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Convert date into a Date object
    const appointmentDate = new Date(date);

    // ✅ Check if there is already an appointment at the same date & time
    const existingAppointment = await prisma.appointment.findFirst({
      where: { date: appointmentDate, time },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "An appointment already exists at this time" },
        { status: 400 }
      );
    }

    // ✅ Check if the selected time is within 1 hour of any existing appointment
    const oneHourBefore = new Date(appointmentDate);
    oneHourBefore.setHours(oneHourBefore.getHours() - 1);

    const oneHourAfter = new Date(appointmentDate);
    oneHourAfter.setHours(oneHourAfter.getHours() + 1);

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        AND: [
          { date: { gte: oneHourBefore, lte: oneHourAfter } }, // Within 1 hour gap
        ],
      },
    });

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: "An appointment must have a 1-hour gap" },
        { status: 400 }
      );
    }

    // ✅ Save the appointment to the database
    const newAppointment = await prisma.appointment.create({
      data: {
        name,
        contact,
        date: appointmentDate,
        time, // ✅ Ensure `time` is stored properly
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Error saving appointment:", error);
    return NextResponse.json(
      { error: "Failed to save appointment" },
      { status: 500 }
    );
  }
}

/** 📌 GET: Fetch all upcoming appointments */
export async function GET() {
  try {
    const today = new Date();

    const upcomingAppointments = await prisma.appointment.findMany({
      where: { date: { gte: today } },
      orderBy: [{ date: "asc" }, { time: "asc" }], // Sort by nearest date & time
    });

    return NextResponse.json(upcomingAppointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
