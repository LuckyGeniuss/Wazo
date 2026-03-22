import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { OrdersTable } from "./orders-table";

export default async function OrdersPage({
params,
}: {
params: Promise<{ storeId: string }>;
}) {
const { storeId } = await params;
const session = await auth();

if (!session?.user) {
redirect("/login");
}

// Отримуємо замовлення магазину, перевіряючи, що він належить користувачу
const orders = await prisma.order.findMany({
where: {
storeId,
store: { ownerId: session.user.id },
},
include: {
orderItems: {
include: {
product: true,
},
},
},
orderBy: { createdAt: "desc" },
});

return (
<div>
<div className="flex justify-between items-center mb-8">
<div>
<h1 className="text-3xl font-bold text-gray-900">Замовлення (CRM)</h1>
<p className="text-gray-500 mt-2">
Керуйте замовленнями та запитами від клієнтів.
</p>
</div>
</div>

<OrdersTable initialOrders={orders} storeId={storeId} />
</div>
);
}
