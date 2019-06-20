import { toBoolean } from "../../src2/core";

describe("toBoolean", () => {
  it("should return true for true passed as boolean", () => {
    expect(toBoolean(true)).toBe(true);
  });

  it("should return true for Boolean instance with truthy value", () => {
    expect(toBoolean(Boolean(true))).toBe(true);
  });

  it("should return false for false passed as boolean", () => {
    expect(toBoolean(false)).toBe(false);
  });

  it("should return false for Boolean instance with falsy value", () => {
    expect(toBoolean(Boolean())).toBe(false);
    expect(toBoolean(Boolean(false))).toBe(false);
  });

  it("should return true for string 'true'", () => {
    expect(toBoolean("true")).toBe(true);
  });

  it("should return false for string 'false'", () => {
    expect(toBoolean("false")).toBe(false);
  });

  it("should return false for any string other than 'true' or 'false'", () => {
    expect(toBoolean("")).toBe(false);
    expect(toBoolean("1")).toBe(false);
    expect(toBoolean("yes")).toBe(false);
    expect(toBoolean("abc")).toBe(false);
  });
});
