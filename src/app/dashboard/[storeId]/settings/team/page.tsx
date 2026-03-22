import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Users, Plus, UserPlus, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TeamPage({
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

  const owner = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Команда</h1>
        <p className="text-gray-500 mt-2">
          Керування членами команди та їхніми ролями.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Учасники команди</CardTitle>
              <CardDescription>
                Додавайте та керуйте доступом учасників до магазину.
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Запросити учасника
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Owner Row */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{owner?.name || "Власник"}</span>
                    <Badge variant="default">Власник</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="w-3 h-3" />
                    {owner?.email}
                  </div>
                </div>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>

            {/* Team Members Placeholder */}
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <UserPlus className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                Немає запрошених учасників
              </h3>
              <p className="text-gray-500 mt-1 mb-4">
                Запросіть членів команди для спільної роботи.
              </p>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Запросити учасника
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ролі та дозволи</CardTitle>
          <CardDescription>
            Опис доступних ролей в команді.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Власник</span>
              </div>
              <p className="text-sm text-gray-500">
                Повний доступ до всіх функцій магазину та налаштувань.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Менеджер</span>
              </div>
              <p className="text-sm text-gray-500">
                Управління товарами, замовленнями та клієнтами.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Підтримка</span>
              </div>
              <p className="text-sm text-gray-500">
                Робота із замовленнями та відповіді клієнтам.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
