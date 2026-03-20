import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен"),
  imageUrl: z.string().url("Укажите корректный URL изображения"),
  link: z.string().optional().nullable().or(z.literal("")).transform(val => val === "" ? undefined : val),
  location: z.string().default("HOME"),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type BannerInput = z.infer<typeof bannerSchema>;
export type BannerFormValues = z.input<typeof bannerSchema>;

