import { toFloat } from "../../src2/core";

describe("toFloat", () => {
  it("should return 0 for -0", () => {
    expect(toFloat(-0)).toBe(0);
  });

  it("should return NaN for NaN", () => {
    expect(toFloat(NaN)).toBe(NaN);
  });

  it("should return NaN for an empty string", () => {
    expect(toFloat("")).toBe(NaN);
  });

  it("should be an identity for float argument", () => {
    expect(toFloat(-1.234)).toBe(-1.234);
    expect(toFloat(10.34)).toBe(10.34);
  });

  it("should be an identity for integer argument", () => {
    expect(toFloat(-1)).toBe(-1);
    expect(toFloat(0)).toBe(0);
    expect(toFloat(1)).toBe(1);
  });

  it("should return a float for float argument passed as string", () => {
    expect(toFloat("-1.234")).toBe(-1.234);
    expect(toFloat("12.34")).toBe(12.34);
  });

  it("should return an integer for integer argument passed as string", () => {
    expect(toFloat("-1")).toBe(-1);
    expect(toFloat("0")).toBe(0);
    expect(toFloat("1")).toBe(1);
  });

  it("should return NaN for incorrect string argument", () => {
    expect(toFloat("abc")).toBe(NaN);
    expect(toFloat("true")).toBe(NaN);
    expect(toFloat("false")).toBe(NaN);
  });
});
