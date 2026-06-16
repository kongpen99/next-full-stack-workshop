//  Get /api /apartment
//  POST /api /apartment

import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const ApartmentSchema = z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.email().optional(),
    lineId: z.string().optional(),
    taxCode: z.string()

})
// เรียกอย่าง GET /api/apartment เพื่อดึงข้อมูลอพาร์ตเมนต์ทั้งหมด
    export async function GET() {
        try {
            return NextResponse.json(await prisma.apartment.findFirst() ?? {}, {status: 200});
        } catch (error) {

         return NextResponse.json({error: "Failed to fetch apartments"}, {status: 500});
        }
}

// เรียกอย่าง POST /api/apartment พร้อม body เพื่อสร้างอพาร์ตเมนต์ใหม่
export async function POST(request: Request) {
    try{
        const body = await request.json();
        const oldApartment = await prisma.apartment.findFirst();
        if(oldApartment){
            await prisma.apartment.update({
                where: {
                    id: oldApartment.id,
                },
                data: ApartmentSchema.parse(body),
            });
            return NextResponse.json(oldApartment, {status: 200});
        }
        const apartment = await prisma.apartment.create({
            data: ApartmentSchema.parse(body),
        });
        return NextResponse.json(apartment, {status: 201});
    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}