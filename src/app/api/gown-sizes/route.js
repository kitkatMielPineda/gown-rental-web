import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const sizes = await prisma.gownSize.findMany({
      orderBy: { label: "asc" },
    });

    return NextResponse.json(sizes, { status: 200 });
  } catch (error) {
    console.error("Error fetching gown sizes:", error);
    return NextResponse.json(
      { error: "Failed to load gown sizes" },
      { status: 500 }
    );
  }
}
