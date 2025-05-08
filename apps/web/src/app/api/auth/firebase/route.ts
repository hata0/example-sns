import { fromPromise } from "neverthrow";
import { cookies } from "next/headers";
import { firebaseAuth } from "@/lib/firebase/admin";

export const POST = async (req: Request) => {
  const { accessToken, refreshToken } = await req.json();

  const res = await fromPromise(
    firebaseAuth.verifyIdToken(accessToken),
    (e) => e,
  );
  if (res.isErr()) {
    return Response.json({ message: "invalid id token" }, { status: 401 });
  }

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
