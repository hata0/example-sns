"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { fromPromise } from "neverthrow";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { Tasks } from "../tasks";
import { TasksForm } from "../tasks-form";
import { Button } from "@/components/shadcn-ui/button";
import { clientAuth } from "@/lib/firebase/client";
import { clientUrl } from "@/env";

export const Top = () => {
  return (
    <div>
      <main className="flex flex-col justify-center gap-y-4">
        <ErrorBoundary
          fallback={
            <div>
              <div>タスクの取得に失敗しました。ログインしてください。</div>
              <Button
                onClick={async () => {
                  const signInRes = await fromPromise(
                    signInWithPopup(clientAuth, new GoogleAuthProvider()),
                    (e) => e,
                  );
                  if (signInRes.isErr()) {
                    console.error(signInRes.error);
                  } else {
                    const refreshToken = signInRes.value.user.refreshToken;
                    const idToken = await signInRes.value.user.getIdToken();
                    await fetch(`${clientUrl}/api/auth/firebase`, {
                      cache: "no-store",
                      method: "POST",
                      body: JSON.stringify({
                        accessToken: idToken,
                        refreshToken,
                      }),
                    });
                    window.location.reload();
                  }
                }}
                className="w-fit"
              >
                Googleでログイン
              </Button>
            </div>
          }
        >
          <Suspense fallback={<div>ロード中</div>}>
            <TasksForm />
            <Tasks />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};
