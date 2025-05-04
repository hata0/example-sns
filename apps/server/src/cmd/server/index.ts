import { cors } from "hono/cors";
import { newApp } from "@/hono";
import { createHandler } from "@/node";
import { NotFoundError } from "@/errors";
import { client } from "@/db/postgresql";

const app = newApp();
app.notFound((c) => {
  const err = new NotFoundError();
  return c.json({ message: err.message }, err.status);
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
  const posts = await client.post.findMany();

  return c.json({
    posts,
  });
});

createHandler(app);
