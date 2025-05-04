import { fromPromise } from "neverthrow";
import { client } from ".";
import { prismaPostMock } from "@/tests/mocks";
import { generateRandomArray } from "@/utils/array";

(async () => {
  const postsOrError = await fromPromise(
    client.post.createMany({
      data: generateRandomArray(() => prismaPostMock()),
    }),
    (e) => e,
  );

  await postsOrError.match(
    async (posts) => {
      console.log(posts);
      await client.$disconnect();
    },
    async (e) => {
      console.error(e);
      await client.$disconnect();
      process.exit(1);
    },
  );
})();
