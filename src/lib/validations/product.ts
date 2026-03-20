import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Название должно содержать минимум 2 символа"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Цена должна быть больше нуля"),
  compareAtPrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0, "Остаток не может быть отрицательным").default(0),
  imageUrl: z.string().url("Введите корректный URL").optional().or(z.literal("")),
  videoUrl: z.string().url("Введите корректный URL").optional().nullable().or(z.literal("")),
  images: z.array(z.string().url()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  isArchived: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  upsellProductId: z.string().optional().nullable(),
  attributes: z.array(z.object({
    name: z.string().min(1, "Название атрибута обязательно"),
    values: z.array(z.string()).min(1, "Добавьте хотя бы одно значение"),
  })).optional().default([]),
  variants: z.array(z.object({
    id: z.string().optional(),
    name: z.string().optional(), // напр., "Білий / M"
    sku: z.string().optional(),
    price: z.coerce.number().optional().nullable(),
    stock: z.coerce.number().int().default(0),
    options: z.record(z.string(), z.string()), // {"Колір": "Білий", "Розмір": "M"}
  })).optional().default([]),
  tieredPricing: z.array(z.object({
    minQuantity: z.coerce.number().int().min(2, "Минимальное количество должно быть больше 1"),
    price: z.coerce.number().positive("Цена должна быть больше нуля"),
  })).optional().default([]),
});

export type ProductInput = z.infer<typeof productSchema>;
