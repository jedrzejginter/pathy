import { toNumber } from "../../src2/core";

describe("toNumber", () => {
  it("should return -0 for -0", () => {
    expect(toNumber(-0)).toBe(-0);
  });

  it("should return NaN for NaN", () => {
    expect(toNumber(NaN)).toBe(NaN);
  });

  it("should return NaN for an empty string", () => {
    expect(toNumber("")).toBe(NaN);
  });

  it("should be an identity for float argument", () => {
    expect(toNumber(-1.234)).toBe(-1.234);
    expect(toNumber(10.34)).toBe(10.34);
  });

  it("should be an identity for integer argument", () => {
    expect(toNumber(-1)).toBe(-1);
    expect(toNumber(0)).toBe(0);
    expect(toNumber(1)).toBe(1);
  });

  it("should return a float for float argument passed as string", () => {
    expect(toNumber("-1.234")).toBe(-1.234);
    expect(toNumber("12.34")).toBe(12.34);
  });

  it("should return an integer for integer argument passed as string", () => {
    expect(toNumber("-1")).toBe(-1);
    expect(toNumber("0")).toBe(0);
    expect(toNumber("1")).toBe(1);
  });

  it("should return NaN for incorrect string argument", () => {
    expect(toNumber("1x")).toBe(NaN);
    expect(toNumber("abc")).toBe(NaN);
    expect(toNumber("true")).toBe(NaN);
    expect(toNumber("false")).toBe(NaN);
  });

  it("should return integer for hexadecimal string", () => {
    expect(toNumber("0x0")).toBe(0);
    expect(toNumber("0xa")).toBe(10);
  });
});
