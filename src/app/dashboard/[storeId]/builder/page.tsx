import { redirect } from "next/navigation";

export default async function BuilderRootRedirect({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  redirect(`/dashboard/${storeId}/pages`);
}
