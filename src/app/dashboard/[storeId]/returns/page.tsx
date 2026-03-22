import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";

export default async function ReturnsPage({
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
        <h1 className="text-3xl font-bold tracking-tight">Повернення</h1>
        <p className="text-muted-foreground mt-1">
          Управління запитами на повернення товарів
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Запити на повернення
          </CardTitle>
          <CardDescription>
            Немає активних повернень
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <RotateCcw className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Поки що порожньо</h3>
            <p className="text-muted-foreground mt-1">
              Запити на повернення відображатимуться тут
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
