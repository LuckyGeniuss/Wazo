"use client";

import { updateOrderStatus } from "@/actions/order";
import { useState } from "react";
import { toast } from "sonner";

interface StatusSelectProps {
  orderId: string;
  storeId: string;
  currentStatus: string;
}

export function StatusSelect({ orderId, storeId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsLoading(true);

    const result = await updateOrderStatus(orderId, storeId, newStatus);
    if (result.error) {
      toast.error(result.error);
      setStatus(currentStatus); // revert on error
    } else {
      toast.success(result.success);
    }
    
    setIsLoading(false);
  };

  const getStatusColor = (val: string) => {
    switch (val) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PROCESSING": return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isLoading}
      className={`text-xs font-semibold rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 appearance-none cursor-pointer ${getStatusColor(status)}`}
    >
      <option value="PENDING">Новый (Pending)</option>
      <option value="PROCESSING">В обработке (Processing)</option>
      <option value="COMPLETED">Завершен (Completed)</option>
      <option value="CANCELLED">Отменен (Cancelled)</option>
    </select>
  );
}
