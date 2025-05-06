/* eslint-disable turbo/no-undeclared-env-vars */
import { execSync } from "child_process";
import { PrismaClientKnownRequestError } from "@/db/postgresql/generated/prisma/internal/prismaNamespace";
import { client } from "@/db/postgresql";

export const setupDatabase = async () => {
  const newDbName = `worker_${process.env.VITEST_WORKER_ID}`;

  await client.$connect();
  try {
    await client.$executeRaw`CREATE DATABASE ${newDbName}`;
  } catch (error) {
    // db作成済みであれば例外を投げない
    if (!(error instanceof PrismaClientKnownRequestError)) {
      throw error;
    }
  }
  await client.$disconnect();

  const dbUrl = new URL(process.env.DATABASE_URL ?? "");
  const baseUrl = dbUrl.href.substring(0, dbUrl.href.lastIndexOf("/"));
  process.env.DATABASE_URL = `${baseUrl}/${newDbName}?schema=public`;

  execSync(
    "pnpm prisma db push --accept-data-loss --skip-generate --force-reset",
    {
      env: {
        ...process.env,
      },
    },
  );
};
