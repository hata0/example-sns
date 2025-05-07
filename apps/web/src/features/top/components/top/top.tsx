"use client";
import { useGetPostsSuspense } from "@/gen/api/posts/posts";

export const Top = () => {
  const { data } = useGetPostsSuspense({
    limit: "3",
    page: "1",
  });
  console.log(data);

  return <div className="text-destructive">hello</div>;
};
