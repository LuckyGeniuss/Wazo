import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { ModalProvider } from "@/components/providers/modal-provider";
import { getUserStoreRole } from "@/lib/auth/permissions";

export default async function StoreDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const session = await auth();
  const { storeId } = await params;

  if (!session?.user) {
    redirect("/login");
  }

  // Проверяем права: пользователь — владелец ИЛИ участник команды
  let userRole;
  try {
    userRole = await getUserStoreRole(session.user.id, storeId);
  } catch (error) {
    console.error("Error getting user store role:", error);
    // Continue, userRole will be undefined and redirect will happen below
  }

  if (!userRole) {
    redirect("/dashboard");
  }

  // Получаем все магазины пользователя для StoreSwitcher:
  // - магазины, где он владелец
  // - магазины, в командах которых он состоит
  let ownedStores = [];
  let teamStores = [];
  
  try {
    const results = await Promise.all([
      prisma.store.findMany({
        where: { ownerId: session.user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.store.findMany({
        where: {
          teamMembers: { some: { userId: session.user.id } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    ownedStores = results[0];
    teamStores = results[1];
  } catch (error) {
    console.error("Error fetching stores for sidebar:", error);
    // You can also redirect to a fallback or handle the empty state
  }

  // Объединяем без дублей
  const storeMap = new Map(ownedStores.map((s) => [s.id, s]));
  teamStores.forEach((s) => {
    if (!storeMap.has(s.id)) storeMap.set(s.id, s);
  });
  const allStores = Array.from(storeMap.values());

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ModalProvider />
      <Sidebar stores={allStores} userRole={userRole as any} />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopBar storeId={storeId} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
