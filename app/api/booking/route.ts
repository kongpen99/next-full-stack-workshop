// เขียน api สำหรับ booking room
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
            roomId: z.number(),
            remark: z.string(),
            deposit: z.number(),

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
        
    } catch (error) {
        
    }
    
}

