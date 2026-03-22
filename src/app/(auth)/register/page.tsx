"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsPending(true);
    setError(null);
    
    const result = await registerUser(data);
    
    if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      router.push("/login?registered=true");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGooglePending(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <Card className="w-full max-w-md shadow-lg border-muted">
        <div className="pt-4 text-center">
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            ← Повернутись на головну
          </Link>
        </div>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Создать аккаунт</CardTitle>
          <CardDescription>Зарегистрируйтесь, чтобы начать</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11"
            onClick={handleGoogleSignIn}
            disabled={isGooglePending || isPending}
          >
            {isGooglePending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {isGooglePending ? "Регистрация через Google..." : "Войти через Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Или с помощью email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше Имя"
                  {...register("name")}
                  disabled={isPending || isGooglePending}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  disabled={isPending || isGooglePending}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={isPending || isGooglePending}
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>
            </div>

            {error && <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-200">{error}</div>}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isPending || isGooglePending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
