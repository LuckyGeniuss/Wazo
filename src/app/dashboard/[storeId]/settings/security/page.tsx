import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Shield, Lock, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      ownerId: session.user.id,
    },
  });

  if (!store) {
    redirect("/dashboard");
  }

  // Отримуємо повну інформацію про користувача з БД
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const twoFactorEnabled = user?.twoFactorEnabled ?? false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Безпека</h1>
        <p className="text-gray-500 mt-2">
          Налаштування безпеки та конфігурація доступу.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <CardTitle>Двофакторна автентифікація</CardTitle>
            </div>
            <CardDescription>
              Додайте додатковий рівень захисту до вашого облікового запису.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {twoFactorEnabled ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
                <span className="text-sm">
                  {twoFactorEnabled ? "2FA увімкнено" : "2FA вимкнено"}
                </span>
              </div>
              <Button variant="outline" size="sm">
                {twoFactorEnabled ? "Налаштувати" : "Увімкнути"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-600" />
              <CardTitle>Пароль додатків</CardTitle>
            </div>
            <CardDescription>
              Створіть паролі для додатків, які не підтримують 2FA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm">
              <Key className="w-4 h-4 mr-2" />
              Створити пароль
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <CardTitle>Налаштування безпеки</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Сповіщення про вхід</p>
              <p className="text-sm text-gray-500">
                Отримувати сповіщення про нові входи в акаунт.
              </p>
            </div>
            <Badge variant="default">Увімк</Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Перевірка IP-адрес</p>
              <p className="text-sm text-gray-500">
                Блокувати підозрілі IP-адреси автоматично.
              </p>
            </div>
            <Badge variant="default">Увімк</Badge>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Примусовий вихід</p>
              <p className="text-sm text-gray-500">
                Вимагати повторного входу через 30 днів.
              </p>
            </div>
            <Badge variant="secondary">Вимк</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Активні сесії</CardTitle>
          <CardDescription>
            Керування активними сесіями вашого акаунту.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Поточна сесія</p>
                <p className="text-sm text-gray-500">
                  Остання активність: щойно
                </p>
              </div>
              <Badge variant="default">Цей пристрій</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Badge({
  variant,
  children,
}: {
  variant: "default" | "secondary" | "outline";
  children: React.ReactNode;
}) {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded ${
        variant === "default"
          ? "bg-blue-100 text-blue-800"
          : variant === "secondary"
          ? "bg-gray-100 text-gray-800"
          : "border border-gray-300 text-gray-700"
      }`}
    >
      {children}
    </span>
  );
}
