'use client';

import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className="w-84 h-screen bg-gray-700 text-white p-4">
            <div className="mb-4 text-center bg-gray-900">
                <div className="text-2xl font-bold">K&T Apartment 1.0</div>
                <div className="text-xl mt-2">โปรแกรมบริหารจัดการอหอพักพาร์ตเมนต์</div>
            </div>
            <nav className="p-5"></nav>
            <ul className="sidebar-menu">
                <li>
                    <Link href="/home/apartment" className="flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-gray-100">
                        <i className="fas fa-home w-7"></i>
                        <span className="ml-3">ข้อมูลอพาร์ตเมนต์</span>
                    </Link>
                </li>
                <li>
                    <Link href="/home/room-type" className="flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-gray-100">
                        <i className="fas solid fa-bed w-7"></i>
                        <span className="ml-3">ประเภทห้องพัก</span>
                    </Link>
                </li>
                    <li>
                        <Link href="/home/room" className="flex items-center p-2 text-base font-normal text-gray-300 rounded-lg hover:bg-gray-100">
                            <i className="fas solid fa-box w-7"></i>
                            <span className="ml-3">ห้องพัก</span>
                        </Link>
                    </li>
            </ul>
        </div>
    )
}
