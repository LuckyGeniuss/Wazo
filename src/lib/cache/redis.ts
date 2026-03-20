export async function getCached<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
  return fn();
}

export async function invalidateCache(keyPrefix: string): Promise<void> {
  // no-op
}

export async function invalidatePattern(pattern: string): Promise<void> {
  // no-op
}
