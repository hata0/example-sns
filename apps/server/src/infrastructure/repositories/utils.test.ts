import { describe, expect, it } from "vitest";
import { getSkip, getTake } from "./utils";

describe("getSkip", () => {
  it("should return 40", () => {
    const result = getSkip({ limit: 10, page: 5 });
    expect(result).toBe(40);
  });
});

describe("getTake", () => {
  it("should return 12", () => {
    const result = getTake({ limit: 12, page: 4 });
    expect(result).toBe(12);
  });
});
