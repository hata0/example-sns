"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/shadcn-ui/button";
import { useGetPostsSuspense } from "@/gen/api/posts/posts";
import { auth } from "@/lib/firebase";

export const Top = () => {
  const { data } = useGetPostsSuspense({
    limit: "3",
    page: "1",
  });
  console.log(data);

  return (
    <div>
      <div>
        <Button
          onClick={async () => {
            await signInWithPopup(auth, new GoogleAuthProvider());
          }}
        >
          login
        </Button>
      </div>
    </div>
  );
};
