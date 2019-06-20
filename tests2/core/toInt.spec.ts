import { toInt } from "../../src2/core";

describe("toInt", () => {
  it("should return 0 for -0", () => {
    expect(toInt(-0)).toBe(0);
  });

  it("should return integer for negative float", () => {
    expect(toInt(-0.001)).toBe(0);
    expect(toInt(-0.999)).toBe(0);
    expect(toInt(-10.34)).toBe(-10);
  });

  it("should return integer for positive float", () => {
    expect(toInt(0.001)).toBe(0);
    expect(toInt(0.999)).toBe(0);
    expect(toInt(10.34)).toBe(10);
  });
});
