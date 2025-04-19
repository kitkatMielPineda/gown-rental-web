import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      codename,
      priceLow,
      standardPrice,
      color,
      description,
      types,
      sizes,
    } = body;

    const newGown = await prisma.gown.create({
      data: {
        codename,
        priceLow: parseFloat(priceLow),
        standardPrice: parseFloat(standardPrice),
        color,
        description,
        types: {
          connect: types.map((name) => ({ name })),
        },
        sizes: {
          connect: sizes.map((label) => ({ label })),
        },
      },
    });

    return NextResponse.json(newGown, { status: 201 });
  } catch (error) {
    console.error("❌ Gown Save Error:", error);
    return NextResponse.json({ error: "Failed to save gown" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const size = searchParams.get("size") || "";
    const color = searchParams.get("color") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const filters = {
      AND: [
        search ? { codename: { contains: search, mode: "insensitive" } } : {},
        color ? { color: { equals: color, mode: "insensitive" } } : {},
        type ? { types: { some: { name: { equals: type } } } } : {},
        size ? { sizes: { some: { label: { equals: size } } } } : {},
      ],
    };

    const [gowns, total] = await Promise.all([
      prisma.gown.findMany({
        where: filters,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          types: true,
          sizes: true,
        },
      }),
      prisma.gown.count({ where: filters }),
    ]);

    return NextResponse.json({ gowns, total, page });
  } catch (error) {
    console.error("Error fetching gowns:", error);
    return NextResponse.json(
      { error: "Failed to fetch gowns" },
      { status: 500 }
    );
  }
}
