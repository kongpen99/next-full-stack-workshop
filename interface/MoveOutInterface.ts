import { RoomInterface } from "./RoomInterface";
import { BookingInterface } from "./BookingInterface";

export interface MoveOutInterface {
    id: string;
    roomId: string;
    room: RoomInterface;
    bookingId: string;
    booking: BookingInterface;
    moveOutDate: Date;
    reason?: string;
    depositReturn: number;
    refund?: number;
    outstandingFees?: number;
    status: string; // pending, approved, rejected, completed
    approvedBy?: string;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
