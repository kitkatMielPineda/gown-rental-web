import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** 📌 POST: Create a new appointment */
export async function POST(req) {
  try {
    const body = await req.json();
    let { name, contact, date, time, userId } = body;

    // ✅ Ensure all fields are provided
    if (!name || !contact || !date || !time || !userId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Convert `date` to a valid JavaScript Date object
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // ✅ Check if the same date & time already exists
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: appointmentDate, // Ensure only date is compared
        time: time, // Ensure time is matched exactly
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "An appointment at this time is already booked!" },
        { status: 400 }
      );
    }

    // ✅ Save the appointment to the database
    const newAppointment = await prisma.appointment.create({
      data: {
        name,
        contact,
        date: appointmentDate, // Save as a Date object
        time,
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

// /** 📌 GET: Fetch all upcoming appointments */
// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const date = url.searchParams.get("date");

//     let filter = {};
//     if (date) {
//       filter.date = new Date(date);
//     }

//     const appointments = await prisma.appointment.findMany({
//       where: filter,
//       orderBy: { date: "asc" },
//     });

//     return NextResponse.json(appointments, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch appointments" },
//       { status: 500 }
//     );
//   }
// }

/** 📌 GET: Fetch all upcoming appointments (Today & Future) */
export async function GET(req) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of the day

    const appointments = await prisma.appointment.findMany({
      where: {
        date: { gte: today }, // Only fetch today and future dates
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
