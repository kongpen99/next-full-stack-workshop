'use client'

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import { RoomInterface } from '@/interface/RoomInterface'
import  {TowerInterface} from '@/interface/TowerInterface'
import Button from '@/components/ui/button'


export default function WaterAndElectricityLogPage() {
    const [rooms, setRooms] = useState<RoomInterface[]>([]);
    const [towers, setTowers] = useState<TowerInterface[]>([]);

    useEffect(() => {
        fetchDataTowers();
    }, []);

    useEffect(() => {
        if (towers.length > 0) {
            fetchDataRooms(towers[0].towerName);
        }
       
    }, [towers]);

    const handleSave = async (roomName: string, waterMeter: number, electricityMeter: number) => {
        try {
                const payload = {
                    roomName: roomName,
                    waterMeter: waterMeter,
                    electricityMeter: electricityMeter,
                };
                await axios.post('/api/water-and-electricity-log', payload);
           
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (error as Error).message,
            });
        }
    }
    
    const fetchDataTowers = async () => {
        try {
            const response = await axios.get('/api/room/tower-name');
            setTowers(response.data);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: (error as Error).message,
            });
        }
    }

    const fetchDataRooms = async (towerName: string) => {
        try {
            const response = await axios.get(`/api/room/filter-by-tower/${towerName}`);
            setRooms(response.data);
        } catch (error) {
            Swal.fire({

                title: 'Error',
                icon: 'error',
                text: (error as Error).message,
            });
        }
    }
    // TODO: Implement update room data function
    const  handLeUpdateRoomData = (
            roomName:string,
            newWaterUnit: number,
            newElectricityUnit: number
    ) => {
        setRooms(prev => {

            const index=  prev.findIndex(r => r.name === roomName);
            if (index === -1) return prev;
            
            const roomsCopy = [...prev];
            const room = roomsCopy[index];
            const booking = room.bookings[0];

          

        })


        
    }


    return (
        <div>
            <h1 className="text-2xl font-semibold">บันทึกมิเตอร์น้ำ,ไฟฟ้า</h1>
                <div>
                    {towers.map((tower) => (
                    <Button 
                    onClick={() => fetchDataRooms(tower.towerName)}
                        key={ tower.towerName} value={tower.towerName} size="lg">   
                        อาคาร {tower.towerName} 
                    </Button>
                    ))}
                </div> 

                {rooms.length > 0 ? (
                    <table className="table mt-2">
                        <thead>
                            <tr>
                                <th>เลขที่ห้อง</th>
                                <th>มิเตอร์น้ำ</th>
                                <th>มิเตอร์ไฟฟ้า</th>
                            </tr>
                        </thead>
                        <tbody>

                            {rooms.map((room) => (
                                <tr key={room.id }>
                                    <td>{room.name }</td>
                                    <td><input type="number" className="input text-right"
                                     value={room.bookings[0]?.waterLogs[0]?.waterUnit}
                                     onChange={() => {}}
                                     onBlur={(e) => handleSave(room.name, parseInt(e.target.value), 0)}
                                    /></td>
                                    <td><input type="number" className="input text-right"
                                    value={room.bookings[0]?.electricityLogs[0]?.electricityUnit}
                                    onChange={() => {}}
                                    onBlur={(e) => handleSave(room.name, 0, parseInt(e.target.value))}
                                    /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className='text-center'>ไม่พบข้อมูลห้อง</p>
                )}
        </div>
    )
}


