import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { id } = params;

    const {
      codename,
      priceLow,
      standardPrice,
      color,
      description,
      types,
      sizes,
    } = body;

    // Update the gown and its related types and sizes
    const updatedGown = await prisma.gown.update({
      where: { id },
      data: {
        codename,
        priceLow: parseFloat(priceLow),
        standardPrice: parseFloat(standardPrice),
        color,
        description: description || null,
        types: {
          set: [], // clear existing
          connect: types.map((name) => ({ name })),
        },
        sizes: {
          set: [],
          connect: sizes.map((label) => ({ label })),
        },
      },
      include: {
        types: true,
        sizes: true,
      },
    });

    return NextResponse.json(updatedGown, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating gown:", error);
    return NextResponse.json(
      { error: "Failed to update gown" },
      { status: 500 }
    );
  }
}
