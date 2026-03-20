import { useEffect, useRef } from "react";
import { useCart } from "@/hooks/use-cart";
import { useSession } from "next-auth/react";

export function useCartSync() {
  const { data: session, status } = useSession();
  const items = useCart((state) => state.items);
  // Используем ref для хранения предыдущего состояния, чтобы не отправлять дубликаты
  const prevItemsRef = useRef(items);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Не синхронизируем, если пользователь не авторизован или данные загружаются
    if (status !== "authenticated" || !session?.user?.id) {
      return;
    }

    // Проверяем, изменились ли items
    // Сравниваем просто по длине и id товаров + количеству для простоты и производительности
    const getSimpleState = (itemsArr: typeof items) => 
        itemsArr.map(i => `₴{i.id}-${i.quantity}`).join('|');

    if (getSimpleState(items) === getSimpleState(prevItemsRef.current) && timeoutRef.current !== null) {
      // Инициализация или нет изменений с прошлой синхронизации
       if (timeoutRef.current === null) {
           prevItemsRef.current = items;
       }
      return;
    }

    // Очищаем предыдущий таймаут
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Устанавливаем новый таймаут (debounce 2 секунды)
    timeoutRef.current = setTimeout(async () => {
      try {
        await fetch("/api/cart/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items }),
        });
        prevItemsRef.current = items;
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [items, session?.user?.id, status]);
}
