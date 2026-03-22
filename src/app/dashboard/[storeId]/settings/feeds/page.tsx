import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rss } from "lucide-react";

export default async function FeedsPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Експорт (Feeds)</h1>
        <p className="text-muted-foreground mt-1">
          Налаштування експорту товарів у форматі RSS/XML
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5" />
            Усі фіди
          </CardTitle>
          <CardDescription>
            Список налаштованих філів для експорту
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Rss className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Поки що порожньо</h3>
            <p className="text-muted-foreground mt-1">
              Філи для експорту відображатимуться тут
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
