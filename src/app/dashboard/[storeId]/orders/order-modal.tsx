"use client";

import { X } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
}

interface Order {
  id: string;
  storeId: string;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  createdAt: Date;
  status: string;
  paymentMethod: string | null;
  shippingAddress: string | null;
  deliveryCity: string | null;
  deliveryWarehouse: string | null;
  comment: string | null;
  trackingNumber: string | null;
  recipientType: string | null;
  recipientName: string | null;
  recipientPhone: string | null;
  companyEdrpou: string | null;
  companyName: string | null;
  orderItems: OrderItem[];
}

interface OrderModalProps {
  order: Order;
  onClose: () => void;
}

export function OrderModal({ order, onClose }: OrderModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Очікує",
      PROCESSING: "В обробці",
      SHIPPED: "Відправлено",
      COMPLETED: "Завершено",
      CANCELLED: "Скасовано",
      REFUND_REQUESTED: "Запит на поверх",
      REFUNDED: "Повернено",
    };
    return labels[status] || status;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Затемнення фону */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Модальне вікно */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
        {/* Заголовок */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Замовлення #{order.id.slice(0, 8)}
            </h2>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString("uk-UA", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Вміст */}
        <div className="p-6 space-y-6">
          {/* Статус */}
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}
            >
              {getStatusLabel(order.status)}
            </span>
            {order.trackingNumber && (
              <span className="text-sm text-gray-600">
                ТТН: <span className="font-medium">{order.trackingNumber}</span>
              </span>
            )}
          </div>

          {/* Контактна інформація */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Контактна інформація
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Отримувач</dt>
                  <dd className="font-medium text-gray-900">
                    {order.recipientType === "other"
                      ? order.recipientName || order.customerName
                      : order.customerName}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Телефон</dt>
                  <dd className="font-medium text-gray-900">
                    {order.recipientType === "other"
                      ? order.recipientPhone || order.customerPhone
                      : order.customerPhone}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-900">
                    {order.customerEmail}
                  </dd>
                </div>
                {order.companyName && (
                  <>
                    <div>
                      <dt className="text-gray-500">Компанія</dt>
                      <dd className="font-medium text-gray-900">
                        {order.companyName}
                      </dd>
                    </div>
                    {order.companyEdrpou && (
                      <div>
                        <dt className="text-gray-500">ЄДРПОУ</dt>
                        <dd className="font-medium text-gray-900">
                          {order.companyEdrpou}
                        </dd>
                      </div>
                    )}
                  </>
                )}
              </dl>
            </div>

            {/* Доставка */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Доставка та оплата
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Місто</dt>
                  <dd className="font-medium text-gray-900">
                    {order.deliveryCity || "Не вказано"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Відділення</dt>
                  <dd className="font-medium text-gray-900">
                    {order.deliveryWarehouse || "Не вказано"}
                  </dd>
                </div>
                {order.shippingAddress && (
                  <div>
                    <dt className="text-gray-500">Адреса</dt>
                    <dd className="font-medium text-gray-900">
                      {order.shippingAddress}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-gray-500">Оплата</dt>
                  <dd className="font-medium text-gray-900">
                    {order.paymentMethod || "Не вказано"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Товари */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Товари</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Товар
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Кількість
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ціна
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Сума
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.product.imageUrl && (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.quantity} од.
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {Math.round(item.price).toLocaleString("uk-UA")} ₴
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        {Math.round(item.quantity * item.price).toLocaleString(
                          "uk-UA"
                        )}{" "}
                        ₴
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Коментар */}
          {order.comment && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Коментар до замовлення
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                {order.comment}
              </div>
            </div>
          )}

          {/* Підсумок */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Загальна сума:
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {Math.round(order.totalPrice).toLocaleString("uk-UA")} ₴
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
