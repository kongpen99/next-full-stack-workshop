'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Modal from "@/components/ui/modal";
import Button from "@/components/button";
import RoomTypeInterface from "@/interface/RoomTypeInterface";
import { RoomInterface } from "@/interface/RoomInterface";
import { MoveOutInterface } from "@/interface/MoveOutInterface";



export default function RoomOut() {
    const [moveOuts, setMoveOuts] = useState<MoveOutInterface[]>([]);
    const [rooms, setRooms] = useState<RoomInterface[]>([]);
    const [roomTypes, setRoomTypes] = useState<RoomTypeInterface[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // form state
    const [roomId, setRoomId] = useState('');
    const [bookingId, setBookingId] = useState('');
    const [moveOutDate, setMoveOutDate] = useState(new Date());
    const [reason, setReason] = useState('');
    const [depositReturn, setDepositReturn] = useState(0);
    const [outstandingFee, setOutstandingFee] = useState(0);


    return (
        <div className="p-6">
            <div className="flex flex-col justify-between items-start mb-8 gap-4">
                <div>
                    <h1 className="text-xl font-semibold">แจ้งย้ายออก</h1>
                    <p className="text-gray-600">จัดการการแจ้งย้ายออกจากหอพัก</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => { }}
                        className=" flex items-center gap-2 shadow-md">
                        <i className="fa-solid fa-arrows-rotate"></i>
                        รีเฟช
                    </Button>
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md">
                        <i className="fa-solid fa-plus"></i>
                        เพิ่มการแจ้งย้าย
                    </Button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-y-auto ">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 text-gray-700 font-semibold">เลขที่ห้อง</th>
                                <th className="p-4 text-gray-700 font-semibold">ชื่อผู้เข้าพัก</th>
                                <th className="p-4 text-gray-700 font-semibold">วันที่แจ้งย้ายออก</th>
                                <th className="p-4 text-gray-700 font-semibold">คืนเงินมัดจำ</th>
                                <th className="p-4 text-gray-700 font-semibold">ค่าใช้จ่ายค้างชำระ</th>
                                <th className="p-4 text-gray-700 font-semibold">สถานะ</th>
                                <th className="p-4 text-gray-700 font-semibold">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}




