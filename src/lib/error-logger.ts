export async function logError(error: Error, context?: { path?: string; userId?: string; storeId?: string }) {
  console.error('[Error]', error.message, context);
}
