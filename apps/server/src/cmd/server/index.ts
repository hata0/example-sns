import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { newApp } from "@/hono";
import { createHandler } from "@/node";
import { fromPromise, NotFoundError } from "@/errors";
import { registerPostApi } from "@/router/post";
import { firebaseAuth } from "@/firebase";

const app = newApp();
app.notFound((c) => {
  const e = new NotFoundError();
  return c.json({ message: e.message }, e.status);
});
app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_URL ?? "",
    allowHeaders: ["*"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 600,
    credentials: true,
  }),
);
app.use("*", csrf({ origin: process.env.FRONTEND_URL }));
app.use("*", async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ message: "invalid authorization header" }, 401);
  }

  const accessToken = authHeader.split(" ")[1];

  const res = await fromPromise(
    firebaseAuth.verifyIdToken(accessToken),
    (e) => e,
  );
  if (res.isErr()) {
    return c.json({ message: "unauthorized" }, 401);
  }

  await next();
});

registerPostApi(app);

createHandler(app);
