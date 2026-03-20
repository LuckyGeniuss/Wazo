import * as Sentry from "@sentry/nextjs";

/**
 * Захватывает ошибку в Sentry с дополнительным контекстом
 */
export function captureError(
  error: Error | unknown,
  context?: Record<string, unknown>
): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("extra", context);
    }
    Sentry.captureException(error);
  });
}

/**
 * Захватывает сообщение (не ошибку) в Sentry
 */
export function captureMessage(
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  context?: Record<string, unknown>
): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext("extra", context);
    }
    Sentry.captureMessage(message, level);
  });
}

/**
 * Устанавливает контекст пользователя для Sentry
 */
export function setSentryUser(user: {
  id: string;
  email?: string;
  username?: string;
} | null): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.setUser(user);
}

/**
 * Добавляет тег для фильтрации в Sentry Dashboard
 */
export function setSentryTag(key: string, value: string): void {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.setTag(key, value);
}
