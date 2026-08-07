// สร้างเมนูเพิ่มเงิน

'use client';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { MoneyAddedInterface } from '@/interface/MoneyAddedInterface';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';

export default function MoneyAddedPage() {
    const [moneyAdded, setMoneyAdded] = useState<MoneyAddedInterface[]>([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/money-added');
            setMoneyAdded(response.data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: (error as Error).message,
            })
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม

    const handLeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = {
                name: name,
                amount: amount
            }
            if (id) {
                // update เพื่อทำการเปลี่ยนข้อมูล
                await axios.put(`/api/money-added/${id}`, payload);
            } else {
                // create เพื่อทำการเพิ่มข้อมูลใหม่
                await axios.post('/api/money-added', payload);
            }

            fetchData();
            setIsOpen(false);
            setId('');
            setName('');
            setAmount(0);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: (error as Error).message,
            });
        }
    };

    return (
        <div>
            <h1>ค่าใช้จ่ายเพิ่มเติม</h1>
            <Button onClick={() => setIsOpen(true)}>
                เพิ่มค่าใช้จ่าย
            </Button>

            <table className="table mt-2">
                <thead>
                    <tr>
                        <th className="text-left">ชื่อค่าใช้จ่าย</th>
                        <th className="text-right">จำนวนเงิน</th>
                        <th className="w-[160px]"></th>
                    </tr>
                </thead>
                <tbody>
                    {moneyAdded.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td className="text-right">{item.amount}</td>
                            <td>
                                <div className="flex gap-1">
                                    <Button onClick={() => {
                                        setId(item.id);
                                        setName(item.name);
                                        setAmount(item.amount);
                                        setIsOpen(true);
                                    }}>
                                        <i className="fa fa-pencil"></i>
                                        แก้ไข
                                    </Button>

                                    <Button variant="destructive" onClick={async () => {

                                        try {
                                            const confirmButton = await Swal.fire({
                                                title: 'คุณต้องการลบค่าใช้จ่ายนี้หรือไม่',
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'ลบ',
                                                cancelButtonText: 'ยกเลิก'
                                            })
                                            // ลบค่าใช้จ่าย
                                            if (confirmButton.isConfirmed) {
                                                await axios.delete(`/api/money-added/${item.id}`);
                                                fetchData();
                                            }
                                        } catch (error) {
                                            Swal.fire({
                                                title: 'เกิดข้อผิดพลาด',
                                                icon: 'error',
                                                text: (error as Error).message
                                            })
                                        }
                                    }}>
                                        <i className="fa fa-trash"></i>
                                        ลบ
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {/* Modal สำหรับเพิ่มค่าใช้จ่าย */}
                    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="เพิ่มค่าใช้จ่าย">
                        <form onSubmit={handLeSubmit}>

                            <div className="mb-4">
                                <label htmlFor="name">ชื่อค่าใช้จ่าย</label>
                                <input type="text" id="name" value={name}
                                    onChange={(e) => setName(e.target.value)} className="input-modal" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="amount">จำนวนเงิน</label>
                                <input type="number" id="amount" value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))} className="input-modal" />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="btn btn-primary">
                                    <i className="fa fa-check"></i>
                                    บันทึกเพิ่มค่าใช้จ่าย
                                </button>
                            </div>
                        </form>
                    </Modal>
                </tbody>
            </table>
        </div>
    );
}