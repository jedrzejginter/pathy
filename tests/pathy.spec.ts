import { pathy } from "../src/pathy";

const f = pathy;
const p = pathy();

describe("pathy", () => {
  it("should be a function", () => {
    expect(f).toBeInstanceOf(Function);
  });

  describe("createRoute", () => {
    it("should be an identity function for no params", () => {
      expect(p.createRoute("/abc/def")).toBe("/abc/def");
    });

    it("should return a normalized path", () => {
      expect(p.createRoute("//abc/def")).toBe("/abc/def");
      expect(p.createRoute("/abc/def/")).toBe("/abc/def/");
    });

    it("should create a route for single param", () => {
      const p = pathy({ types: { myType: /(a|b|c)/ } });
      expect(p.createRoute("/abc/{arg0:myType}")).toBe("/abc/:arg0(a|b|c)");
    });

    it("should create a route for mulitple params", () => {
      const p = pathy({
        types: {
          myType0: /(a|b|c)/,
          myType1: /(d|e|f)/,
        },
      });

      expect(p.createRoute("/abc/{arg0:myType0}/{arg1:myType1}")).toBe(
        "/abc/:arg0(a|b|c)/:arg1(d|e|f)",
      );
    });

    it("should leave unreplaced params definitions for unknown types", () => {
      const p = pathy({
        types: {
          myType: /(a|b|c)/,
        },
      });

      expect(p.createRoute("/abc/{arg0:myType}/{arg1:incorrectType}")).toBe(
        "/abc/:arg0(a|b|c)/{arg1:incorrectType}",
      );
    });

    it("should work with specifying params name and regex directly", () => {
      const p = pathy({
        types: {
          myType: /(a|b|c)/,
        },
      });

      expect(p.createRoute("/abc/{arg0:myType}/:arg1(\\d+)")).toBe("/abc/:arg0(a|b|c)/:arg1(\\d+)");
    });
  });

  describe("without options", () => {
    it("should not throw when called", () => {
      expect(() => f()).not.toThrow();
    });

    it("should return an object", () => {
      expect(f()).toBeInstanceOf(Object);
    });

    it("should have an 'applyParams' method", () => {
      const instance = f();

      expect(instance).toHaveProperty("applyParams");
      expect(instance.applyParams).toBeInstanceOf(Function);
    });

    it("should have a 'createRoute' method", () => {
      const instance = f();

      expect(instance).toHaveProperty("createRoute");
      expect(instance.createRoute).toBeInstanceOf(Function);
    });

    it("should have an 'extractParams' method", () => {
      const instance = f();

      expect(instance).toHaveProperty("extractParams");
      expect(instance.extractParams).toBeInstanceOf(Function);
    });
  });

  describe("with options", () => {
    it("should not throw when called with empty options", () => {
      expect(() => f({})).not.toThrow();
    });

    describe("overwriteTypes: false", () => {
      it("should not throw when called without custom types", () => {
        expect(() => f({ overwriteTypes: false })).not.toThrow();
      });

      it("should throw when called with custom 'int'", () => {
        expect(() => f({ types: { int: /(\\d+)/ } })).toThrow();
      });
    });

    describe("overwriteTypes: true", () => {
      it("should not throw when called without custom types", () => {
        expect(() => f({ overwriteTypes: true })).not.toThrow();
      });

      it("should not throw when called with custom 'int'", () => {
        expect(() => f({ overwriteTypes: true, types: { int: /(\\d+)/ } })).not.toThrow();
      });
    });
  });
});
