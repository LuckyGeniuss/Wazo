import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FileText, Filter, Download, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function LogsPage({
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

  // Mock logs for demonstration
  const mockLogs = [
    { id: "1", type: "info", message: "Store settings updated", timestamp: new Date().toISOString() },
    { id: "2", type: "success", message: "Product published successfully", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: "3", type: "error", message: "Failed to sync with external API", timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: "4", type: "warning", message: "Low stock alert for product #123", timestamp: new Date(Date.now() - 86400000).toISOString() },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Журнал подій</h1>
        <p className="text-gray-500 mt-2">
          Перегляд системних подій та операцій магазину.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="default">
            <Info className="w-3 h-3 mr-1" />
            {mockLogs.filter(l => l.type === "info").length} Info
          </Badge>
          <Badge variant="default" >
            <CheckCircle className="w-3 h-3 mr-1" />
            {mockLogs.filter(l => l.type === "success").length} Success
          </Badge>
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            {mockLogs.filter(l => l.type === "warning").length} Warning
          </Badge>
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            {mockLogs.filter(l => l.type === "error").length} Error
          </Badge>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Фільтр
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Експорт
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Останні події</CardTitle>
          <CardDescription>
            Відображено останні {mockLogs.length} подій
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="mt-0.5">
                  {log.type === "info" && <Info className="w-4 h-4 text-blue-600" />}
                  {log.type === "success" && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {log.type === "warning" && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                  {log.type === "error" && <XCircle className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(log.timestamp).toLocaleString("uk-UA")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Налаштування логування</CardTitle>
          <CardDescription>
            Керування рівнями логування та сповіщень.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Логи зберігаються протягом 30 днів. Для розширеного логування зверніться до підтримки.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
