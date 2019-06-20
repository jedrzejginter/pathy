import { toFloat } from "../../src2/core";

describe("toFloat", () => {
  it("should return 0 for -0", () => {
    expect(toFloat(-0)).toBe(0);
  });
});
