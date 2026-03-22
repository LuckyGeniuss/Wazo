import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Key, Plus, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ApiKeysPage({
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

  const apiTokens = await prisma.apiToken.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
        <p className="text-gray-500 mt-2">
          Керування API ключами для доступу до API магазину.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active API Keys</CardTitle>
              <CardDescription>
                Використовуйте ці ключі для доступу до API вашого магазину.
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Створити ключ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {apiTokens.length === 0 ? (
            <div className="text-center py-12">
              <Key className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                Немає API ключів
              </h3>
              <p className="text-gray-500 mt-1">
                Створіть перший API ключ для доступу до API.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiTokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-medium">
                        {token.name}
                      </code>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Створено:{" "}
                      {new Date(token.createdAt).toLocaleString("uk-UA")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
