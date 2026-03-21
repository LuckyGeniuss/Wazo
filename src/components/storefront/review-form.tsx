'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    return (
      <div className="p-4 bg-muted rounded-lg text-center">
        <p className="text-sm text-muted-foreground">
          Увійдіть, щоб залишити відгук
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Будь ласка, оберіть оцінку');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (!res.ok) {
        throw new Error('Щось пішло не так');
      }

      toast.success('Відгук успішно додано!');
      setRating(0);
      setComment('');
      router.refresh();
    } catch (error) {
      toast.error('Помилка при додаванні відгуку');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold">Написати відгук</h3>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <Textarea
        placeholder="Розкажіть про свої враження..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !rating}>
        {isLoading ? 'Відправка...' : 'Відправити відгук'}
      </Button>
    </form>
  );
}
