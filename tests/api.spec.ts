import pathy, { extractParams } from "../src";

describe("pathy", () => {
  describe("parsePathParams", () => {
    it("should return object with string params", () => {
      const path = "/abc/{arg0:str}/{arg1:str}";

      expect(extractParams("/abc/def/ghi", path)).toMatchObject({
        arg0: "def",
        arg1: "ghi",
      });
    });

    it("should return object with parsed int and bool params", () => {
      const path = "/abc/{arg0:int}/{arg1:bool}";

      expect(extractParams("/abc/345/true", path)).toMatchObject({
        arg0: 345,
        arg1: true,
      });
    });

    it("should return empty object when cannot match all params", () => {
      const path = "/abc/{arg0:int}/{arg1:bool}";

      expect(extractParams("/abc/notint/true", path)).toMatchObject({});
      expect(extractParams("/abc/123", path)).toMatchObject({});
      expect(extractParams("/abc/123/yes", path)).toMatchObject({});
    });
  });

  it("should create basic library methods", () => {
    const instance = pathy();

    expect(instance).toHaveProperty("applyParams");
    expect(instance).toHaveProperty("createRoute");
    expect(instance).toHaveProperty("extractParams");
  });

  it("should create instance with user-defined types", () => {
    const instance = pathy({
      types: {
        myint: /\d+/,
      },
    });

    expect(instance).toHaveProperty("applyParams");
    expect(instance).toHaveProperty("createRoute");
    expect(instance).toHaveProperty("extractParams");
  });

  it("should throw when overwriting core types", () => {
    const creator = () => {
      pathy({
        types: {
          int: /\d+/,
        },
      });
    };

    expect(creator).toThrow();
  });

  it("should not throw when overwriting core types with 'overwriteTypes' set to true", () => {
    const creator = () => {
      pathy({
        overwriteTypes: true,
        types: {
          int: /\d+/,
        },
      });
    };

    expect(creator).not.toThrow();
  });

  describe("user-defined types", () => {
    it("should replace for custom type", () => {
      const { createRoute } = pathy({
        types: {
          mydigit: /\d/,
        },
      });

      expect(createRoute("/abc/{arg0:mydigit}")).toBe("/abc/:arg0(\\d)");
    });

    it("should replace for custom type", () => {
      const { applyParams } = pathy({
        types: {
          myint: /\d+/,
        },
      });

      expect(applyParams("/abc/{arg0:myint}", { arg0: 30 })).toBe("/abc/30");
    });
  });
});
