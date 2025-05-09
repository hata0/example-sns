import { fromPromise } from "neverthrow";

export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP response status code: ${status}`);
  }
}

export class HttpClient {
  constructor(private readonly baseUrl: string) {}

  public async fetch<T>(
    input: string | URL | globalThis.Request,
    init?: RequestInit,
  ): Promise<T> {
    const res = await fromPromise(
      fetch(`${this.baseUrl}${input}`, {
        cache: "no-store",
        ...init,
      }),
      (e) => e,
    );

    if (res.isErr()) {
      throw res.error;
    }

    if (!res.value.ok) {
      throw new HttpError(res.value.status);
    }

    const data = await res.value.json<T>();

    return data;
  }
}

const getCookies = async (): Promise<Map<string, string>> => {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const array = (await cookies()).getAll();
    return new Map(array.map(({ name, value }) => [name, value]));
  } else {
    const cookies = (await import("js-cookie")).default;
    const obj = cookies.get();
    return new Map(Object.entries(obj));
  }
};

export const fetcher = async <T>(
  ...[input, init]: Parameters<typeof fetch>
): Promise<T> => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) {
    throw new Error("database url is required");
  }

  const accessToken = (await getCookies()).get("access_token");

  return new HttpClient(url).fetch(input, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  });
};
