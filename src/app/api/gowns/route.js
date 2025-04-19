import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const size = searchParams.get("size") || "";
  const color = searchParams.get("color") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");

  const where = {
    ...(search && {
      codename: {
        contains: search,
        mode: "insensitive",
      },
    }),
    ...(color && {
      color: {
        contains: color,
        mode: "insensitive",
      },
    }),
    ...(type && {
      types: {
        some: {
          name: type, // Match gownTypes.name
        },
      },
    }),
    ...(size && {
      sizes: {
        some: {
          label: size, // Match gownSizes.label
        },
      },
    }),
  };

  try {
    const [gowns, total] = await Promise.all([
      prisma.gown.findMany({
        where,
        include: {
          types: true,
          sizes: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { codename: "asc" },
      }),
      prisma.gown.count({ where }),
    ]);

    return NextResponse.json({ gowns, total });
  } catch (err) {
    console.error("Error fetching gowns:", err);
    return NextResponse.json(
      { error: "Failed to fetch gowns" },
      { status: 500 }
    );
  }
}
