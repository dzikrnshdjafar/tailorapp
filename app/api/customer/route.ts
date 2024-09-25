import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const customer = await prisma.customer.findMany({
        include: {
          sizes: {
            include: {
              clothingType: true,
              sizeAttribute: true,
            },
          },
        },
      });
      return NextResponse.json(customer);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching sizes' }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  };
