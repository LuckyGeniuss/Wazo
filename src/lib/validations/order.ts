import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(2, "Введите ваше имя"),
  customerEmail: z.string().email("Введите корректный email"),
  customerPhone: z.string().optional(),
  isB2b: z.boolean().default(false).optional(),
  companyName: z.string().optional(),
  companyEdrpou: z.string().optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;
