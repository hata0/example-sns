import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: [
      ".next/*",
      ".vercel/*",
      "src/gen/*",
      ".open-next/*",
      "cloudflare-env.d.ts",
    ],
  },
];
