import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const PUT = async (request: Request) => {
  try {
    // Parse body from request
    const body = await request.json();
    console.log('Request Body:', body); // Log the request body
    const { customerId, clothingTypes } = body;

    // Validasi input
    if (!customerId || !clothingTypes || !Array.isArray(clothingTypes)) {
      return NextResponse.json(
        { message: 'Missing or invalid input fields' },
        { status: 400 }
      );
    }

    // Lakukan update untuk setiap clothing type
    const updatedSizes = await Promise.all(
      clothingTypes.map(async (clothingType) => {
        const { clothingTypeId, sizes } = clothingType;

        if (!clothingTypeId || !sizes || !Array.isArray(sizes)) {
          throw new Error('Invalid clothing type or sizes data');
        }

        // Update sizes for the given clothingTypeId
        return Promise.all(
          sizes.map(async (size) => {
            return prisma.customerSize.updateMany({
              where: {
                customerId,
                clothingTypeId,
                sizeAttributeId: size.sizeAttributeId,
              },
              data: {
                sizeValue: size.sizeValue,
              },
            });
          })
        );
      })
    );

    return NextResponse.json(
      { message: 'Customer sizes updated successfully', data: updatedSizes },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating customer sizes:', error);
    return NextResponse.json(
      { message: 'Failed to update customer sizes', error },
      { status: 500 }
    );
  }
};

export const OPTIONS = () => {
  return NextResponse.json({}, { status: 204 });
};
