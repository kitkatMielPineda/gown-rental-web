import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const types = await prisma.gownType.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(types, { status: 200 });
  } catch (error) {
    console.error("Error fetching gown types:", error);
    return NextResponse.json(
      { error: "Failed to load gown types" },
      { status: 500 }
    );
  }
}
