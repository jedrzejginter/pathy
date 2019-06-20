import { BOOLEAN_REGEXP, FLOAT_REGEXP } from "../src2/constants";

describe("constants", () => {
  describe("BOOLEAN_REGEXP", () => {
    it("should be a RegExp instance", () => {
      expect(BOOLEAN_REGEXP).toBeInstanceOf(RegExp);
    });

    it("should have a starting ^", () => {
      expect(BOOLEAN_REGEXP.source).toMatch(/^\^/);
    });

    it("should have an ending $", () => {
      expect(BOOLEAN_REGEXP.source).toMatch(/\$$/);
    });

    it("should match 'true' string", () => {
      expect(BOOLEAN_REGEXP.test("true")).toBe(true);
    });

    it("should match 'false' string", () => {
      expect(BOOLEAN_REGEXP.test("false")).toBe(true);
    });

    it("should fail for string other than 'true' and 'false'", () => {
      expect(BOOLEAN_REGEXP.test("")).toBe(false);
      expect(BOOLEAN_REGEXP.test("1")).toBe(false);
      expect(BOOLEAN_REGEXP.test("0")).toBe(false);
      expect(BOOLEAN_REGEXP.test("yes")).toBe(false);
      expect(BOOLEAN_REGEXP.test("no")).toBe(false);
    });
  });

  describe("FLOAT_REGEXP", () => {
    it("should be a RegExp instance", () => {
      expect(FLOAT_REGEXP).toBeInstanceOf(RegExp);
    });

    it("should have a starting ^", () => {
      expect(FLOAT_REGEXP.source).toMatch(/^\^/);
    });

    it("should have an ending $", () => {
      expect(FLOAT_REGEXP.source).toMatch(/\$$/);
    });

    it("should match float", () => {
      expect(FLOAT_REGEXP.test("-1.23")).toBe(true);
      expect(FLOAT_REGEXP.test("0.0")).toBe(true);
      expect(FLOAT_REGEXP.test("0.999")).toBe(true);
      expect(FLOAT_REGEXP.test("0.001")).toBe(true);
      expect(FLOAT_REGEXP.test("1.234")).toBe(true);
    });

    it("should match integer", () => {
      expect(FLOAT_REGEXP.test("-123")).toBe(true);
      expect(FLOAT_REGEXP.test("0")).toBe(true);
      expect(FLOAT_REGEXP.test("123")).toBe(true);
    });
  });
});
