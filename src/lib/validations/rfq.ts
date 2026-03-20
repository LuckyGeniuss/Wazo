import { z } from "zod";
import { RFQStatus } from "@prisma/client";

export const rfqItemSchema = z.object({
  productId: z.string().min(1, "Товар обязателен"),
  quantity: z.number().int().min(1, "Количество должно быть больше 0"),
  targetPrice: z.number().min(0, "Цена не может быть отрицательной").optional(),
});

export const createRFQSchema = z.object({
  storeId: z.string().min(1, "Магазин обязателен"),
  items: z.array(rfqItemSchema).min(1, "Добавьте хотя бы один товар"),
  note: z.string().optional(),
});

export const provideQuoteSchema = z.object({
  rfqId: z.string().min(1, "Запрос обязателен"),
  totalAmount: z.number().min(0, "Сумма не может быть отрицательной"),
});

export const updateRFQStatusSchema = z.object({
  rfqId: z.string().min(1, "Запрос обязателен"),
  status: z.nativeEnum(RFQStatus),
});

export type RFQItemInput = z.infer<typeof rfqItemSchema>;
export type CreateRFQInput = z.infer<typeof createRFQSchema>;
export type ProvideQuoteInput = z.infer<typeof provideQuoteSchema>;
export type UpdateRFQStatusInput = z.infer<typeof updateRFQStatusSchema>;
