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
      repairDesc,
      downPayment,
      downPaymentMode,
      finalPayment,
      finalPaymentMode,
      totalAmount,
      securityDeposit,
      notes,
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
        repairDesc: repairDesc || null,
        downPayment: parseFloat(downPayment),
        downPaymentMode: downPaymentMode || null,
        finalPayment: finalPayment ? parseFloat(finalPayment) : null,
        finalPaymentMode: finalPaymentMode || null,
        totalAmount: parseFloat(totalAmount),
        securityDeposit: securityDeposit || null,
        notes: notes || null,
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

/** 📌 GET: Fetch all rentals */
export async function GET() {
  try {
    const rentals = await prisma.rental.findMany({
      orderBy: { pickupDate: "asc" },
    });

    return NextResponse.json(rentals, { status: 200 });
  } catch (error) {
    console.error("Error fetching rentals:", error);
    return NextResponse.json(
      { error: "Failed to fetch rentals" },
      { status: 500 }
    );
  }
}
