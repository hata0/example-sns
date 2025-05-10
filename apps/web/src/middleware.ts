import { fromPromise } from "neverthrow";
import { NextRequest, NextResponse } from "next/server";
import { firebaseConfig } from "./lib/firebase/client";

export const middleware = async (req: NextRequest) => {
  const accessToken = req.cookies.get("access_token")?.value;
  const response = NextResponse.next();

  if (!accessToken?.trim()) {
    const refreshToken = req.cookies.get("refresh_token")?.value;
    if (!refreshToken?.trim()) {
      return response;
    }

    const res = await fromPromise(
      fetch(
        `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
        {
          cache: "no-store",
          method: "POST",
          body: JSON.stringify({
            grant_type: "refresh_token",
            refreshToken: refreshToken,
          }),
        },
      ),
      (e) => e,
    );

    if (res.isErr()) {
      return response;
    }

    const { id_token: newAccessToken } = await res.value.json<{
      id_token: string;
    }>();
    if (!newAccessToken.trim()) {
      return response;
    }

    response.cookies.set("access_token", newAccessToken, {
      path: "/",
      secure: true,
      maxAge: 60 * 60,
      sameSite: "strict",
    });
    return response;
  } else {
    return response;
  }
};
