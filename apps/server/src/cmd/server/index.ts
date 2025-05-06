import { cors } from "hono/cors";
import { newApp } from "@/hono";
import { createHandler } from "@/node";
import { NotFoundError } from "@/errors";
import { PostgresDatabase } from "@/infrastructure/database/postgresql";

const app = newApp();
app.notFound((c) => {
  const e = new NotFoundError();
  return c.json({ message: e.message }, e.status);
});
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
  const db = new PostgresDatabase();
  const posts = await db.post.findMany();

  return c.json({
    posts,
  });
});

createHandler(app);
