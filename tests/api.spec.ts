import { pathy } from "../src/api";

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
});
