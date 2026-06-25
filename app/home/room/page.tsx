
// เขียน Code ในหน้าMenu Room (ห้องพัก Sidebar)

'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { RoomInterface } from '@/interface/RoomInterface';
import RoomTypeInterface from '@/interface/RoomTypeInterface';
import Button from '@/components/button';
import Modal from '@/components/ui/modal';




export default function Room() {
    const [rooms,setRooms] = useState<RoomInterface[]>([]);
    const [roomTypes,setRoomTypes] = useState<RoomTypeInterface[]>([]);
    const [roomTypeId,setRoomTypeId] = useState('');
    const [filterRoomTypeId,setFilterRoomTypeId] = useState('');
    const [id,setId] = useState('');
    const [isOpen,setIsOpen] = useState(false);
    const [totalRoom,setTotalRoom] = useState(0);
    const [towerName,setTowerName] = useState('');
    const [totalLevel,setTotalLevel] = useState(0);
    

  
    useEffect(() => {
        fetchRoomTypes();
    }, []);


    useEffect(() => {
        if (roomTypes.length > 0) {
            setRoomTypeId(roomTypes[0].id);
            setFilterRoomTypeId(roomTypes[0].id);
        }

    }, [roomTypes]);

    useEffect(() => {
        if (filterRoomTypeId) {
            fetchData();
        }
    }, [filterRoomTypeId]);
        
       const fetchData = async () => {
        try {
            const response = await axios.get('/api/room/list/' + filterRoomTypeId);
            setRooms(response.data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (error as Error).message,
            });
        }
    }
   const fetchRoomTypes = async () => {
        try {
            const response = await axios.get('/api/room-type');
            setRoomTypes(response.data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (error as Error).message,
            });
        }
    }
   const handleSave = async (form: React.FormEvent<HTMLFormElement>) => {
        form.preventDefault();

        try {
            const payload = {
                towerName: towerName,
                totalLevel: totalLevel,
                totalRoom: totalRoom,
                roomTypeId: roomTypeId,
            }

            if (id) {
                await axios.put(`/api/room/${id}`, payload);
            } else {
                await axios.post('/api/room', payload);
            }

            fetchData();
            setIsOpen(false);
            clearForm();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (error as Error).message,
            })
        }
    }
    const clearForm = () => {
        setId('');
        setTowerName('');
        setTotalLevel(0);
        setTotalRoom(0);
        setRoomTypeId(roomTypes[0]?.id);
    }
    return (
        <>
            <div className='text-2xl font-semibold'>ห้องพัก</div>
            <Button onClick={() => {
                setIsOpen(true);
                clearForm();
            }}>
                <i className="fa fa-plus mr-2"></i>
                เพิ่มรายการ
            </Button>

            <div className="flex gap-1 mt-3 shadow-2xl">
                <span className="w-40 justify-center bg-gray-400 p-3 rounded-l-md">ประเภทห้องพัก</span>
                <select
                    className="input-modal"
                    value={filterRoomTypeId}
                    onChange={(e) => setFilterRoomTypeId(e.target.value)}>
                    {roomTypes.map((roomType) => (
                        <option key={roomType.id} value={roomType.id}>
                            {roomType.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-5 gap-1 mt-3">
                {rooms.map(room => (
                    <div key={room.id}
                    className={`p-2 rounded-md shadow-lg border border-gray-400
                    ${room.status == 'active' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className="text-xl font-semibold">{room.name}</div>
                        <div>{room.roomType.name}</div>
                        <div>
                        ค่าเช่า:

                        <span className="font-semibold">
                            {room.roomType.price.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex gap-1 mt-2">
                        {room.status == 'active' ? (
                        <Button variant='destructive' onClick={async () => {
                            const buttonConfirm = await Swal.fire({
                                icon: 'question',
                                title: 'ยืนยันการลบ',
                                text: 'คุณต้องการลบห้องพักนี้หรือไม่?',
                                showCancelButton: true,
                                showConfirmButton: true,
                            });

                            if (buttonConfirm.isConfirmed) {
                                // ลบห้องพัก
                                await axios.delete('/api/room/' + room.id);
                                // รีเฟรชหน้า
                                fetchData();
                            }
                        }}>
                            <i className="fa fa-trash mr-2"></i>
                            ลบ
                        </Button>
                        ) : (
                            <Button variant='default' onClick={async () => {
                                const buttonConfirm = await Swal.fire({
                                    icon: 'question',
                                    title: 'ยืนยันการเปิดใช้งาน',
                                    text: 'คุณต้องการเปิดใช้งานห้องพักนี้หรือไม่?',
                                    showCancelButton: true,
                                    showConfirmButton: true,
                                });

                                if (buttonConfirm.isConfirmed) {
                                    // เปิดใช้งานห้องพัก
                                    await axios.put('/api/room/' + room.id);
                                    // รีเฟรชหน้า
                                    fetchData();
                                }
                            }}>
                                <i className="fa fa-undo mr-2"></i>
                                เปิดใช้งาน
                            </Button>
                        )}
                  </div>
                    </div>
                ))}
            </div>
            {/* Modal สำหรับเพิ่มห้องพัก */}
            <Modal title="เพิ่มห้องพัก" isOpen={isOpen} onClose={() => setIsOpen(false)}>

                <form onSubmit={handleSave}>
                    <div>
                        <label>ประเภทห้องพัก</label>
                        <select
                            className="input-modal"
                            value={roomTypeId}
                            onChange={(e) => setRoomTypeId(e.target.value)}>
                            {roomTypes.map((roomType) => (
                                <option key={roomType.id} value={roomType.id}>
                                    {roomType.name}
                                </option>
                            ))}
                        </select>                 
                    </div>

                    <div className="flex gap-4 mt-3">
                        <div>
                            <label>ตึก</label>
                            <input type="text" className="input-modal" value={towerName}
                            onChange={(e) => setTowerName(e.target.value)} />
                        </div>
                        <div>
                            <label>จำนวนชั้น</label>
                            <input type="number" className="input-modal" value={totalLevel}
                            onChange={(e) => setTotalLevel(Number(e.target.value))} />
                        </div>
                        <div>
                            <label>จำนวนห้องต่อชั้น</label>
                            <input type="number" className="input-modal" value={totalRoom}
                            onChange={(e) => setTotalRoom(Number(e.target.value))} />
                        </div>
                    </div>
                    <Button type="submit" className="mt-3">
                        <i className="fa fa-check mr-2"></i>
                        บันทึก
                    </Button>
                </form>
            </Modal>
        </>
    );
}







