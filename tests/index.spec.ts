import * as mod from "../src/index";

describe("module entry", () => {
  describe("default export", () => {
    it("should not be an undefined", () => {
      expect(mod.default).not.toBeUndefined();
    });

    it("should be a function", () => {
      expect(mod.default).toBeInstanceOf(Function);
    });

    it("should not fail when called without arguments", () => {
      expect(() => mod.default()).not.toThrow();
      expect(mod.default()).toBeInstanceOf(Object);
    });
  });

  it("should have basic methods exported", () => {
    expect(mod).toHaveProperty("applyParams");
    expect(mod.applyParams).toBeInstanceOf(Function);

    expect(mod).toHaveProperty("createRoute");
    expect(mod.createRoute).toBeInstanceOf(Function);

    expect(mod).toHaveProperty("extractParams");
    expect(mod.extractParams).toBeInstanceOf(Function);
  });
});
