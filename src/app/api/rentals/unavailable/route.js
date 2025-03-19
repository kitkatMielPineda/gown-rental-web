import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** 📌 GET: Fetch all unavailable gowns (current and future) */
export async function GET() {
  try {
    const today = new Date();

    const unavailableGowns = await prisma.rental.findMany({
      where: {
        OR: [
          { isPickedUp: true, isReturned: false }, // ✅ Already picked up and not returned
          { pickupDate: { gte: today } }, // ✅ Future pickups (upcoming rentals)
        ],
      },
      orderBy: { pickupDate: "asc" },
    });

    return NextResponse.json(unavailableGowns, { status: 200 });
  } catch (error) {
    console.error("Error fetching unavailable gowns:", error);
    return NextResponse.json(
      { error: "Failed to fetch unavailable gowns" },
      { status: 500 }
    );
  }
}
