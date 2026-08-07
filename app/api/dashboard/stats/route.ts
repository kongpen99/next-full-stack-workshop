import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
    try {
        // 1. Summary Metrics
        const totalRooms = await prisma.room.count({
            where: { status: "active" }
        });

        // ห้องที่มีผู้เข้าพักในระบบ statusEmpty คือ 'no' (หรือ 'occupied', 'accupied')
        const occupiedRooms = await prisma.room.count({
            where: {
                status: "active",
                statusEmpty: { in: ["no", "accupied", "occupied"] }
            }
        });

        const emptyRooms = Math.max(0, totalRooms - occupiedRooms);

        const totalGuests = await prisma.booking.count({
            where: { status: "active" }
        });

        // รายได้รวม (เช็คจาก status: 'paid' หรือทั้งหมดถ้ายังไม่มีชำระ)
        const paidRevenueResult = await prisma.bill.aggregate({
            where: { status: "paid" },
            _sum: { totalAmount: true }
        });

        const allRevenueResult = await prisma.bill.aggregate({
            _sum: { totalAmount: true }
        });

        const totalRevenue = paidRevenueResult._sum.totalAmount || allRevenueResult._sum.totalAmount || 0;

        // 2. Room Occupancy Data (Always provide valid slice values for chart)
        const occupancyData = [
            { name: "มีผู้เช่า", value: occupiedRooms > 0 ? occupiedRooms : 0, color: "#EF4444" },
            { name: "ห้องว่าง", value: emptyRooms > 0 ? emptyRooms : (totalRooms === 0 ? 1 : 0), color: "#10B981" }
        ];

        // 3. Room Type Data
        const roomTypes = await prisma.roomType.findMany({
            where: { status: "active" },
            include: {
                _count: {
                    select: { rooms: true }
                }
            }
        });

        const roomTypeData = roomTypes.length > 0
            ? roomTypes.map((rt) => ({ name: rt.name, value: rt._count.rooms }))
            : [
                { name: "ห้องพัดลม", value: 10 },
                { name: "ห้องแอร์", value: 15 },
                { name: "ห้องวีไอพี", value: 5 }
            ];

        // 4. Gender Data
        const maleGuests = await prisma.booking.count({
            where: { status: "active", gender: "male" }
        });
        const femaleGuests = await prisma.booking.count({
            where: { status: "active", gender: "female" }
        });
        const otherGuests = await prisma.booking.count({
            where: {
                status: "active",
                gender: { notIn: ["male", "female"] }
            }
        });

        const genderData = [
            { name: "ชาย", value: maleGuests > 0 ? maleGuests : 0, color: "#3B82F6" },
            { name: "หญิง", value: femaleGuests > 0 ? femaleGuests : 0, color: "#EC4899" },
            ...(otherGuests > 0 ? [{ name: "อื่นๆ", value: otherGuests, color: "#8B5CF6" }] : [])
        ];

        // 5. Monthly Revenue Data (Pre-populate last 6 months)
        const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const monthlyRevenueMap: Record<string, { total: number; temp: number; daily: number; monthly: number }> = {};

        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = `${monthNames[d.getMonth()]} ${d.getFullYear() + 543}`;
            monthlyRevenueMap[label] = { total: 0, temp: 0, daily: 0, monthly: 0 };
        }

        const bills = await prisma.bill.findMany({
            select: {
                totalAmount: true,
                billDate: true,
                createdAt: true,
                room: {
                    select: {
                        roomType: {
                            select: { name: true }
                        }
                    }
                },
                booking: {
                    select: {
                        remark: true,
                        stayAt: true,
                        stayTo: true
                    }
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        bills.forEach((bill) => {
            const date = new Date(bill.billDate || bill.createdAt);
            const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear() + 543}`;

            if (!monthlyRevenueMap[monthLabel]) {
                monthlyRevenueMap[monthLabel] = { total: 0, temp: 0, daily: 0, monthly: 0 };
            }

            const roomTypeName = bill.room?.roomType?.name || "";
            const remark = bill.booking?.remark || "";
            const textToMatch = (roomTypeName + " " + remark).toLowerCase();

            let isTemp = false;
            let isDaily = false;

            if (textToMatch.includes("ชั่วคราว") || textToMatch.includes("temporary") || textToMatch.includes("รายชั่วโมง")) {
                isTemp = true;
            } else if (textToMatch.includes("รายวัน") || textToMatch.includes("daily")) {
                isDaily = true;
            } else if (bill.booking?.stayAt && bill.booking?.stayTo) {
                const diffMs = new Date(bill.booking.stayTo).getTime() - new Date(bill.booking.stayAt).getTime();
                const diffDays = Math.ceil(diffMs / (1000 * 3600 * 24));
                if (diffDays <= 1) {
                    isTemp = true;
                } else if (diffDays < 25) {
                    isDaily = true;
                }
            }

            const amount = bill.totalAmount || 0;
            monthlyRevenueMap[monthLabel].total += amount;

            if (isTemp) {
                monthlyRevenueMap[monthLabel].temp += amount;
            } else if (isDaily) {
                monthlyRevenueMap[monthLabel].daily += amount;
            } else {
                monthlyRevenueMap[monthLabel].monthly += amount;
            }
        });

        const monthlyRevenueData = Object.entries(monthlyRevenueMap).map(([month, data]) => ({
            month,
            amount: data.total,
            "ชั่วคราว": data.temp,
            "รายวัน": data.daily,
            "รายเดือน": data.monthly
        }));

        return NextResponse.json({
            summary: {
                totalRooms,
                occupiedRooms,
                emptyRooms,
                totalGuests,
                totalRevenue
            },
            occupancyData,
            roomTypeData,
            monthlyRevenueData,
            genderData
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
