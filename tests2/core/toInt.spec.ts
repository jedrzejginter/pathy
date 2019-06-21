import { toInt } from "../../src2/core";

describe("toInt", () => {
  it("should return 0 for -0", () => {
    expect(toInt(-0)).toBe(0);
  });

  it("should return NaN for NaN", () => {
    expect(toInt(NaN)).toBe(NaN);
  });

  it("should return NaN for an empty string", () => {
    expect(toInt("")).toBe(NaN);
  });

  it("should return an integer for float argument ", () => {
    expect(toInt(-1.234)).toBe(-1);
    expect(toInt(10.34)).toBe(10);
  });

  it("should be an identity for integer argument", () => {
    expect(toInt(-1)).toBe(-1);
    expect(toInt(0)).toBe(0);
    expect(toInt(1)).toBe(1);
  });

  it("should return an integer for float argument passed as string", () => {
    expect(toInt("-1.234")).toBe(-1);
    expect(toInt("12.34")).toBe(12);
  });

  it("should return an integer for integer argument passed as string", () => {
    expect(toInt("-1")).toBe(-1);
    expect(toInt("0")).toBe(0);
    expect(toInt("1")).toBe(1);
  });

  it("should return NaN for incorrect string argument", () => {
    expect(toInt("abc")).toBe(NaN);
    expect(toInt("true")).toBe(NaN);
    expect(toInt("false")).toBe(NaN);
  });
});
