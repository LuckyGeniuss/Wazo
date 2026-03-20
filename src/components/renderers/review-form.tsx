"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createReview } from "@/actions/product";

const reviewSchema = z.object({
  rating: z.number().min(1, "Выберите рейтинг").max(5),
  comment: z.string().min(10, "Комментарий должен быть не менее 10 символов"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsPending(true);
    try {
      const result = await createReview(productId, data);
      if (result.success) {
        toast.success("Отзыв успешно добавлен!");
        reset();
        setRating(0);
        onSuccess?.();
      } else {
        toast.error(result.error || "Ошибка при добавлении отзыва");
      }
    } catch (error) {
      toast.error("Что-то пошло не так");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold">Оставить отзыв</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ваша оценка</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform active:scale-90"
              onClick={() => {
                setRating(star);
                setValue("rating", star, { shouldValidate: true });
              }}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                size={24}
                className={`₴{
                  (hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
        <textarea
          {...register("comment")}
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          placeholder="Поделитесь вашим впечатлением о товаре..."
        />
        {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {isPending ? "Отправка..." : "Отправить отзыв"}
      </button>
    </form>
  );
}
