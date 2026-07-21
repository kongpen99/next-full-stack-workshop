import Button from "@/components/button";
export default function RoomTransferPage(){
    return (
        <div className="p-5">
                <div className="flex flex-col justify-between items-start mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">ขอย้ายห้องพัก</h1>
                            <p className="text-gray-600">จัดการข้อมูลการย้ายห้องของผู้เข้าพัก</p>
                        </div>
                    <div className="flex gap-2">
                        <Button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                            <i className="fa-solid fa-plus"></i>
                            เพิ่มรายการ
                        </Button>
                        <Button className="px-4 py-2 bg-green-500 text-white rounded-lg">
                            <i className="fa-solid fa-arrows-rotate"></i>
                            รีเฟรส
                        </Button>
                    </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 font-semibold text-gray-700">ห้องเดิม</th>
                                <th className="p-4 font-semibold text-gray-700 text-center">
                                    <i className="fa-solid fa-right-left"></i>
                                    </th>
                                <th className="p-4 font-semibold text-gray-700">ห้องใหม่</th>
                                <th className="p-4 font-semibold text-gray-700">วันที่ย้าย</th>
                                <th className="p-4 font-semibold text-gray-700">ค่าย้าย</th>
                                <th className="p-4 font-semibold text-gray-700">เหตุผล</th>
                                <th className="p-4 font-semibold text-gray-700">สถานะ</th>
                                <th className="p-4 font-semibold text-gray-700 text-center">
                                    จัดการ
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>

            </div>
        </div>
    );
}