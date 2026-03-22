"use client";

import { useState, useMemo } from "react";
import { StatusSelect } from "./status-select";
import { OrderModal } from "./order-modal";

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

interface OrdersTableProps {
  initialOrders: Order[];
  storeId: string;
}

type SortField = "createdAt" | "totalPrice" | "customerName" | "status";
type SortOrder = "asc" | "desc";

export function OrdersTable({ initialOrders, storeId }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState(initialOrders);

  // Оновлення локального стану при зміні статусу
  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Фільтр по статусу
    if (statusFilter !== "ALL") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Пошук по імені, телефону, email
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.customerName.toLowerCase().includes(query) ||
          order.customerPhone?.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query)
      );
    }

    // Сортування
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "createdAt":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "totalPrice":
          comparison = a.totalPrice - b.totalPrice;
          break;
        case "customerName":
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [initialOrders, searchQuery, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        {/* Рядок фільтрів та пошуку */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Пошук */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Пошук за ім'ям, телефоном, email або ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Фільтр за статусом */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">Усі статуси</option>
              <option value="PENDING">Очікує</option>
              <option value="PROCESSING">В обробці</option>
              <option value="SHIPPED">Відправлено</option>
              <option value="COMPLETED">Завершено</option>
              <option value="CANCELLED">Скасовано</option>
              <option value="REFUND_REQUESTED">Запит на поверх</option>
              <option value="REFUNDED">Повернено</option>
            </select>
          </div>
        </div>

        {/* Статистика */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Знайдено: {filteredAndSortedOrders.length} з {initialOrders.length}{" "}
            замовлень
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 hover:text-blue-800"
            >
              Очистити пошук
            </button>
          )}
        </div>
      </div>

      {/* Таблиця замовлень */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("createdAt")}
                >
                  {getSortIcon("createdAt")} ID / Дата
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("customerName")}
                >
                  {getSortIcon("customerName")} Покупець
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Товари
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("totalPrice" as SortField)}
                >
                  {getSortIcon("totalPrice")} Сума
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Доставка
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Оплата
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  {getSortIcon("status")} Статус
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id.slice(0, 8)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </div>
                    {order.customerPhone && (
                      <div className="text-xs text-gray-500">
                        {order.customerPhone}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {order.orderItems.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className="truncate max-w-[200px]"
                          title={`${item.quantity}x ${item.product.name}`}
                        >
                          {item.quantity}x {item.product.name.slice(0, 30)}
                          {item.product.name.length > 30 ? "..." : ""}
                        </div>
                      ))}
                      {order.orderItems.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{order.orderItems.length - 2} ще
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {Math.round(order.totalPrice).toLocaleString("uk-UA")} ₴
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">
                      {order.deliveryCity
                        ? `${order.deliveryCity}`
                        : "Не вказано"}
                    </div>
                    {order.deliveryWarehouse && (
                      <div className="text-xs text-gray-500">
                        {order.deliveryWarehouse}
                      </div>
                    )}
                    {order.trackingNumber && (
                      <div className="text-xs text-blue-600 font-medium">
                        ТТН: {order.trackingNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.paymentMethod || "Не вказано"}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <StatusSelect
                      orderId={order.id}
                      storeId={storeId}
                      currentStatus={order.status}
                      compact
                      onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Деталі
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedOrders.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {searchQuery || statusFilter !== "ALL"
              ? "Не знайдено замовлень за обраними фільтрами"
              : "У вашому магазині поки немає замовлень"}
          </div>
        )}
      </div>

      {/* Модальне вікно деталей замовлення */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
