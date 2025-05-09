"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { fromPromise } from "neverthrow";
import { Tasks } from "../tasks";
import { TasksForm } from "../tasks-form";
import { Button } from "@/components/shadcn-ui/button";
import { auth } from "@/lib/firebase";

export const Top = () => {
  return (
    <div>
      <main className="flex flex-col justify-center gap-y-4">
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
          className="w-fit"
        >
          Googleでログイン
        </Button>
        <TasksForm />
        <Tasks />
      </main>
    </div>
  );
};
