import { describe, expect, it } from "vitest";
import { newApp } from "./app";
import { RequestClient } from "@/tests/request";
import { UnauthorizedError } from "@/errors";

describe("newApp", () => {
  const app = newApp();
  const client = new RequestClient(app);
  const e = new UnauthorizedError();
  const errorResponse = { message: e.message };

  describe("/doc", () => {
    it("bearer token is required error", async () => {
      const token = process.env.BEARER_TOKEN;
      delete process.env.BEARER_TOKEN;
      expect(() => newApp()).toThrow(new Error("bearer token is required"));
      process.env.BEARER_TOKEN = token;
    });

    it("401", async () => {
      const res = await client.request("GET", "/doc");
      expect(res.status).toBe(e.status);
      expect(await res.json()).toEqual(errorResponse);
    });

    it("200", async () => {
      const res = await client.request("GET", "/doc", {
        headers: {
          Authorization: "Bearer bearer-token",
        },
      });
      expect(res.status).toBe(200);
    });
  });

  describe("/swagger-ui", () => {
    it("basic auth username is required error", async () => {
      const username = process.env.BASIC_AUTH_USERNAME;
      delete process.env.BASIC_AUTH_USERNAME;
      expect(() => newApp()).toThrow(
        new Error("basic auth username is required"),
      );
      process.env.BASIC_AUTH_USERNAME = username;
    });

    it("basic auth password is required", async () => {
      const password = process.env.BASIC_AUTH_PASSWORD;
      delete process.env.BASIC_AUTH_PASSWORD;
      expect(() => newApp()).toThrow(
        new Error("basic auth password is required"),
      );
      process.env.BASIC_AUTH_PASSWORD = password;
    });

    it("401", async () => {
      const res = await client.request("GET", "/swagger-ui");
      expect(res.status).toBe(e.status);
      expect(await res.json()).toEqual(errorResponse);
    });

    it("200", async () => {
      const res = await client.request("GET", "/swagger-ui", {
        headers: {
          Authorization: `Basic ${Buffer.from("username:password", "utf-8").toString("base64")}`,
        },
      });
      expect(res.status).toBe(200);
    });
  });
});
