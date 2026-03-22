import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";

export default async function PriceListsPage({
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
        <h1 className="text-3xl font-bold tracking-tight">Прайс-листи</h1>
        <p className="text-muted-foreground mt-1">
          Управління ціновими прайсами
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Список прайсів
          </CardTitle>
          <CardDescription>
            Немає активних прайс-листів
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Поки що порожньо</h3>
            <p className="text-muted-foreground mt-1">
              Створіть перший прайс-лист для початку роботи
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
