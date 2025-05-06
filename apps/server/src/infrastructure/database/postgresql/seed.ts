import { fromPromise } from "neverthrow";
import { PostgresDatabase } from ".";
import { prismaPostMock } from "@/tests/mocks";
import { generateRandomArray } from "@/utils/array";

(async () => {
  const db = new PostgresDatabase();

  const postsOrError = await fromPromise(
    db.post.createMany({
      data: generateRandomArray(() => prismaPostMock()),
    }),
    (e) => e,
  );

  await postsOrError.match(
    async (posts) => {
      console.log(posts);
      await db.$disconnect();
    },
    async (e) => {
      console.error(e);
      await db.$disconnect();
      process.exit(1);
    },
  );
})();
