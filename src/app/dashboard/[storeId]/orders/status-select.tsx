"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/order";
import { toast } from "sonner";

interface StatusSelectProps {
  orderId: string;
  storeId: string;
  currentStatus: string;
  compact?: boolean;
  onStatusChange?: (newStatus: string) => void;
}

export function StatusSelect({
  orderId,
  storeId,
  currentStatus,
  compact = false,
  onStatusChange,
}: StatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleStatusChange = async (newStatus: string, trackingNum?: string) => {
    setIsLoading(true);

    const result = await updateOrderStatus(orderId, storeId, newStatus, trackingNum || null);
    if (result.error) {
      toast.error(result.error);
      setStatus(currentStatus); // revert on error
    } else {
      toast.success(result.success);
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    }

    setIsLoading(false);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    
    // If changing to SHIPPED, show tracking number dialog
    if (newStatus === "SHIPPED") {
      setPendingStatus(newStatus);
      setShowTrackingDialog(true);
      setTrackingNumber("");
    } else {
      // For other statuses, change directly
      setStatus(newStatus);
      setIsLoading(true);

      const result = await updateOrderStatus(orderId, storeId, newStatus);
      if (result.error) {
        toast.error(result.error);
        setStatus(currentStatus); // revert on error
      } else {
        toast.success(result.success);
        onStatusChange?.(newStatus);
      }

      setIsLoading(false);
    }
  };

  const handleConfirmTracking = async () => {
    await handleStatusChange(pendingStatus, trackingNumber);
    setShowTrackingDialog(false);
  };

  const handleCancelTracking = () => {
    setShowTrackingDialog(false);
    setStatus(currentStatus); // revert to previous status
  };

  const getStatusColor = (val: string) => {
    switch (val) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "REFUND_REQUESTED":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "REFUNDED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (val: string) => {
    const labels: Record<string, string> = {
      PENDING: "Очікує",
      PROCESSING: "В обробці",
      SHIPPED: "Відправлено",
      COMPLETED: "Завершено",
      CANCELLED: "Скасовано",
      REFUND_REQUESTED: "Запит на поверх",
      REFUNDED: "Повернено",
    };
    return labels[val] || val;
  };

  return (
    <>
      <select
        value={status}
        onChange={handleChange}
        disabled={isLoading}
        className={`text-xs font-semibold rounded-full px-3 py-1 border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 appearance-none cursor-pointer ${
          compact ? "text-xs px-2 py-1" : "text-xs px-3 py-1"
        } ${getStatusColor(status)}`}
      >
        <option value="PENDING">{getStatusLabel("PENDING")}</option>
        <option value="PROCESSING">{getStatusLabel("PROCESSING")}</option>
        <option value="SHIPPED">{getStatusLabel("SHIPPED")}</option>
        <option value="COMPLETED">{getStatusLabel("COMPLETED")}</option>
        <option value="CANCELLED">{getStatusLabel("CANCELLED")}</option>
        <option value="REFUND_REQUESTED">
          {getStatusLabel("REFUND_REQUESTED")}
        </option>
        <option value="REFUNDED">{getStatusLabel("REFUNDED")}</option>
      </select>

      {/* Діалог введення номера ТТН */}
      {showTrackingDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCancelTracking} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Введіть номер ТТН
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Будь ласка, введіть номер відстеження (ТТН) для відправлення.
            </p>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Наприклад: 20450000000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelTracking}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Скасувати
              </button>
              <button
                onClick={handleConfirmTracking}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
