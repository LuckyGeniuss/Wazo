"use server";

import { ukrposhtaClient, UkrposhtaRegion, UkrposhtaCity, UkrposhtaPostOffice } from "@/lib/ukrposhta/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Отримує список областей
 */
export async function getUkrposhtaRegions(): Promise<UkrposhtaRegion[]> {
  try {
    const regions = await ukrposhtaClient.getRegions();
    return regions;
  } catch (error) {
    console.error("Помилка отримання областей Укрпошти:", error);
    return [];
  }
}

/**
 * Отримує список міст за ID області
 */
export async function getUkrposhtaCities(regionId: string): Promise<UkrposhtaCity[]> {
  if (!regionId) return [];
  
  try {
    const cities = await ukrposhtaClient.getCities(regionId);
    return cities;
  } catch (error) {
    console.error("Помилка отримання міст Укрпошти:", error);
    return [];
  }
}

/**
 * Отримує список відділень за ID міста
 */
export async function getUkrposhtaPostOffices(cityId: string): Promise<UkrposhtaPostOffice[]> {
  if (!cityId) return [];
  
  try {
    const offices = await ukrposhtaClient.getPostOffices(cityId);
    return offices;
  } catch (error) {
    console.error("Помилка отримання відділень Укрпошти:", error);
    return [];
  }
}

/**
 * Створює ТТН Укрпошти для замовлення
 */
export async function generateUkrposhtaTtn(orderId: string, storeId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        storeId: storeId,
      },
    });

    if (!order) {
      return { success: false, error: "Замовлення не знайдено" };
    }

    const isUkrposhta = order.deliveryCity?.toLowerCase().includes("укрпошта") || order.deliveryWarehouse?.toLowerCase().includes("укрпошта");
    
    if (!isUkrposhta) {
      return { success: false, error: "Це замовлення не має доставки Укрпоштою" };
    }

    if (order.trackingNumber) {
      return { success: false, error: "Замовлення вже має трек-номер" };
    }

    // Формуємо дані для відправки
    const shipmentData = {
      recipientName: order.customerName,
      recipientPhone: order.customerPhone,
      deliveryCity: order.deliveryCity,
      deliveryWarehouse: order.deliveryWarehouse,
      weight: 1, // Можна розраховувати на основі товарів
    };

    // Викликаємо метод клієнта
    const result = await ukrposhtaClient.createShipment(shipmentData);

    // Оновлюємо замовлення
    await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber: result.trackingNumber,
        status: "SHIPPED",
      },
    });

    revalidatePath(`/dashboard/${storeId}/orders/${orderId}`);

    return { success: true, trackingNumber: result.trackingNumber };
  } catch (error) {
    console.error("Помилка генерації ТТН Укрпошти:", error);
    return { success: false, error: "Помилка при створенні ТТН Укрпошти" };
  }
}
