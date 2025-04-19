import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/** 📌 GET: Search & Filter Gowns */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const codename = searchParams.get("codename");
    const type = searchParams.get("type");
    const size = searchParams.get("size");
    const color = searchParams.get("color");

    const filters = {};

    if (codename) {
      filters.codename = {
        contains: codename,
        mode: "insensitive",
      };
    }

    if (color) {
      filters.color = {
        contains: color,
        mode: "insensitive",
      };
    }

    const filteredGowns = await prisma.gown.findMany({
      where: {
        ...filters,
        ...(type
          ? {
              types: {
                some: {
                  name: {
                    equals: type,
                  },
                },
              },
            }
          : {}),
        ...(size
          ? {
              sizes: {
                some: {
                  label: {
                    equals: size,
                  },
                },
              },
            }
          : {}),
      },
      take: 20, // initial pagination
      orderBy: {
        createdAt: "desc",
      },
      include: {
        types: true,
        sizes: true,
      },
    });

    return NextResponse.json(filteredGowns);
  } catch (error) {
    console.error("❌ Gown search error:", error);
    return NextResponse.json(
      { error: "Failed to search gowns" },
      { status: 500 }
    );
  }
}
