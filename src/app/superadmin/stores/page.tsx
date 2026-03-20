import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function SuperAdminStores() {
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { products: true, orders: true } },
      owner: { select: { name: true, email: true } },
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Stores Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Store Name</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created At</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="bg-white border-b">
                    <td className="px-6 py-4 font-medium">{store.name}</td>
                    <td className="px-6 py-4">{store.slug}</td>
                    <td className="px-6 py-4">
                      <Badge variant={store.status === "ACTIVE" ? "default" : "secondary"}>
                        {store.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(store.createdAt).toLocaleDateString("uk-UA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
