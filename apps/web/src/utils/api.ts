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

    const data = await res.value.json();

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

const getAccessToken = async (): Promise<string> => {
  const cookies = await getCookies();
  const accessToken = cookies.get("access_token");

  if (accessToken === undefined) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/refresh`,
      {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify({
          refreshToken: cookies.get("refresh_token"),
        }),
      },
    );
    const { accessToken: newAccessToken } = await res.json();
    return newAccessToken;
  } else {
    return accessToken;
  }
};

export const fetcher = async <T>(
  ...[input, init]: Parameters<typeof fetch>
): Promise<T> => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!url) {
    throw new Error("database url is required");
  }

  const accessToken = await getAccessToken();

  return new HttpClient(url).fetch(input, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
  });
};
