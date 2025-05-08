"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { fromPromise } from "neverthrow";
import { Button } from "@/components/shadcn-ui/button";
import { useGetPostsSuspense } from "@/gen/api/posts/posts";
import { auth } from "@/lib/firebase";

export const Top = () => {
  const { data } = useGetPostsSuspense({
    limit: "3",
    page: "1",
  });

  return (
    <div>
      <div>
        <Button
          onClick={async () => {
            const signInRes = await fromPromise(
              signInWithPopup(auth, new GoogleAuthProvider()),
              (e) => e,
            );
            if (signInRes.isErr()) {
              console.error(signInRes.error);
            } else {
              const refreshToken = signInRes.value.user.refreshToken;
              const idToken = await signInRes.value.user.getIdToken();
              await fetch(
                `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/firebase`,
                {
                  cache: "no-store",
                  method: "POST",
                  body: JSON.stringify({
                    accessToken: idToken,
                    refreshToken,
                  }),
                },
              );
            }
          }}
        >
          login
        </Button>
      </div>
    </div>
  );
};
