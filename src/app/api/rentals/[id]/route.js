import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    console.log("Updating rental with ID:", id, "Data:", body); // ✅ Debugging

    // ✅ Case 1: Mark as Picked-Up with final payment
    if (body.isPickedUp !== undefined) {
      const updateData = {
        isPickedUp: body.isPickedUp,
      };

      // Include optional final payment info if available
      if (body.finalPayment !== undefined) {
        updateData.finalPayment = parseFloat(body.finalPayment);
      }
      if (body.finalPaymentMode) {
        updateData.finalPaymentMode = body.finalPaymentMode;
      }
      if (body.securityDeposit) {
        updateData.securityDeposit = body.securityDeposit;
      }

      const updatedRental = await prisma.rental.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json(updatedRental, { status: 200 });
    }

    // ✅ Case 2: Regular rental edit
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
        downPaymentMode: body.downPaymentMode || null,
        totalAmount: parseFloat(body.totalAmount),
        securityDeposit: body.securityDeposit || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(updatedRental, { status: 200 });
  } catch (error) {
    console.error("Error updating rental status:", error);
    return NextResponse.json(
      { error: "Failed to update rental status" },
      { status: 500 }
    );
  }
}
