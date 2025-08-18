import { InvalidArgumentError } from '../error/invalid-argument-error';
import {
  RetryFunction,
  retryWithExponentialBackoffRespectingRetryHeaders,
} from '../util/retry-with-exponential-backoff';

/**
 * Validate and prepare retries.
 */
export function prepareRetries({
  maxAttempts,
  abortSignal,
}: {
  maxAttempts: number | undefined;
  abortSignal: AbortSignal | undefined;
}): {
  maxAttempts: number;
  retry: RetryFunction;
} {
  if (maxAttempts != null) {
    if (!Number.isInteger(maxAttempts)) {
      throw new InvalidArgumentError({
        parameter: 'maxAttempts',
        value: maxAttempts,
        message: 'maxAttempts must be an integer',
      });
    }

    if (maxAttempts < 0) {
      throw new InvalidArgumentError({
        parameter: 'maxAttempts',
        value: maxAttempts,
        message: 'maxAttempts must be >= 0',
      });
    }
  }

  const maxAttemptsResult = maxAttempts ?? 2;

  return {
    maxAttempts: maxAttemptsResult,
    retry: retryWithExponentialBackoffRespectingRetryHeaders({
      maxAttempts: maxAttemptsResult,
      abortSignal,
    }),
  };
}
