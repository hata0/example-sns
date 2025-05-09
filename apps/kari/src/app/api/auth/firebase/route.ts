import { cookies } from "next/headers";

export const POST = async (req: Request) => {
  const { accessToken, refreshToken } = await req.json<{
    accessToken: string;
    refreshToken: string;
  }>();

  // TODO: firebaseとcloudflareの相性問題でこれは使えないので後で対策
  // const res = await fromPromise(
  //   getAuth(await getAdmin()).verifyIdToken(accessToken),
  //   (e) => e,
  // );
  // if (res.isErr()) {
  //   return Response.json({ message: "invalid id token" }, { status: 401 });
  // }

  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, {
    path: "/",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60,
    sameSite: "strict",
  });
  cookieStore.set("refresh_token", refreshToken, {
    path: "/",
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 200,
    sameSite: "strict",
  });

  return Response.json({ message: "success" }, { status: 200 });
};
