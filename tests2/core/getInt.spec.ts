import { getInt } from "../../src2/core";

describe("getInt", () => {
  it("should return 0 for 0", () => {
    expect(getInt(0)).toBe(0);
  });

  it("should return -0 for -0", () => {
    expect(getInt(-0)).toBe(-0);
  });

  it("should return NaN for NaN", () => {
    expect(getInt(NaN)).toBe(NaN);
  });

  it("should return an integer for integer below 0", () => {
    expect(getInt(-1)).toBe(-1);
    expect(getInt(-10)).toBe(-10);
    expect(getInt(-123)).toBe(-123);
  });

  it("should return an integer for integer above 0", () => {
    expect(getInt(1)).toBe(1);
    expect(getInt(10)).toBe(10);
    expect(getInt(123)).toBe(123);
  });

  it("should return integer for float below 0", () => {
    expect(getInt(-0.001)).toBe(-0);
    expect(getInt(-0.999)).toBe(-0);
    expect(getInt(-1.234)).toBe(-1);
    expect(getInt(-12.34)).toBe(-12);
    expect(getInt(-123.4)).toBe(-123);
  });

  it("should return an integer for float above 1", () => {
    expect(getInt(0.001)).toBe(0);
    expect(getInt(0.999)).toBe(0);
    expect(getInt(1.01)).toBe(1);
    expect(getInt(10.5)).toBe(10);
    expect(getInt(123.99)).toBe(123);
  });

  it("should return an integer for hex argument", () => {
    expect(getInt(0xa)).toBe(10);
  });
});
