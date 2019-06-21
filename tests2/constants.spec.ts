import { BOOL_REGEXP, FLOAT_REGEXP, INT_REGEXP, UINT_REGEXP } from "../src2/constants";

describe("constants", () => {
  describe("BOOL_REGEXP", () => {
    it("should be a RegExp instance", () => {
      expect(BOOL_REGEXP).toBeInstanceOf(RegExp);
    });

    it("should have a starting ^", () => {
      expect(BOOL_REGEXP.source).toMatch(/^\^/);
    });

    it("should have an ending $", () => {
      expect(BOOL_REGEXP.source).toMatch(/\$$/);
    });

    it("should match 'true' string", () => {
      expect(BOOL_REGEXP.test("true")).toBe(true);
    });

    it("should match 'false' string", () => {
      expect(BOOL_REGEXP.test("false")).toBe(true);
    });

    it("should fail for string other than 'true' and 'false'", () => {
      expect(BOOL_REGEXP.test("")).toBe(false);
      expect(BOOL_REGEXP.test("1")).toBe(false);
      expect(BOOL_REGEXP.test("0")).toBe(false);
      expect(BOOL_REGEXP.test("yes")).toBe(false);
      expect(BOOL_REGEXP.test("no")).toBe(false);
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

  describe("INT_REGEXP", () => {
    it("should be a RegExp instance", () => {
      expect(INT_REGEXP).toBeInstanceOf(RegExp);
    });

    it("should have a starting ^", () => {
      expect(INT_REGEXP.source).toMatch(/^\^/);
    });

    it("should have an ending $", () => {
      expect(INT_REGEXP.source).toMatch(/\$$/);
    });

    it("should match integer", () => {
      expect(INT_REGEXP.test("-123")).toBe(true);
      expect(INT_REGEXP.test("0")).toBe(true);
      expect(INT_REGEXP.test("123")).toBe(true);
    });

    it("should not match -0", () => {
      expect(INT_REGEXP.test("-0")).toBe(false);
    });
  });

  describe("UINT_REGEXP", () => {
    it("should be a RegExp instance", () => {
      expect(UINT_REGEXP).toBeInstanceOf(RegExp);
    });

    it("should have a starting ^", () => {
      expect(UINT_REGEXP.source).toMatch(/^\^/);
    });

    it("should have an ending $", () => {
      expect(UINT_REGEXP.source).toMatch(/\$$/);
    });

    it("should match positive integer", () => {
      expect(UINT_REGEXP.test("0")).toBe(true);
      expect(UINT_REGEXP.test("123")).toBe(true);
    });

    it("should not match -0", () => {
      expect(UINT_REGEXP.test("-0")).toBe(false);
    });

    it("should not match negative integer", () => {
      expect(UINT_REGEXP.test("-1")).toBe(false);
      expect(UINT_REGEXP.test("-123")).toBe(false);
    });
  });
});
