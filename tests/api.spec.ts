import pathy, { parsePathParams } from "../src";

describe("pathy", () => {
  describe("parsePathParams", () => {
    it("should return object with string params", () => {
      const path = "/abc/{arg0:str}/{arg1:str}";

      expect(parsePathParams(path, "/abc/def/ghi")).toMatchObject({
        arg0: "def",
        arg1: "ghi"
      });
    });

    it("should return object with parsed int and bool params", () => {
      const path = "/abc/{arg0:int}/{arg1:bool}";

      expect(parsePathParams(path, "/abc/345/true")).toMatchObject({
        arg0: 345,
        arg1: true
      });
    });

    it("should return null when cannot match all params", () => {
      const path = "/abc/{arg0:int}/{arg1:bool}";

      expect(parsePathParams(path, "/abc/notint/true")).toBeNull();
      expect(parsePathParams(path, "/abc/123")).toBeNull();
      expect(parsePathParams(path, "/abc/123/yes")).toBeNull();
    });
  });

  it("should create basic library methods", () => {
    const instance = pathy();

    expect(instance).toHaveProperty("applyParams");
    expect(instance).toHaveProperty("createRoute");
    expect(instance).toHaveProperty("parsePathParams");
  });

  it("should create instance with user-defined annotations", () => {
    const instance = pathy({
      annotations: {
        myint: /\d+/
      }
    });

    expect(instance).toHaveProperty("applyParams");
    expect(instance).toHaveProperty("createRoute");
    expect(instance).toHaveProperty("parsePathParams");
  });

  it("should throw when overwriting core annotation", () => {
    const creator = () => {
      pathy({
        annotations: {
          int: /\d+/
        }
      });
    };

    expect(creator).toThrow();
  });

  describe("user-defined annotations", () => {
    it("should replace for custom annotation", () => {
      const { createRoute } = pathy({
        annotations: {
          mydigit: /\d/
        }
      });

      expect(createRoute("/abc/{arg0:mydigit}")).toBe("/abc/:arg0(\\d)");
    });

    it("should replace for custom annotation", () => {
      const { applyParams } = pathy({
        annotations: {
          myint: /\d+/
        }
      });

      expect(applyParams("/abc/{arg0:myint}", { arg0: 30 })).toBe("/abc/30");
    });
  });
});
