import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const clothingType = await prisma.clothingType.findMany();
      return NextResponse.json(clothingType);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching sizes' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };
