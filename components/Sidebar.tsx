'use client';

import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className="w-84 h-screen bg-gray-700 text-white p-4">
            <div className="mb-4 text-center bg-gray-900">
                <div className="text-2xl font-bold">K&T Apartment 1.0</div>
                <div className="text-xl mt-2">โปรแกรมบริหารจัดการอหอพักพาร์ตเมนต์</div>
            </div>
            <nav className="p-5">
            <ul className="sidebar-menu">
                <li>
                    <Link href="/home/apartment" className="flex items-center p-2">
                        <i className="fas fa-home w-7"></i>
                        <span className="ml-3">ข้อมูลอพาร์ตเมนต์</span>
                    </Link>
                </li>
                <li>
                    <Link href="/home/room-type" className="flex items-center p-2">
                        <i className="fas solid fa-bed w-7"></i>
                        <span className="ml-3">ประเภทห้องพัก</span>
                    </Link>
                </li>
                <li>
                    <Link href="/home/water-and-electricity-log" className="flex items-center p-2">
                        <i className="fas solid fa-note-sticky w-7"></i>
                        <span>บันทึกมิเตอร์น้ำ,ไฟฟ้า</span>
                    </Link>
                </li>
                    <li>
                        <Link href="/home/room" className="flex items-center p-2">
                            <i className="fas solid fa-box w-7"></i>
                            <span className="ml-3">ห้องพัก</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/home/money-added" className="flex items-center p-2">
                            <i className="fas solid fa-database w-7"></i>
                            <span className="ml-3">ค่าใช้จายเงินเพิ่ม</span>
                        </Link>
                    </li>
                   <li>
                        <Link href="/home/water-and-electricity-price"
                            className="flex items-center gap-2">
                            <i className="fa-solid fa-wand-magic-sparkles w-7"></i>
                            <span>ราคาค่าน้ำและค่าไฟ</span>
                        </Link>
                    </li>
                   <li>
                        <Link href="/home/bills"
                            className="flex items-center gap-2">
                            <i className="fa-solid fa-file-invoice w-7"></i>
                            <span>รายการบิล/ใบเสร็จ</span>
                        </Link>
                    </li>
            </ul>
            </nav>
        </div>
    )
}


