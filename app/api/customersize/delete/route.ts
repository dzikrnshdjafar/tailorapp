import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DELETE = async (request: Request) => {
  try {
    const { customerId, clothingTypeId } = await request.json();

    // Hapus semua ukuran berdasarkan clothingTypeId dan customerId
    await prisma.customerSize.deleteMany({
      where: {
        customerId: customerId,
        clothingTypeId: clothingTypeId,
      },
    });

    return NextResponse.json({ message: 'Customer sizes deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting customer sizes by clothing type:', error);
    return NextResponse.json({ error: 'Failed to delete customer sizes' }, { status: 500 });
  }
};
