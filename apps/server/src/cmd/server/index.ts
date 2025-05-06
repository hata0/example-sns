import { cors } from "hono/cors";
import { newApp } from "@/hono";
import { createHandler } from "@/node";
import { NotFoundError } from "@/errors";
import { registerPostApi } from "@/router/post";

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
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 600,
  }),
);

registerPostApi(app);

createHandler(app);
