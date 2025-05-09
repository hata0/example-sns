"use client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useGetPostsSuspense } from "@/gen/api/posts/posts";

export const TasksList = () => {
  const { data } = useGetPostsSuspense({
    limit: "50",
    page: "1",
  });

  return (
    <ul className="flex flex-col justify-center gap-y-4">
      {data.posts.map(({ id, content, createdAt, updatedAt }) => (
        <li key={id}>
          <div>{content}</div>
          <div className="flex gap-x-2">
            <div>
              {format(
                createdAt,
                "'作成日: 'yyyy'年'M'月'd'日'(EEE)H'時'm'分'",
                {
                  locale: ja,
                },
              )}
            </div>
            <div>
              {format(
                updatedAt,
                "'更新日: 'yyyy'年'M'月'd'日'(EEE)H'時'm'分'",
                {
                  locale: ja,
                },
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
