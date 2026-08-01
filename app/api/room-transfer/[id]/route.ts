// PUT /api/room-transfer/:id

import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';


// การอนุมัติ/ยกเลิกการย้ายห้อง
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // ดึงข้อมูลจากตาราง roomTransfer
    const transfer = await prisma.roomTransfer.update({
      where: { id },
      data: {
        status: body.status ?? 'completed'
      }
    });

    // ถ้าสถานะเป็น completed
    if (body.status === 'completed') {
      // 1. ย้ายห้องพักใน Booking
      await prisma.booking.update({
        where: { id: transfer.bookingId },
        data: { roomId: transfer.toRoomId }
      });
      // 2. อัปเดตสถานะห้องต้นทางเป็น ว่าง
      await prisma.room.update({
        where: { id: transfer.fromRoomId },
        data: { statusEmpty: 'empty' }
      });
      // 3. อัปเดตสถานะห้องปลายทางเป็น เข้าพักแล้ว
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
// DELETE /api/room-transfer/:id
// ยกเลิกการย้ายห้อง
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
