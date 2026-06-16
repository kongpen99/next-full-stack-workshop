'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Swal  from "sweetalert2";

export default function ApartmentPage() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [lineId, setLineId] = useState("");
    const [taxCode, setTaxCode] = useState("");


    useEffect(() => {
        // ดึงข้อมูลอพาร์ตเมนต์จาก API
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("/api/apartment");
            const data = await response.data;

                if (data.name) {
                setName(data.name);
                setAddress(data.address);
                setPhone(data.phone);
                setEmail(data.email || "");
                setLineId(data.lineId || "");
                setTaxCode(data.taxCode);
            }
            // ประมวลผลข้อมูลที่ได้จาก API
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: (error as Error).message
            })
        }
    }

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        name: name,
        address: address,
        phone: phone,
        email: email,
        lineId: lineId,
        taxCode: taxCode,
      };
      const response = await axios.post("/api/apartment", payload);
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Apartment updated successfully",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };    return (
        <div>
            <h1 className="text-2xl font-semibold">ข้อมูลอพาร์ตเมนต์</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
                <div>
                    <div>ชื่ออพาร์ตเมนต์</div>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} /> 
                </div>
                <div>
                    <div>ที่อยู่</div>
                    <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} /> 
                </div>
                <div>
                    <div>เบอร์โทรศัพท์</div>
                    <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} /> 
                </div>
                <div>
                    <div>อีเมล</div>
                    <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /> 
                </div>
                <div>
                    <div>ID ไลน์</div>
                    <input className="input" value={lineId} onChange={(e) => setLineId(e.target.value)} /> 
                </div>
                <div>
                    <div>เลขประจำตัวผู้เสียภาษี</div>
                    <input className="input" value={taxCode} onChange={(e) => setTaxCode(e.target.value)} /> 
                </div>
                <div>
                <button type="submit" className="btn-primary">
                    <i className="fas fa-check mr-2"></i>
                    บันทึก
                </button>
                </div>
             </form>
        </div>
    )

}    
