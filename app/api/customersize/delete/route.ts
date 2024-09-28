import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DELETE = async (request: Request) => {
  try {
    // Parse body dari request
    const body = await request.json();
    const { customerId, clothingTypeId, sizes } = body;
    console.log(body)

    // Validasi input
    if (!customerId || !clothingTypeId || !Array.isArray(sizes) || sizes.length === 0) {
      return NextResponse.json(
        { message: 'Missing or invalid input fields' },
        { status: 400 }
      );
    }

    // Ambil semua sizeAttributeId dari array sizes
    const sizeAttributeIds = sizes.map((size) => size.sizeAttributeId);

    // Hapus ukuran berdasarkan customerId, clothingTypeId, dan sizeAttributeId
    const deleteSizes = await prisma.customerSize.deleteMany({
      where: {
        customerId: customerId,
        clothingTypeId: clothingTypeId,
        sizeAttributeId: {
          in: sizeAttributeIds, // Menghapus berdasarkan array sizeAttributeId
        },
      },
    });

    if (deleteSizes.count === 0) {
      return NextResponse.json(
        { message: 'No sizes found for the specified customer, clothing type, and size attributes' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Sizes deleted successfully', count: deleteSizes.count },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting customer sizes:', error);
    return NextResponse.json(
      { message: 'Failed to delete customer sizes', error },
      { status: 500 }
    );
  }
};

export const OPTIONS = () => {
  return NextResponse.json({}, { status: 204 });
};
