import { defineConfig } from "orval";

const INPUT = `${process.env.NEXT_PUBLIC_SERVER_URL}/doc`;
const OUTPUT = "src/gen/api";

export default defineConfig({
  api: {
    input: {
      target: INPUT,
    },
    output: {
      mode: "tags-split",
      target: OUTPUT,
      schemas: `${OUTPUT}/model`,
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      mock: true,
      override: {
        query: {
          useSuspenseQuery: true,
          version: 5,
          signal: false,
        },
        mutator: {
          path: "src/utils/api.ts",
          name: "fetcher",
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
  zod: {
    input: {
      target: INPUT,
    },
    output: {
      mode: "tags-split",
      target: OUTPUT,
      client: "zod",
      fileExtension: ".zod.ts",
    },
  },
});
