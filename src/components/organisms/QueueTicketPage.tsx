"use client";
import React, { FC, useState } from "react";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import { apiClaimQueue } from "@/services/queue/api.service";
import { IClaimQueueResponse } from "@/interfaces/service/queue.interface";

interface QueueTicketProps {
  className?: string;
}

const QueueTicketPage: FC<QueueTicketProps> = ({ className }) => {
  const [queueData, setQueueData] = useState<IClaimQueueResponse | null>(null);

  const handleClaimQueue = async () => {
    try {
      const res = await apiClaimQueue();

      // res.data ada tipe IClaimQueueResponse
      if (res.data) {
        setQueueData(res.data);
      } else {
        alert("Gagal mengambil antrian: " + (res.message || "Tidak ada data"));
      }
    } catch (err: any) {
      alert("Gagal mengambil antrian: " + (err.message || err));
    }
  };

  return (
    <Card className={className}>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sistem Antrian</h2>

        {!queueData ? (
          <div className="flex flex-col items-center w-full">
            <p className="text-gray-600 mb-8 text-center">
              Ambil nomor antrian Anda dengan menekan tombol di bawah ini
            </p>
            <Button
              size="lg"
              fullWidth
              onClick={handleClaimQueue}
              leftIcon={<span className="material-symbols-outlined">confirmation_number</span>}
            >
              Ambil Nomor Antrian
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="text-gray-600 mb-2">Nomor Antrian Anda</div>
            <div className="text-5xl font-bold text-blue-600 mb-4">
              {queueData.queueNumber}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 w-full">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Posisi:</span>
                <span className="font-medium">{queueData.positionQueue}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Estimasi waktu tunggu:</span>
                <span className="font-medium">{queueData.estimatedWaitTime} menit</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Counter:</span>
                <span className="font-medium">{queueData.counterName}</span>
              </div>
            </div>

            <Button variant="outline" onClick={() => setQueueData(null)}>
              Ambil Lagi
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QueueTicketPage;
