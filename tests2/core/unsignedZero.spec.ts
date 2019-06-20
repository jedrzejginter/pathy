import { unsignedZero } from "../../src2/core";

describe("unsignedZero", () => {
  it("should return 0 for 0", () => {
    expect(unsignedZero(0)).toBe(0);
  });

  it("should return 0 for -0", () => {
    expect(unsignedZero(-0)).toBe(0);
  });

  it("should return NaN for NaN", () => {
    expect(unsignedZero(NaN)).toBe(NaN);
  });

  it("should be an identity for non-zero argument", () => {
    expect(unsignedZero(1)).toBe(1);
    expect(unsignedZero(-1)).toBe(-1);
  });
});
