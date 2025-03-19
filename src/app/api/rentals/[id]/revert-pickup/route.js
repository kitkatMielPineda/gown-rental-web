import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** ✅ PATCH: Revert 'isPickedUp' to false */
export async function PATCH(req, { params }) {
  try {
    const { id } = params;

    console.log("Reverting rental pickup status for ID:", id); // Debugging

    const updatedRental = await prisma.rental.update({
      where: { id },
      data: { isPickedUp: false }, // ✅ Change 'isPickedUp' back to false
    });

    console.log("Rental Reverted:", updatedRental); // Debugging

    return NextResponse.json(updatedRental, { status: 200 });
  } catch (error) {
    console.error("Error reverting rental pickup status:", error);
    return NextResponse.json(
      { error: "Failed to revert rental pickup status" },
      { status: 500 }
    );
  }
}
