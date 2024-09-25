// pages/api/customers.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, phone, sizes } = req.body;

    try {
      const customer = await prisma.customer.create({
        data: {
          name,
          email,
          phone,
          sizes: {
            create: sizes.map((size: any) => ({
              sizeValue: size.sizeValue,
              clothingType: {
                connect: { id: size.clothingTypeId },
              },
              sizeAttribute: {
                connect: { id: size.sizeAttributeId },
              },
            })),
          },
        },
      });
      res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ error: 'Error creating customer' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
