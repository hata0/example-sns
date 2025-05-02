import { cors } from "hono/cors";
import { newApp } from "@/hono";
import { createHandler } from "@/node";

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
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

createHandler(app);
