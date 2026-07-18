"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "@/components/ui/button";
import modal from "@components/ui/modal";


interface Bill {
    id: String;
    roomId: String;
    bookingId: String;
    billData: String;
    totalAmount: Number;
    waterUnit: Number;
    electricityUnit: Number;
    waterCost: Number;
    electricityCost: Number;
    roomPrice: Number;
    additionalCode:number;
    status:String;
    room:{
        id: String;
        name: String;

    },
    booking:{
        id: String;
        customerName: string;
    },
    billItems:{
        id: String;
        name: String;
        amount: number;
        type: String;
    }[],

}

export default function BillsPage() {
   const [bills, setBills] = useState<Bill[]>([]);
   const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
   const [paymentDate, setPaymentDate] = useState<string>('');
   const [lateFee, setLateFee]= useState<number>(0);
   const [isOpen,setIsOpen]= useState(false);


   const fetchData =  async () => {
    try {
        const response = await axios.get('/api/bills');
        setBills(response.data);    
        
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Failed to fetch bills',
            icon: 'error'
        });
    }
   };

   useEffect(() => {
    fetchData();
   }, []);

   const handLeReceivePayment = async (bill: Bill) => {
    setSelectedBill(bill);
    setLateFee(0);
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setIsOpen(true);
   };

   const handLeSubmitPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedBill) return;

    try {
        const payload = {
            billId: selectedBill.id,
            paymentDate: paymentDate,
            lateFee:lateFee,
            status: 'paid',
        }
        await axios.put(`/api/bills/${selectedBill?.id}`, payload);
        fetchData();
        setIsOpen(false);
        setSelectedBill(null); 

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: (error as Error).message,
                icon: 'error'
            });
        }
   };
        const getStatusColor = (status: string) => {
            switch (status) {
                case 'paid':
                    return 'text-green-600 bg-green-100';
                case 'pending':
                    return 'text-yellow-600 bg-yellow-100';
                case 'overdue':
                    return 'text-red-600 bg-red-100';
                default:
                    return 'text-gray-600 bg-gray-100';
            }
        };

        const getStatusText = (status: string) => {
            switch (status) {
                case 'paid':
                    return 'ชำระแล้ว';
                case 'pending':
                    return 'รอชำระ';
                case 'overdue':
                    return 'เกินกำหนด';
                default:
                    return 'status';
            }
        };


        const formateDate = (dateString : string) => {
            return new Date(dateString).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }
   
  return (
    <div>
      <h1>Bills</h1>
    </div>
  );
}
