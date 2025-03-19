import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    // ✅ Extract ID from `params`
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing appointment ID" },
        { status: 400 }
      );
    }

    // ✅ Parse the request body
    const body = await req.json();
    let { name, contact, date, time } = body;

    if (!name || !contact || !date || !time) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Convert date to a valid JavaScript Date object
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // ✅ Check if another appointment exists at the same date & time (excluding the current one)
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        date: appointmentDate,
        time: time,
        id: { not: id }, // Exclude the current appointment from check
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "This time slot is already booked!" },
        { status: 400 }
      );
    }

    // ✅ Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        name,
        contact,
        date: appointmentDate,
        time,
      },
    });

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
