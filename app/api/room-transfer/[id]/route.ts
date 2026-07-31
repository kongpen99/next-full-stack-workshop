import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const transfer = await prisma.roomTransfer.update({
      where: { id },
      data: {
        status: body.status ?? 'completed'
      }
    });

    if (body.status === 'completed') {
      await prisma.booking.update({
        where: { id: transfer.bookingId },
        data: { roomId: transfer.toRoomId }
      });
      await prisma.room.update({
        where: { id: transfer.fromRoomId },
        data: { statusEmpty: 'empty' }
      });
      await prisma.room.update({
        where: { id: transfer.toRoomId },
        data: { statusEmpty: 'no' }
      });
    }

    return NextResponse.json(transfer);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const transfer = await prisma.roomTransfer.delete({
      where: { id }
    });

    return NextResponse.json(transfer);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
