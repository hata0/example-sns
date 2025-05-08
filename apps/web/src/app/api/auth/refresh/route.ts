import { fromPromise } from "neverthrow";
import { cookies } from "next/headers";

export const POST = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token");
  if (refreshToken === undefined) {
    return Response.json(
      { message: "refresh token is required" },
      { status: 401 },
    );
  }

  const res = await fromPromise(
    fetch(
      `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify({
          grant_type: "refresh_token",
          refreshToken: refreshToken.value,
        }),
      },
    ),
    (e) => e,
  );
  if (res.isErr()) {
    return Response.json({ message: "internal server error" }, { status: 500 });
  }

  if (!res.value.ok) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  const { id_token: accessToken } = await res.value.json();

  cookieStore.set("access_token", accessToken, {
    path: "/",
    secure: true,
    maxAge: 60 * 60,
    sameSite: "strict",
  });

  return Response.json({ message: "success" }, { status: 200 });
};
