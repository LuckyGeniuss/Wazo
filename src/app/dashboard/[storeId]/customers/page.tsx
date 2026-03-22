import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default async function CustomersPage({
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
        <h1 className="text-3xl font-bold tracking-tight">Клієнти</h1>
        <p className="text-muted-foreground mt-1">
          База клієнтів вашого магазину
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Усі клієнти
          </CardTitle>
          <CardDescription>
            Список усіх зареєстрованих клієнтів
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Поки що порожньо</h3>
            <p className="text-muted-foreground mt-1">
              Клієнти відображатимуться тут
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
