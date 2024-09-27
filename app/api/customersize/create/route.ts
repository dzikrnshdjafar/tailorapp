import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Pastikan body berisi array data size
    const { customerId, clothingTypeId, sizes } = body;

    if (!customerId || !clothingTypeId || !Array.isArray(sizes) || sizes.length === 0) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Gunakan Prisma untuk membuat banyak entri customer size sekaligus
    const customerSizes = await prisma.customerSize.createMany({
      data: sizes.map((size) => ({
        customerId,
        clothingTypeId,
        sizeAttributeId: size.sizeAttributeId,
        sizeValue: size.sizeValue,
      })),
    });

    return NextResponse.json({ success: true, data: customerSizes }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer sizes:', error);
    return NextResponse.json({ error: 'Failed to create customer sizes' }, { status: 500 });
  }
};
