import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Top } from "@/features/top/components/top";
import { getGetPostsSuspenseQueryOptions } from "@/gen/api/posts/posts";
import { getQueryClient } from "@/lib/tanstack-query";

export default async function TopPage() {
  const client = getQueryClient();
  await client.prefetchQuery(
    getGetPostsSuspenseQueryOptions({
      limit: "3",
      page: "1",
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <Top />
    </HydrationBoundary>
  );
}
