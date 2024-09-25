import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
  try {
    const sizeId = parseInt(params.id);

    // Hapus ukuran berdasarkan sizeId
    await prisma.customerSize.delete({
      where: { id: sizeId },
    });

    return NextResponse.json({ message: 'Customer size deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting customer size:', error);
    return NextResponse.json({ error: 'Failed to delete customer size' }, { status: 500 });
  }
};
