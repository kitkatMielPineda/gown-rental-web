import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    console.log("Updating rental with ID:", id, "Data:", body); // ✅ Debugging

    // ✅ Check if the request is marking the rental as picked up
    if (body.isPickedUp !== undefined) {
      const updatedRental = await prisma.rental.update({
        where: { id },
        data: { isPickedUp: body.isPickedUp },
      });

      console.log("Updated Rental:", updatedRental); // ✅ Debugging
      return NextResponse.json(updatedRental, { status: 200 });
    }

    // ✅ Otherwise, update rental details
    const updatedRental = await prisma.rental.update({
      where: { id },
      data: {
        name: body.name,
        contact: body.contact,
        pickupDate: new Date(body.pickupDate),
        returnDate: new Date(body.returnDate),
        gownDesc: body.gownDesc,
        forRepair: body.forRepair,
        repairDesc: body.repairDesc || null,
        downPayment: parseFloat(body.downPayment),
        totalAmount: parseFloat(body.totalAmount),
        securityDeposit: body.securityDeposit || null,
        notes: body.notes || null,
      },
    });

    console.log("Updated Rental:", updatedRental); // ✅ Debugging
    return NextResponse.json(updatedRental, { status: 200 });
  } catch (error) {
    console.error("Error updating rental status:", error);
    return NextResponse.json(
      { error: "Failed to update rental status" },
      { status: 500 }
    );
  }
}
