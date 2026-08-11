// PUT api/money-added/:id //อัพเดทข้อมูลการเพิ่มเงิน

// import { NextResponse } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

export async function PUT(Request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await Request.json();
        const schema = z.object({
            name: z.string(),
            amount: z.number()
        });
        const { name, amount } = schema.parse(body);
        const { id } = await params;
        const moneyAdded = await prisma.moneyAdded.update({
            where: {
                id: id
            },
            data: {
                name: name,
                amount: amount
            }
        });
        return NextResponse.json(moneyAdded);

    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

// DELETE api/money-added/:id //ลบข้อมูลการเพิ่มเงิน

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const moneyAdded = await prisma.moneyAdded.update({
            where: {
                id: id
            },
            data: {
                status: "inactive"
            }
        });
        return NextResponse.json(moneyAdded);

    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }

}
