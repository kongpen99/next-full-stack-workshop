// 'use clienr';

// // ใช่งาน component จาก library
// import { useState, useEffect } from "react";
// import axios from 'axios';
// // Import ชาร์ตจาก library recharts
// import {
//     PieChart,
//     Pie,
//     Cell,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer
// } from 'recharts';

// interface DashboardData {
//     summary: {
//         totalRooms: number;
//         occupiedRooms: number;
//         emptyRooms: number;
//         totalGuests: number;
//         totalRevenue: number;
//     };
//     occupancyData: Array<{
//         name: string;
//         value: number;
//         color: string;
//     }>;
//     roomTypeData: Array<{
//         name: string;
//         value: number;
//     }>;
//     monthlyRevenueData: Array<{
//         month: string;
//         amount: number;
//     }>;
//     genderData: Array<{
//         name: string;
//         value: number;
//         color: string;
//     }>;
// }
// export default function Dashboard() {
//     const [data, setData] = useState<DashboardData | null>(null);
//     const [loading, setloading] = useState(true);

//     useEffect(() => {
//         fetchStats();
//     }, []);

//     const fetchStats = async () => {
//         try {
//             const response = await axios.get('/api/dashboard/stats');
//             setData(response.data);
//         } catch (error) {
//             console.error("Error fetching stats", error);
//         }
//     };
// }





