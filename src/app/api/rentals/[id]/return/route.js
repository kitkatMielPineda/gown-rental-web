import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** 📌 PATCH: Mark rental as "Returned" */
export async function PATCH(req, { params }) {
  try {
    const { id } = params;

    // ✅ Update rental to mark as returned
    const updatedRental = await prisma.rental.update({
      where: { id },
      data: { isReturned: true },
    });

    return NextResponse.json(updatedRental, { status: 200 });
  } catch (error) {
    console.error("Error updating return status:", error);
    return NextResponse.json(
      { error: "Failed to update return status" },
      { status: 500 }
    );
  }
}
