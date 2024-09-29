import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const clothingType = await prisma.clothingType.findMany();
    return NextResponse.json(clothingType);
  } catch (error) {
    console.error('Error fetching sizes:', error); // Logging error
    return NextResponse.json({ error: 'Error fetching sizes' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
