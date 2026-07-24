import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const roomTransfers = await prisma.roomTransfer.findMany({
      include: {
        fromRoom: true,
        toRoom: true,
        booking: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(roomTransfers);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
