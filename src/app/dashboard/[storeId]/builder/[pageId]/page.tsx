import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ClientBuilder } from "./client-builder";
import { EditorBlock } from "@/types/builder";

export default async function BuilderPageServer({
  params,
}: {
  params: Promise<{ storeId: string; pageId: string }>;
}) {
  const { storeId, pageId } = await params;
  const session = await auth();

  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
      storeId: storeId,
      store: {
        ownerId: session?.user?.id,
      },
    },
  });

  if (!page) {
    redirect(`/dashboard/${storeId}/pages`);
  }

  // Парсим контент из БД
  let initialBlocks: EditorBlock[] = [];
  try {
    if (page.content && Array.isArray(page.content)) {
      initialBlocks = page.content as unknown as EditorBlock[];
    }
  } catch (e) {
    console.error("Failed to parse page content", e);
  }

  return (
    <ClientBuilder 
      pageId={page.id} 
      pageName={page.name} 
      initialBlocks={initialBlocks} 
    />
  );
}
