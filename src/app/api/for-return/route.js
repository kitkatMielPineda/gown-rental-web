import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** 📌 GET: Fetch all rentals that need to be returned */
export async function GET() {
  try {
    const today = new Date();

    const forReturnItems = await prisma.rental.findMany({
      where: { returnDate: { lte: today }, isReturned: false },
      orderBy: { returnDate: "asc" },
    });

    return NextResponse.json(forReturnItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching return items:", error);
    return NextResponse.json(
      { error: "Failed to fetch return items" },
      { status: 500 }
    );
  }
}

/** 📌 PATCH: Mark rental as returned */
export async function PATCH(req, { params }) {
  try {
    const rentalId = params.id;

    await prisma.rental.update({
      where: { id: rentalId },
      data: { isReturned: true },
    });

    return NextResponse.json(
      { message: "Rental marked as returned" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating return status:", error);
    return NextResponse.json(
      { error: "Failed to update return status" },
      { status: 500 }
    );
  }
}
