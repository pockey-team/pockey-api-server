export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  useExponentialBackoff?: boolean;
}

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, useExponentialBackoff = true } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = useExponentialBackoff ? Math.pow(2, attempt) * delayMs : delayMs;

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
