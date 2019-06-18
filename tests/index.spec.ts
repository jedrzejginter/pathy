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

  describe("extractParams", () => {
    it("should return an empty object when no dynamic params specified", () => {
      expect(mod.extractParams("/abc/def", "/abc/def")).toMatchObject({});
    });

    it("should return an empty object when at least one param cannot be matched", () => {
      expect(mod.extractParams("/abc/{arg0:int}", "/abc/def")).toMatchObject({});
      expect(mod.extractParams("/abc/{arg0:int}/{arg1:bool}", "/abc/def/123")).toMatchObject({});
    });

    it("should return an empty object when no params can be matched", () => {
      expect(mod.extractParams("/abc/{arg0:int}", "/abc/def")).toMatchObject({});
      expect(mod.extractParams("/abc/{arg0:int}/{arg1:bool}", "/abc/123/yes")).toMatchObject({});
    });

    it("should match a single param", () => {
      expect(mod.extractParams("/abc/{arg0:int}", "/abc/123")).toMatchObject({ arg0: 123 });
      expect(mod.extractParams("/abc/{arg0:bool}", "/abc/true")).toMatchObject({ arg0: true });
      expect(mod.extractParams("/abc/{arg0:str}", "/abc/345")).toMatchObject({ arg0: "345" });
    });

    it("should match multiple params", () => {
      expect(mod.extractParams("/abc/{arg0:int}/{arg1:str}", "/abc/123/def")).toMatchObject({
        arg0: 123,
        arg1: "def",
      });

      expect(
        mod.extractParams("/abc/{arg0:bool}/{arg1:int}/{arg2:str}", "/abc/true/1/def"),
      ).toMatchObject({
        arg0: true,
        arg1: 1,
        arg2: "def",
      });
    });
  });
});
