import { cors } from "hono/cors";
import { newApp } from "@/hono";
import { createHandler } from "@/node";
import { PrismaClient } from "@/db/postgresql/generated/prisma";

const app = newApp();
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["*"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    maxAge: 600,
  }),
);

// TODO: 後で削除
app.get("/", async (c) => {
  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany();

  return c.json({
    posts,
  });
});

createHandler(app);
