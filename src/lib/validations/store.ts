import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(3, "Название магазина должно содержать минимум 3 символа"),
});

export const themeConfigSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Неверный формат цвета").default("#3b82f6"),
  borderRadius: z.enum(["none", "sm", "md", "lg", "full"]).default("md"),
  fontFamily: z.enum(["Inter", "Roboto", "Playfair Display"]).default("Inter"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Название категории обязательно"),
  slug: z.string().optional(),
  parentId: z.string().nullable().optional(),
  imageUrl: z.string().url("Введите корректный URL").optional().or(z.literal("")),
});

export type StoreInput = z.infer<typeof storeSchema>;
export type ThemeConfig = z.infer<typeof themeConfigSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
