'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TelegramSettingsPageProps {
  params: {
    storeId: string;
  };
}

export default function TelegramSettingsPage({ params }: TelegramSettingsPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [connectLink, setConnectLink] = useState('');
  const [isTestLoading, setIsTestLoading] = useState(false);

  const handleTestNotification = async () => {
    setIsTestLoading(true);
    try {
      const res = await fetch(`/api/dashboard/stores/${params.storeId}/telegram/test`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Помилка надсилання тестового сповіщення');
      }
    } catch (error) {
      toast.error('Помилка надсилання тестового сповіщення');
    } finally {
      setIsTestLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/dashboard/stores/${params.storeId}/telegram/connect`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to connect');
      
      const data = await res.json();
      setConnectLink(data.link);
      toast.success('Посилання згенеровано. Перейдіть в Telegram, щоб завершити налаштування.');
    } catch (error) {
      toast.error('Помилка при підключенні Telegram');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/dashboard/stores/${params.storeId}/telegram/disconnect`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to disconnect');
      
      toast.success('Telegram бота відключено');
      setConnectLink('');
      router.refresh();
    } catch (error) {
      toast.error('Помилка при відключенні Telegram');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Налаштування Telegram Бота</h1>
      <p className="text-muted-foreground mb-8">
        Підключіть Telegram бота, щоб отримувати миттєві сповіщення про нові замовлення.
      </p>

      <div className="space-y-4">
        {connectLink ? (
          <div className="p-4 border border-violet-200 bg-violet-50 rounded-lg">
            <p className="mb-4">Перейдіть за посиланням нижче в Telegram та натисніть "Розпочати" (Start):</p>
            <a
              href={connectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-[#0088cc] text-white rounded-md font-medium hover:bg-[#0077b3] transition-colors"
            >
              Відкрити в Telegram
            </a>
          </div>
        ) : (
          <Button onClick={handleConnect} disabled={isLoading} className="bg-[#0088cc] hover:bg-[#0077b3]">
            {isLoading ? 'Завантаження...' : 'Підключити Telegram'}
          </Button>
        )}

        <div className="pt-8 border-t mt-8">
          <Button variant="destructive" onClick={handleDisconnect} disabled={isLoading}>
            Відключити Telegram
          </Button>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Тестування сповіщень</CardTitle>
          <CardDescription>
            Надішліть тестове сповіщення, щоб переконатися, що Telegram налаштовано правильно.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleTestNotification}
            disabled={isTestLoading}
            className="w-full"
            variant="outline"
          >
            {isTestLoading ? 'Надсилання...' : '📤 Надіслати тестове сповіщення'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
