'use client';

// ใช้งาน component จาก library
import { useState, useEffect } from "react";
import axios from 'axios';
// Import ชาร์ตจาก library recharts
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface DashboardData {
    summary: {
        totalRooms: number;
        occupiedRooms: number;
        emptyRooms: number;
        totalGuests: number;
        totalRevenue: number;
    };
    occupancyData: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    roomTypeData: Array<{
        name: string;
        value: number;
    }>;
    monthlyRevenueData: Array<{
        month: string;
        amount: number;
        "ชั่วคราว"?: number;
        "รายวัน"?: number;
        "รายเดือน"?: number;
    }>;
    genderData: Array<{
        name: string;
        value: number;
        color: string;
    }>;
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setloading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setloading(true);
        try {
            const response = await axios.get('/api/dashboard/stats');
            setData(response.data);
        } catch (error) {
            console.error("Error fetching stats", error);
        } finally {
            setloading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <div className="h-8 w-48 bg-gray-300 rounded-md"></div>
                    <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
                </div>

                {/* KPI Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="h-8 w-24 bg-gray-300 rounded-md"></div>
                        </div>
                    ))}
                </div>

                {/* Charts Skeleton Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                            <div className="h-6 w-40 bg-gray-300 rounded"></div>
                            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                                <div className="h-24 w-24 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const summary = data?.summary || {
        totalRooms: 0,
        occupiedRooms: 0,
        emptyRooms: 0,
        totalGuests: 0,
        totalRevenue: 0
    };

    const formatBaht = (amount: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-gray-200 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <i className="fa-solid fa-chart-line text-blue-600"></i>
                        แดชบอร์ดภาพรวมระบบ (Dashboard Analytics)
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">สรุปรายงานแยกประเภทกราฟอิสระ พร้อมระบบวิเคราะห์เชิงลึก</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition shadow-sm"
                >
                    <i className="fa-solid fa-rotate-right"></i>
                    รีเฟรชข้อมูล
                </button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Total Rooms */}
                <div className="bg-blue-500 p-5 rounded-xl border border-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium">ห้องพักทั้งหมด</span>
                        <div className="w-9 h-9 bg-white text-blue-600 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-bed text-lg"></i>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">
                        {summary.totalRooms} <span className="text-xs font-normal text-white">ห้อง</span>
                    </div>
                </div>

                {/* Occupied Rooms */}
                <div className="bg-red-300 p-5 rounded-xl border border-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium">ห้องมีผู้เช่า</span>
                        <div className="w-9 h-9 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-door-closed text-lg"></i>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">
                        {summary.occupiedRooms} <span className="text-xs font-normal text-white">ห้อง</span>
                    </div>
                </div>

                {/* Available / Empty Rooms */}
                <div className="bg-emerald-300 p-5 rounded-xl border border-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium">ห้องว่าง</span>
                        <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-door-open text-lg"></i>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">
                        {summary.emptyRooms} <span className="text-xs font-normal text-white">ห้อง</span>
                    </div>
                </div>

                {/* Total Guests */}
                <div className="bg-orange-300 p-5 rounded-xl border border-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium">ผู้เช่าปัจจุบัน</span>
                        <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-users text-lg"></i>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mt-2">
                        {summary.totalGuests} <span className="text-xs font-normal text-white">คน</span>
                    </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-yellow-100 p-5 rounded-xl border border-white shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between text-black">
                        <span className="text-sm font-medium">รายได้รวม</span>
                        <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-baht-sign text-lg"></i>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-black mt-2">
                        {formatBaht(summary.totalRevenue)}
                    </div>
                </div>
            </div>

            {/* SECTION 1: กราฟรายได้แยกตามประเภทห้องพัก (3 Separate Bar Charts) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <i className="fa-solid fa-coins text-amber-500 text-xl"></i>
                    <h2 className="text-xl font-bold text-gray-800">
                        รายงานแนวโน้มรายได้แยกประเภท (Revenue by Rental Type)
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 1. กราฟรายได้ห้องพัก ชั่วคราว */}
                    <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                                รายได้ห้องพัก ชั่วคราว
                            </h3>
                            <span className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                                รายชั่วโมง
                            </span>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.monthlyRevenueData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                                    <Tooltip formatter={(val: any) => [formatBaht(Number(val || 0)), 'ชั่วคราว']} />
                                    <Bar dataKey="ชั่วคราว" name="ชั่วคราว" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. กราฟรายได้ห้องพัก รายวัน */}
                    <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                                รายได้ห้องพัก รายวัน
                            </h3>
                            <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                รายวัน
                            </span>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.monthlyRevenueData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                                    <Tooltip formatter={(val: any) => [formatBaht(Number(val || 0)), 'รายวัน']} />
                                    <Bar dataKey="รายวัน" name="รายวัน" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 3. กราฟรายได้ห้องพัก รายเดือน */}
                    <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                                รายได้ห้องพัก รายเดือน
                            </h3>
                            <span className="text-xs font-medium px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                                รายเดือน
                            </span>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.monthlyRevenueData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                                    <Tooltip formatter={(val: any) => [formatBaht(Number(val || 0)), 'รายเดือน']} />
                                    <Bar dataKey="รายเดือน" name="รายเดือน" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: กราฟโครงสร้างการดำเนินงาน (3 Separate Analytics Charts) */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <i className="fa-solid fa-chart-pie text-purple-600 text-xl"></i>
                    <h2 className="text-xl font-bold text-gray-800">
                        รายงานสัดส่วนการบริหารจัดการ (Operational Analytics)
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 1. กราฟสัดส่วนการครองห้องพัก */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-pie-chart text-red-500"></i>
                            สัดส่วนการครองห้องพัก (Occupancy Rate)
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.occupancyData || [
                                            { name: "มีผู้เช่า", value: summary.occupiedRooms, color: "#EF4444" },
                                            { name: "ห้องว่าง", value: summary.emptyRooms || 1, color: "#10B981" }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {(data?.occupancyData || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => [`${value ?? 0} ห้อง`, 'จำนวน']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. กราฟจำแนกประเภทห้องพัก */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-layer-group text-purple-500"></i>
                            สัดส่วนจำนวนห้องตามประเภท (Room Types)
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.roomTypeData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(val: any) => [`${val ?? 0} ห้อง`, 'จำนวนห้อง']} />
                                    <Bar dataKey="value" name="จำนวนห้อง" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 3. กราฟจำแนกเพศผู้เช่า */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                        <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-users text-pink-500"></i>
                            สัดส่วนเพศผู้เช่า (Gender Distribution)
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.genderData && data.genderData.length > 0 ? data.genderData : [
                                            { name: "ชาย", value: 0, color: "#3B82F6" },
                                            { name: "หญิง", value: 0, color: "#EC4899" }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={85}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {(data?.genderData || []).map((entry, index) => (
                                            <Cell key={`gender-cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => [`${value ?? 0} คน`, 'จำนวน']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
