import { Err, err, fromPromise, Ok, ok, Result } from "neverthrow";

export { Err, err, Ok, ok, Result, fromPromise };

export function combine<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const okValues: T[] = [];

  for (const result of results) {
    if (result.isErr()) {
      return err(result.error);
    }
    okValues.push(result.value);
  }

  return ok(okValues);
}

// Result<T, E>のArrayをResult<T[], E>に変換するヘルパー関数
export function sequence<T, E>(results: Result<T, E>[]): Result<T[], E> {
  return combine(results);
}
