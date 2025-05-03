import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cmd/server/index.ts"],
  format: ["esm"],
  target: "ESNext",
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  minify: true,
  clean: true,
  dts: true,
  platform: "node",
  shims: false,
});
