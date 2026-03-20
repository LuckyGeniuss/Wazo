"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function inviteTeamMember({
  email,
  role,
  storeId,
}: {
  email: string;
  role: Role;
  storeId: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    // Проверяем права вызывающего
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: session.user.id,
      },
    });

    if (!store) {
      return { error: "Нет прав для приглашения в этот магазин" };
    }

    // Проверяем, нет ли уже такого пользователя в команде
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const existingMember = await prisma.storeTeamMember.findUnique({
        where: {
          storeId_userId: {
            storeId,
            userId: existingUser.id,
          },
        },
      });

      if (existingMember) {
        return { error: "Пользователь уже является участником команды" };
      }
    }

    // Генерируем токен и создаем инвайт
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Инвайт действителен 7 дней

    // Upsert на случай если инвайт уже отправлялся
    await prisma.storeInvite.upsert({
      where: {
        storeId_email: {
          storeId,
          email,
        },
      },
      update: {
        role,
        token,
        expiresAt,
      },
      create: {
        storeId,
        email,
        role,
        token,
        expiresAt,
      },
    });

    revalidatePath(`/dashboard/${storeId}/settings/team`);

    // В реальном проекте здесь была бы отправка email
    // Инвайт лог

    return { success: "Приглашение успешно отправлено", token };
  } catch (error) {
    console.error("Ошибка при отправке приглашения:", error);
    return { error: "Внутренняя ошибка сервера" };
  }
}

export async function getTeamMembers(storeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    // Проверяем доступ (владелец или участник)
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        OR: [
          { ownerId: session.user.id },
          { teamMembers: { some: { userId: session.user.id } } },
        ],
      },
    });

    if (!store) {
      return { error: "Нет доступа" };
    }

    const members = await prisma.storeTeamMember.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return { members };
  } catch (error) {
    console.error("Ошибка при получении команды:", error);
    return { error: "Внутренняя ошибка сервера" };
  }
}

export async function removeTeamMember(memberId: string, storeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    // Проверяем права вызывающего (только владелец)
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: session.user.id,
      },
    });

    if (!store) {
      return { error: "Нет прав для удаления участника" };
    }

    await prisma.storeTeamMember.delete({
      where: {
        id: memberId,
      },
    });

    revalidatePath(`/dashboard/${storeId}/settings/team`);

    return { success: "Участник успешно удален" };
  } catch (error) {
    console.error("Ошибка при удалении участника:", error);
    return { error: "Внутренняя ошибка сервера" };
  }
}

export async function acceptInvite(token: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
          return { error: "Необходима авторизация" };
        }

        const invite = await prisma.storeInvite.findUnique({
            where: { token }
        });

        if (!invite) {
            return { error: "Приглашение не найдено или недействительно" };
        }

        if (invite.expiresAt < new Date()) {
             await prisma.storeInvite.delete({ where: { id: invite.id }});
             return { error: "Срок действия приглашения истек" };
        }

        // Проверяем, не является ли уже участником (защита от дубликатов)
        const existingMember = await prisma.storeTeamMember.findUnique({
            where: {
                storeId_userId: {
                    storeId: invite.storeId,
                    userId: session.user.id
                }
            }
        });

        if (existingMember) {
             await prisma.storeInvite.delete({ where: { id: invite.id }});
             return { error: "Вы уже являетесь участником этой команды" };
        }

        // Добавляем в команду
        await prisma.$transaction([
            prisma.storeTeamMember.create({
                data: {
                    storeId: invite.storeId,
                    userId: session.user.id,
                    role: invite.role
                }
            }),
            prisma.storeInvite.delete({
                where: { id: invite.id }
            })
        ]);

        return { success: "Приглашение успешно принято", storeId: invite.storeId };
    } catch (error) {
         console.error("Ошибка при принятии приглашения:", error);
         return { error: "Внутренняя ошибка сервера" };
    }
}

export async function updateMemberRole(
  memberId: string,
  newRole: Role,
  storeId: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Необходима авторизация" };
    }

    // Только владелец может менять роли
    const store = await prisma.store.findFirst({
      where: { id: storeId, ownerId: session.user.id },
    });

    if (!store) {
      return { error: "Нет прав для изменения ролей" };
    }

    await prisma.storeTeamMember.update({
      where: { id: memberId },
      data: { role: newRole },
    });

    revalidatePath(`/dashboard/${storeId}/settings/team`);

    return { success: "Роль успешно обновлена" };
  } catch (error) {
    console.error("Ошибка при обновлении роли:", error);
    return { error: "Внутренняя ошибка сервера" };
  }
}
