import { fromPromise } from "neverthrow";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const accessToken = req.cookies.get("access_token");

  if (accessToken === undefined) {
    const refreshToken = req.cookies.get("refresh_token");

    const res = await fromPromise(
      fetch(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
        {
          cache: "no-store",
          method: "POST",
          body: JSON.stringify({
            grant_type: "refresh_token",
            refreshToken: refreshToken?.value,
          }),
        },
      ),
      (e) => e,
    );

    if (res.isErr()) {
      return;
    }

    const { id_token: newAccessToken } = await res.value.json<{
      id_token: string;
    }>();

    const response = NextResponse.next();
    response.cookies.set("access_token", newAccessToken, {
      path: "/",
      secure: true,
      maxAge: 60 * 60,
      sameSite: "strict",
    });
    return response;
  }
};
