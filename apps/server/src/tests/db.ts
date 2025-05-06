import { execSync } from "child_process";
import { PostgresDatabase } from "@/infrastructure/database/postgresql";
import { PrismaClientKnownRequestError } from "@/infrastructure/database/postgresql/generated/prisma/internal/prismaNamespace";

export const setupDatabase = async () => {
  const db = new PostgresDatabase();
  const newDbName = `worker_${process.env.VITEST_WORKER_ID}`;

  await db.$connect();
  try {
    await db.$executeRaw`CREATE DATABASE ${newDbName}`;
  } catch (error) {
    // db作成済みであれば例外を投げない
    if (!(error instanceof PrismaClientKnownRequestError)) {
      throw error;
    }
  }
  await db.$disconnect();

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
