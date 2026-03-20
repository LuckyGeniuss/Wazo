import { z } from "zod";

export const priceListSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  type: z.enum(["FIXED_PRICE", "PERCENTAGE_DISCOUNT"]),
  value: z.number().min(0, "Значение не может быть отрицательным"),
  isActive: z.boolean().default(true),
});

export type PriceListInput = z.infer<typeof priceListSchema>;

export const priceListEntrySchema = z.object({
  productId: z.string().uuid("Некорректный ID товара"),
  customPrice: z.number().min(0, "Цена не может быть отрицательной"),
});

export type PriceListEntryInput = z.infer<typeof priceListEntrySchema>;
