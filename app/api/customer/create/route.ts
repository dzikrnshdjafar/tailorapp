import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Customer } from "@prisma/client";

const prisma = new PrismaClient()

export const POST = async (request: Request) =>{
    const body: Customer = await request.json()
    const customer = await prisma.customer.create({
        data:{
            name: body.name,
            email: body.email,
            phone: body.phone,
        }
    })
    return NextResponse.json(customer, {status: 201})
}
