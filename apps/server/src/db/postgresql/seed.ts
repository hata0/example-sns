import { fromPromise } from "neverthrow";
import { PrismaClient } from "@/db/postgresql/generated/prisma";
import { prismaPostMock } from "@/tests/mocks";
import { generateRandomArray } from "@/utils/array";

(async () => {
  const prisma = new PrismaClient();
  const postsOrError = await fromPromise(
    prisma.post.createMany({
      data: generateRandomArray(() => prismaPostMock()),
    }),
    (e) => e,
  );

  await postsOrError.match(
    async (posts) => {
      console.log(posts);
      await prisma.$disconnect();
    },
    async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    },
  );
})();
