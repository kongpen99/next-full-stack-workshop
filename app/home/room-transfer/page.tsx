"use client";

import Button from "@/components/button";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import Modal from "@/components/ui/modal";
import { RoomInterface } from "@/interface/RoomInterface";
import RoomTypeInterface from "@/interface/RoomTypeInterface";
import { RoomTransferInterface } from "@/interface/RoomTransferInterface";

export default function RoomTransferPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [transfers, setTransfers] = useState<RoomTransferInterface[]>([]);
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeInterface[]>([]);

  //  form state
  const [fromRoomId, setFromRoomId] = useState("");
  const [toRoomId, setToRoomId] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [transferDate, setTransferDate] = useState(new Date());
  const [transferFee, setTransferFee] = useState(0);
  const [reason, setReason] = useState("");

  useEffect(() => {
    // fetchData();
  }, []);

  const fetchRoomData = async () => {
    try {
      const typesRes = await axios.get('/api/room-type');
      const types: RoomTypeInterface[] = typesRes.data;
     
      const roomPromises = types.map(type => axios.get('/api/room/list/' + type.id));
      const roomResponse = await Promise.all(roomPromises);
      const allRooms = roomResponse.flatMap(res => res.data);

      setRooms(allRooms);
    }catch (err) {
      Swal.fire({
        title: "error",
        icon: "error",
        text: (err as Error).message,
      });
    }
  }

  const fetchData = async () => {

    try {
      const response = await axios.get('/api/room-transfer');
    } catch (err) {
      Swal.fire({
        title: "error",
        icon: "error",
        text: (err as Error).message,
      });
    }
  }

  const clearForm = () => {
    setFromRoomId("");
    setToRoomId("");
    setBookingId("");
    setTransferDate(new Date());
    setTransferFee(0);
    setReason("");
  }

  const occupiiedRooms = rooms.filter(r => r.statusEmpty === 'no');
  const emptyRooms = rooms.filter(r => r.statusEmpty !== 'no');

  return (
    <div className="p-5">
      <div className="flex flex-col justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ขอย้ายห้องพัก</h1>
          <p className="text-gray-600">จัดการข้อมูลการย้ายห้องของผู้เข้าพัก</p>
        </div>
        <div className="flex gap-2">
          <Button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
            <i className="fa-solid fa-arrows-rotate"></i>
            รีเฟรส
          </Button>

          <Button
            onClick={() => {
              setIsOpen(true);
              clearForm();
            }}
            className="flex item-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <i className="fa-solid fa-plus"></i>
            เพิ่มรายการ
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-700">ห้องเดิม</th>
                <th className="p-4 font-semibold text-gray-700 text-center">
                  <i className="fa-solid fa-right-left"></i>
                </th>
                <th className="p-4 font-semibold text-gray-700">ห้องใหม่</th>
                <th className="p-4 font-semibold text-gray-700">วันที่ย้าย</th>
                <th className="p-4 font-semibold text-gray-700 text-right">
                  ค่าขนย้าย
                </th>
                <th className="p-4 font-semibold text-gray-700">
                  เหตุผลการย้าย
                </th>
                <th className="p-4 font-semibold text-gray-700">
                  สถานะการย้าย
                </th>
                <th className="p-4 font-semibold text-gray-700 text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">
                  <div className="font-medium text-gray-900">1101</div>
                  <div className="text-md text-gray-500">ห้องแอร์</div>
                </td>
                <td className="p-4 text-center">
                  <i className="fa fa-arrow-right"></i>
                </td>

                <td className="p-4">
                  <div className="font-medium text-gray-900">1102</div>
                  <div className="text-md text-gray-500">ห้องแอร์</div>
                </td>
                <td className="p-4">25 มกราคม 2026</td>
                <td className="p-4 text-right">0</td>
                <td className="p-4">-</td>
                <td className="p-4">รอดำเนินการ</td>
                <td className="p-4 text-center">
                  <div className="flex gap-2">
                    <Button className="text-green-600 bg-white  border-green-600 border hover:bg-green-600 hover:text-white">
                      <i className="fa-solid fa-circle-check"></i>
                      ยืนยัน
                    </Button>
                    <Button className="text-red-600 bg-white border-red-600 border hover:bg-red-600 hover:text-white">
                      ยกเลิก
                    </Button>
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="สร้างรายการย้ายห้อง"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}>
        <form className="space-y-6 py-2">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="item-center gap-2 flex">
                <i className="fa-solid fa-magnifying-glass text-blue-500"></i>
                ห้องต้นทาง (ห้องที่ไม่ว่าง)
              </label>

              <select className="input-modal">
                <option>--- เลือกห้อง ---</option>
                {occupiiedRooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} - {r.bookings[0]?.customerName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

