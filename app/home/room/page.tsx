 // เขียน Code ในหน้าMenu Room (ห้องพัก Sidebar)

    'use client';

    import { useState, useEffect } from 'react';
    import Swal from 'sweetalert2';
    import axios from 'axios';
    import { RoomInterface } from '@/interface/RoomInterface';
    import RoomTypeInterface from '@/interface/RoomTypeInterface';
    import Button from '@/components/button';
    import Modal from '@/components/ui/modal';
    import dayjs from 'dayjs';

    // หน้าห้องพัก
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

    // booking ฟังก์ชัน
    // การจองห้องพัก

    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [isOpenBooking, setIsOpenBooking] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [cardId, setCardId] = useState('');
    const [gender, setGender] = useState('');
    const [roomId, setRoomId] = useState('');
    const [remark, setRemark] = useState(''); 
    const [deposit, setDeposit] = useState(0);
    const [stayAt, setStayAt] = useState(new Date());
    const [stayTo, setStayTo] = useState<Date | null>(null);

    // Log Water and Electricity
    const [waterUnit, setWaterUnit] = useState(0);
    const [electricityUnit, setElectricityUnit] = useState(0);

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

        useEffect(() => {
            if (selectedRoomId) {
                const lastBooking = rooms.find(room => room.id === selectedRoomId)?.bookings[0];

                if (lastBooking) {
                    setCustomerName(lastBooking.customerName);
                    setCustomerPhone(lastBooking.customerPhone);
                    setCustomerAddress(lastBooking.customerAddress);
                    setCardId(lastBooking.cardId);
                    setGender(lastBooking.gender);
                    setDeposit(lastBooking.deposit);
                    setStayAt(lastBooking.stayAt);

                    if (lastBooking.stayTo) {
                        setStayTo(lastBooking.stayTo);
                    }

                    setRemark(lastBooking.remark);
                    setRoomId(lastBooking.roomId);
                }
            }
        }, [selectedRoomId]);
        
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

   
    // เขียนฟังก์ชันจองห้อง
        const handLeBooking =  async (form: React.FormEvent<HTMLFormElement>) => {
            form.preventDefault();
            // TODO: Implement booking logic

            try {
                const payload = {
                    customerName: customerName,
                    customerPhone: customerPhone,
                    customerAddress: customerAddress,
                    gender: gender,
                    cardId: cardId,
                    roomId: selectedRoomId,
                    remark: remark,
                    deposit: deposit,
                    stayAt: stayAt,
                    stayTo: stayTo,
                    waterUnit: waterUnit,
                    electricityUnit: electricityUnit,
                };

                await axios.post('/api/booking', payload);
                fetchData();
                setIsOpenBooking(false);
                clearBookingForm();
                
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: (error as Error).message,
                })
            }
        }

        // ทำฟังก์ชันล้างฟอร์มการจอง
        const clearBookingForm = () => {
            setBookingId('');
            setCustomerName('');
            setCustomerPhone('');
            setCustomerAddress('');
            setGender('');
            setCardId('');
            setSelectedRoomId('');
            setRemark('');
            setDeposit(0);
            setStayAt(new Date());
            setStayTo(new Date());
           
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
                    ${room.status == 'active' ? 'bg-green-100' : 'bg-red-100'}
                    ${room.statusEmpty == 'no' ? 'bg-red-100' : 'bg-green-100'}
                    `}>
                        <div className="text-xl font-semibold">{room.name}</div>
                        <div>{room.roomType.name}</div>
                        <div>
                        ค่าเช่า:
                        <span className="font-semibold">
                            {room.roomType.price.toLocaleString()}
                        </span>
                    </div>

                        {room.statusEmpty == 'no' ?(
                            <div className="text-red-500 font-semibold">
                                <i className="fa fa-user mr-2"></i>
                                มีผู้เข้าพัก
                                </div>
                        ) : (
                            <div className="text-green-400 font-semibold">
                                <i className="fa fa-check mr-2"></i>
                                ว่าง
                                </div>
                        )}

                    <div className="flex gap-1 mt-2">
                        {room.status == 'active' ? (
                        <>
                            <Button className="bg-blue-400 hover:bg-blue-600"
                            onClick={() => {
                                setSelectedRoomId(room.id);
                                setIsOpenBooking(true);
                            }}>
                                
                                <i className="fa fa-user mr-2"></i>
                                ผู้เข้าพัก
                            </Button>
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
                        </>

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

            {/* เขียนฟอร์มจองห้อง เป็นแบบ popup ขึ้นมา */}
            <Modal title='ผูู้เข้าพัก' isOpen={isOpenBooking} onClose={() => setIsOpenBooking (false)}>
                <form onSubmit={handLeBooking} className="flex flex-col gap-2">
                    <div>
                        <label> ห้องพัก</label>
                        <input type="text" 
                        className="bg-blue-200 px-4 py-2 w-full border border-gray-600 shadow-lg rounded-lg"  
                        value={rooms.find((room) => room.id === selectedRoomId)?.name} disabled={true} />
                    </div>

                    <div className="flex gap-2">
                        <div>
                            <div>ชื่อผู้เข้าพัก</div>
                            <input type="text" className="input-modal" value={customerName} 
                            onChange={(e) => setCustomerName(e.target.value)} />
                        </div>
                        <div>
                            <div>เบอร์โทรศัพท์</div>
                            <input type="text" className="input-modal" value={customerPhone} 
                            onChange={(e) => setCustomerPhone(e.target.value)} />
                        </div>
                    </div>
                        <div>
                            <div>ที่อยู่</div>
                            <input type="text" className="input-modal" value={customerAddress} 
                            onChange={(e) => setCustomerAddress(e.target.value)} />
                        </div>
                        <div className="flex gap-2">

                            <div className="w-full">
                                <div>เลขบัตรประชาชน</div>
                                <input type="text" className="input-modal" value={cardId} 
                                onChange={(e) => setCardId(e.target.value)} />
                            </div>
                            <div className="w-full">
                                <div>เพศ</div>
                                <select className="input-modal" value={gender} 
                                onChange={(e) => setGender(e.target.value)}>
                                    <option value="male">ชาย</option>
                                    <option value="female">หญิง</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <div>
                                <div>เงินมัดจำ</div>
                                <input type="text" className="input-modal" value={deposit} 
                                onChange={(e) => setDeposit(Number(e.target.value))} />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-full">
                                <div>วันทีเข้าพัก</div>
                                <input type="date" className="input-modal"
                                value={dayjs(stayAt).format('YYYY-MM-DD')} 
                                onChange={(e) => setStayAt(new Date(e.target.value))} />
                            </div>
                            <div className="w-full">
                                <div>วันที่ออก</div>
                                <div className="flex gap-2">
                                <input type="date" className="input-modal"
                                value={dayjs(stayTo).format('YYYY-MM-DD')} 
                                onChange={(e) => setStayTo(new Date(e.target.value))} />
                            <Button type="button" className="w-30" variant="destructive"
                                onClick={() => setStayTo(null)}>
                                    ไม่กำหนด
                            </Button>
                        </div>
                            </div>
                        </div>
                        <div>
                            <div>หมายเหตุ</div>
                            <input type="text" className="input-modal" 
                            value={remark} 
                            onChange={(e) => setRemark(e.target.value)} />
                        </div>
                            <div>
                                <div>หน่วยน้ำ</div>
                                <input type="number" className="input-modal" 
                                value={waterUnit} 
                                onChange={(e) => setWaterUnit(Number(e.target.value))} />
                            </div>
                            <div>
                                <div>หน่วยไฟฟ้า</div>
                                <input type="number" className="input-modal" 
                                value={electricityUnit} 
                                onChange={(e) => setElectricityUnit(Number(e.target.value))} />
                            </div>
                        <div> 
                            <Button type='submit' className='mt-3 bg-blue-500 hover:bg-green-600'>
                                <i className="fa-solid fa-floppy-disk"></i> 
                                    บันทึก
                                </Button>
                        </div>
                </form>
            </Modal>
        </>
    );
}







