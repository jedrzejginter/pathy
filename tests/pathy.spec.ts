import { pathy } from "../src/pathy";

describe("pathy", () => {
  it("should be a function", () => {
    expect(pathy).toBeInstanceOf(Function);
  });

  describe("without options", () => {
    it("should not throw when called", () => {
      expect(() => pathy()).not.toThrow();
    });

    it("should return an object", () => {
      expect(pathy()).toBeInstanceOf(Object);
    });

    it("should have an 'applyParams' method", () => {
      const instance = pathy();

      expect(instance).toHaveProperty("applyParams");
      expect(instance.applyParams).toBeInstanceOf(Function);
    });

    it("should have a 'createRoute' method", () => {
      const instance = pathy();

      expect(instance).toHaveProperty("createRoute");
      expect(instance.createRoute).toBeInstanceOf(Function);
    });

    it("should have an 'extractParams' method", () => {
      const instance = pathy();

      expect(instance).toHaveProperty("extractParams");
      expect(instance.extractParams).toBeInstanceOf(Function);
    });
  });

  describe("with options", () => {
    it("should not throw when called with empty options", () => {
      expect(() => pathy({})).not.toThrow();
    });

    it("should wrap custom types regex with brackets", () => {
      const instance = pathy({ types: { myType: /[a-f]+/ } });

      expect(instance.createRoute("/abc/{arg0:myType}")).toBe("/abc/:arg0([a-f]+)");
    });

    describe("overwriteTypes: false", () => {
      it("should not throw when called without custom types", () => {
        expect(() => pathy({ overwriteTypes: false })).not.toThrow();
      });

      it("should throw when called with custom 'int'", () => {
        expect(() => pathy({ types: { int: /(\\d+)/ } })).toThrow();
      });
    });

    describe("overwriteTypes: true", () => {
      it("should not throw when called without custom types", () => {
        expect(() => pathy({ overwriteTypes: true })).not.toThrow();
      });

      it("should not throw when called with custom 'int'", () => {
        expect(() => pathy({ overwriteTypes: true, types: { int: /(\\d+)/ } })).not.toThrow();
      });
    });
  });
});
