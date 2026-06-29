// เขียน api สำหรับการจองห้องพัก booking room โดยรับข้อมูลจาก client
//  POST /api/booking/route.ts
 
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/libs/prisma";

export  async function POST (request: Request) {
    try{

        const body = await request.json();
        const schema = z.object({
            customerName: z.string(),
            customerPhone: z.string(),
            customerAddress: z.string(),
            cardId: z.string(),
            gender: z.string(),
            roomId: z.string(),
            remark: z.string().optional(),
            deposit: z.number().default(0),
            stayAt: z.string().transform((str) => new Date(str)),
            stayTo: z.string().nullable().optional().transform((str) => (str ? new Date(str) : null))
        });
        const{
            customerName,
            customerPhone,
            customerAddress,
            cardId,
            gender,
            roomId,
            remark,
            deposit
        } = schema.parse(body);

        const booking = await prisma.booking.create({
            data: {
                customerName: customerName,
                customerPhone: customerPhone,
                customerAddress: customerAddress,
                cardId: cardId,
                gender: gender,
                roomId: roomId,
                remark: remark,
                deposit: deposit,
                stayAt: new Date(),
                stayTo: new Date(),
                status: 'active'
            }
        });


        //  update statusEmpty of room
        await prisma.room.update({
            where: {
                id: roomId
            },
            data: {
                statusEmpty: 'no'
            }
        });

        return NextResponse.json(booking);
    } catch (error) {
        return NextResponse.json(
            { error:(error as Error) },
            { status: 500 }
        );
    }
}

