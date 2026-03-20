"use server";

import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";

export async function registerUser(data: RegisterInput) {
  try {
    const validatedData = registerSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "Пользователь с таким email уже существует" };
    }

    const hashedPassword = await bcryptjs.hash(validatedData.password, 10);

    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    return { success: "Пользователь успешно зарегистрирован!" };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Произошла непредвиденная ошибка" };
  }
}
