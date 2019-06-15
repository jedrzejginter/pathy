import pathy from "../src";

describe("pathy", () => {
  it("should create basic library methods", () => {
    const instance = pathy();

    expect(instance).toHaveProperty("applyParams");
    expect(instance).toHaveProperty("createRoute");
  });

  it("should create instance with user-defined annotations", () => {
    const instance = pathy({
      annotations: {
        myint: /\d+/
      }
    });

    expect(instance).toHaveProperty("applyParams");
    expect(instance).toHaveProperty("createRoute");
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
