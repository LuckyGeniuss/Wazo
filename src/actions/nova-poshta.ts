"use server";

import { prisma } from "@/lib/prisma";
import { getCities, getWarehouses, calculateDeliveryCost, createTTN } from "@/lib/nova-poshta/client";
import { revalidatePath } from "next/cache";

/**
 * Поиск городов по названию (используется в autocomplete)
 */
export async function searchCities(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const cities = await getCities(query);
    return cities.map((c) => ({
      ref: c.Ref,
      name: c.Description,
      nameRu: c.DescriptionRu,
      area: c.AreaDescription,
    }));
  } catch (error) {
    console.error("[NP_SEARCH_CITIES]", error);
    return [];
  }
}

/**
 * Получение списка отделений в городе
 */
export async function getWarehousesForCity(cityRef: string) {
  if (!cityRef) return [];

  try {
    const warehouses = await getWarehouses(cityRef);
    return warehouses.map((w) => ({
      ref: w.Ref,
      name: w.Description,
      nameRu: w.DescriptionRu,
      number: w.Number,
    }));
  } catch (error) {
    console.error("[NP_GET_WAREHOUSES]", error);
    return [];
  }
}

interface EstimateDeliveryParams {
  citySenderRef: string;
  cityRecipientRef: string;
  weight: number;
  declaredValue: number;
}

/**
 * Расчёт стоимости доставки
 */
export async function estimateDelivery(params: EstimateDeliveryParams) {
  try {
    const result = await calculateDeliveryCost({
      citySenderRef: params.citySenderRef,
      cityRecipientRef: params.cityRecipientRef,
      weight: params.weight,
      cost: params.declaredValue,
    });

    if (!result) return { error: "Не удалось рассчитать стоимость доставки" };

    return {
      cost: parseFloat(result.Cost),
      estimatedDate: result.EstimatedDeliveryDate,
    };
  } catch (error) {
    console.error("[NP_ESTIMATE_DELIVERY]", error);
    return { error: "Ошибка расчёта доставки" };
  }
}

interface CreateShipmentParams {
  orderId: string;
  storeId: string;
  weight: number;
  declaredValue: number;
  senderWarehouseRef: string;
}

/**
 * Создание ТТН для заказа
 */
export async function createShipment(params: CreateShipmentParams) {
   
  const order = await (prisma as any).order.findFirst({
    where: { id: params.orderId, storeId: params.storeId },
    include: { orderItems: { include: { product: { select: { name: true } } } } },
  });

  if (!order) return { error: "Заказ не найден" };
  if (!order.novaPoshtaCityRef || !order.novaPoshtaWarehouseRef) {
    return { error: "Адрес доставки Новой Пошты не указан в заказе" };
  }
  if (!order.customerPhone) {
    return { error: "Номер телефона получателя не указан" };
  }

  try {
    const description = (order.orderItems as { product: { name: string } }[])
      .map((item) => item.product.name)
      .join(", ")
      .slice(0, 100);

    const ttn = await createTTN({
      senderWarehouseRef: params.senderWarehouseRef,
      recipientCityRef: order.novaPoshtaCityRef as string,
      recipientWarehouseRef: order.novaPoshtaWarehouseRef as string,
      recipientName: order.customerName as string,
      recipientPhone: order.customerPhone as string,
      weight: params.weight,
      cost: params.declaredValue,
      description,
    });

    if (!ttn) return { error: "Не удалось создать ТТН" };

    // Save TTN number to order
     
    await (prisma as any).order.update({
      where: { id: params.orderId },
      data: { trackingNumber: ttn.IntDocNumber },
    });

    revalidatePath(`/dashboard/${params.storeId}/orders`);

    return { success: true, trackingNumber: ttn.IntDocNumber };
  } catch (error) {
    console.error("[NP_CREATE_SHIPMENT]", error);
    return { error: "Ошибка создания ТТН" };
  }
}

/**
 * Сохранение адреса доставки НП в заказ (используется при checkout)
 */
export async function saveDeliveryAddress(
  orderId: string,
  data: {
    deliveryCity: string;
    deliveryWarehouse: string;
    novaPoshtaCityRef: string;
    novaPoshtaWarehouseRef: string;
  }
) {
  try {
     
    await (prisma as any).order.update({
      where: { id: orderId },
      data: {
        deliveryCity: data.deliveryCity,
        deliveryWarehouse: data.deliveryWarehouse,
        novaPoshtaCityRef: data.novaPoshtaCityRef,
        novaPoshtaWarehouseRef: data.novaPoshtaWarehouseRef,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("[NP_SAVE_ADDRESS]", error);
    return { error: "Ошибка сохранения адреса" };
  }
}
