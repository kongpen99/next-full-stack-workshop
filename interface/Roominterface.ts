import { BookingInterface } from './BookingInterface';

import RoomTypeInterface from './RoomTypeInterface';


export interface RoomInterface {
    id: string;
    name: string;
    towerName: string;
    totalLevel: number;
    totalRoom: number;
    roomTypeId: string;
    roomType: RoomTypeInterface;
    remark: string;
    status: string;
    statusEmpty: string;
    createdAt: string;
    updatedAt: string;
    bookings: BookingInterface[];
} 