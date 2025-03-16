import { NextResponse } from "next/server";
//import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";

//const prisma = new PrismaClient();

/** 📌 POST: Create a new rental */
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("!!!Received Data:", body); //debugging
    const {
      name,
      contact,
      pickupDate,
      returnDate,
      gownDesc,
      forRepair,
      downPayment,
      totalAmount,
      userId,
    } = body;

    // Save to database
    const newRental = await prisma.rental.create({
      data: {
        name,
        contact,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        gownDesc,
        forRepair,
        downPayment: parseFloat(downPayment),
        totalAmount: parseFloat(totalAmount),
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(newRental, { status: 201 });
  } catch (error) {
    console.error("Error saving rental:", error); // Log the exact error
    return NextResponse.json(
      { error: "Failed to save rental" },
      { status: 500 }
    );
  }
}
