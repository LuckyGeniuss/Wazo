'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { saveTierPrices, getTierPrices } from '@/actions/tier-pricing';
import { toast } from 'sonner';

interface Tier {
  minQuantity: number;
  price: number;
}

interface TierPricingEditorProps {
  productId: string;
  storeId: string;
  basePrice: number;
}

export function TierPricingEditor({
  productId,
  storeId,
  basePrice,
}: TierPricingEditorProps) {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Завантаження існуючих tiers
  useEffect(() => {
    async function loadTiers() {
      setIsLoading(true);
      try {
        const result = await getTierPrices(productId);
        if (result.success && result.data) {
          setTiers(result.data);
        }
      } catch (error) {
        console.error('Error loading tiers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTiers();
  }, [productId]);

  // Додавання нового tier
  const addTier = useCallback(() => {
    const lastMinQuantity = tiers.length > 0 ? tiers[tiers.length - 1].minQuantity : 0;
    setTiers((prev) => [
      ...prev,
      {
        minQuantity: lastMinQuantity + 1,
        price: basePrice,
      },
    ]);
  }, [tiers, basePrice]);

  // Видалення tier
  const removeTier = useCallback((index: number) => {
    setTiers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Оновлення tier
  const updateTier = useCallback(
    (index: number, field: keyof Tier, value: number) => {
      setTiers((prev) =>
        prev.map((tier, i) =>
          i === index ? { ...tier, [field]: value } : tier
        )
      );
    },
    []
  );

  // Сортування tiers за minQuantity
  const sortedTiers = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);

  // Збереження
  const handleSave = async () => {
    if (tiers.length === 0) {
      toast.error('Додайте принаймні один рівень ціни');
      return;
    }

    // Перевірка на порожні значення
    for (const tier of tiers) {
      if (tier.minQuantity <= 0 || tier.price <= 0) {
        toast.error('Кількість та ціна мають бути додатними числами');
        return;
      }
    }

    setIsSaving(true);
    try {
      const result = await saveTierPrices(productId, storeId, tiers);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Не вдалося зберегти');
      }
    } catch (error) {
      toast.error('Не вдалося зберегти гнучкі ціни');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Гнучкі ціни (Tiered Pricing)</CardTitle>
        <CardDescription>
          Встановіть знижки за кількість. Наприклад: від 10 шт - 90 грн, від 50 шт - 85 грн.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Поточна базова ціна */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              Базова ціна: <span className="font-semibold">{basePrice} грн</span>
            </p>
          </div>

          {/* Таблиця tiers */}
          {sortedTiers.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground">
                <div>Від кількості</div>
                <div>Ціна за одиницю</div>
                <div>Дії</div>
              </div>
              {sortedTiers.map((tier, index) => {
                const originalIndex = tiers.findIndex(
                  (t) => t.minQuantity === tier.minQuantity
                );
                return (
                  <div
                    key={tier.minQuantity}
                    className="grid grid-cols-3 gap-2 items-center"
                  >
                    <div>
                      <Input
                        type="number"
                        min="1"
                        value={tier.minQuantity}
                        onChange={(e) =>
                          updateTier(originalIndex, 'minQuantity', parseInt(e.target.value) || 0)
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={tier.price}
                        onChange={(e) =>
                          updateTier(originalIndex, 'price', parseFloat(e.target.value) || 0)
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTier(originalIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Немає рівнів цін. Додайте перший рівень.
            </div>
          )}

          {/* Кнопки дій */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={addTier}
              disabled={isSaving}
            >
              <Plus className="h-4 w-4 mr-2" />
              Додати рівень
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || tiers.length === 0}
              className="ml-auto"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Зберегти
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
