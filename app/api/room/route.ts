//POST api/room

import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {

    try {
        const body =await request.json();
        const schema = z.object({
            roomTypeId: z.string(),
            totalRooms: z.number(),
            towerName: z.string(),
            totalLevel:z.number()
        });

        let { roomTypeId, totalRooms, towerName, totalLevel } = schema.parse(body);
        totalRooms = Number(totalRooms);
        totalLevel = Number(totalLevel);

        if (totalRooms > 0) {
            const computerTotalRoom =  totalRooms * totalLevel; 
            for (let i = 1; i <= totalRooms; i++) {
                for (let j = 1; j <= totalLevel; j++) {
                    //  name 1101 ตัวเลขตัวแรกคือตึก ตัวที่สองคือชั้น อีก2ตัวคือห้อง
                    // 1101 = ตึก1 ชั้น1 ห้อง01
                    const roomNo = String(j).padStart(2, '0');
                    const roomName = `${towerName}${i}${roomNo}`;
                    await prisma.room.create({
                        data: {
                            roomTypeId: roomTypeId,
                            name: roomName,
                            status:'active',
                            statusEmpty: 'empty',
                            towerName: towerName,
                            towerLevel: totalLevel,
                            totalRoom: computerTotalRoom
                        }
                    });
                }
            }
        }
        return NextResponse.json({});
        
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        )  
    }
}


