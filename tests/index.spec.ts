import pathy, { applyParams, createRoute, extractParams } from "../src/index";

describe("module entry", () => {
  describe("default export", () => {
    it("should not be an undefined", () => {
      expect(pathy).not.toBeUndefined();
    });

    it("should be a function", () => {
      expect(pathy).toBeInstanceOf(Function);
    });

    it("should not fail when called without arguments", () => {
      expect(() => pathy()).not.toThrow();
      expect(pathy()).toBeInstanceOf(Object);
    });
  });

  it("should have basic methods exported", () => {
    expect(applyParams).toBeInstanceOf(Function);
    expect(createRoute).toBeInstanceOf(Function);
    expect(extractParams).toBeInstanceOf(Function);
  });

  describe("applyParams", () => {
    it("should be a function", () => {
      expect(applyParams).toBeInstanceOf(Function);
    });

    it("should be an identity function when no params passed", () => {
      expect(applyParams("/abc/def", {})).toBe("/abc/def");
    });

    it("should be an identity function when no params specified", () => {
      expect(applyParams("/abc/def", { arg0: 123 })).toBe("/abc/def");
    });

    it("should apply single param", () => {
      expect(applyParams("/abc/def/{arg0:int}", { arg0: 123 })).toBe("/abc/def/123");
    });

    it("should apply multiple params", () => {
      expect(applyParams("/abc/def/{arg0:int}/{arg1:str}", { arg0: 123, arg1: "my-str" })).toBe(
        "/abc/def/123/my-str",
      );
    });

    it("should work for params that uses kebab case naming convention", () => {
      expect(applyParams("/abc/def/{my-arg:int}", { "my-arg": 123 })).toBe("/abc/def/123");
    });

    it("should work for params that uses spaces in name", () => {
      expect(applyParams("/abc/def/{my arg:int}", { "my arg": 123 })).toBe("/abc/def/123");
    });

    it("should be case-sensitive and throw for param names that differ in casing", () => {
      expect(() => applyParams("/abc/def/{myArgument:int}", { myargument: 123 })).toThrowError(
        "Parameter value for 'myArgument' is missing",
      );
    });

    it("should throw when using unknown type", () => {
      expect(() => applyParams("/abc/def/{arg0:fakeType}", { arg0: 123 })).toThrowError(
        "Unknown type 'fakeType'. Either a typo, or you forgot to add a custom type.",
      );
    });

    it("should throw when passing param invalid value", () => {
      expect(() => applyParams("/abc/def/{arg0:bool}", { arg0: "yes" })).toThrowError(
        "Expected parameter value for 'arg0' to match '^(true|false)$' (got: 'yes').",
      );
    });
  });

  describe("createRoute", () => {
    it("should be an identity function for no params", () => {
      expect(createRoute("/abc/def")).toBe("/abc/def");
    });

    it("should return a normalized path", () => {
      expect(createRoute("//abc/def")).toBe("/abc/def");
      expect(createRoute("/abc/def/")).toBe("/abc/def/");
    });

    it("should create a route for single param", () => {
      expect(createRoute("/abc/{arg0:bool}")).toBe("/abc/:arg0(true|false)");
    });

    it("should create a route for mulitple params", () => {
      expect(createRoute("/abc/{arg0:bool}/{arg1:str}")).toBe(
        "/abc/:arg0(true|false)/:arg1([^/]+)",
      );
    });

    it("should throw for unknown types", () => {
      expect(() => createRoute("/abc/{arg0:bool}/{arg1:incorrectType}")).toThrowError(
        "Unknown type 'incorrectType'. Either a typo, or you forgot to add a custom type.",
      );
    });

    it("should work with specifying params name and regex directly", () => {
      expect(createRoute("/abc/{arg0:bool}/:arg1(\\d+)")).toBe(
        "/abc/:arg0(true|false)/:arg1(\\d+)",
      );
    });
  });

  describe("extractParams", () => {
    it("should return an empty object when no dynamic params specified", () => {
      expect(extractParams("/abc/def", "/abc/def")).toMatchObject({});
    });

    it("should return an empty object when at least one param cannot be matched", () => {
      expect(extractParams("/abc/{arg0:int}", "/abc/def")).toMatchObject({});
      expect(extractParams("/abc/{arg0:int}/{arg1:bool}", "/abc/def/123")).toMatchObject({});
    });

    it("should return an empty object when no params can be matched", () => {
      expect(extractParams("/abc/{arg0:int}", "/abc/def")).toMatchObject({});
      expect(extractParams("/abc/{arg0:int}/{arg1:bool}", "/abc/123/yes")).toMatchObject({});
    });

    it("should match a single param", () => {
      expect(extractParams("/abc/{arg0:int}", "/abc/123")).toMatchObject({ arg0: 123 });
      expect(extractParams("/abc/{arg0:bool}", "/abc/true")).toMatchObject({ arg0: true });
      expect(extractParams("/abc/{arg0:str}", "/abc/345")).toMatchObject({ arg0: "345" });
      expect(extractParams("/abc/{arg0:float}", "/abc/123.45")).toMatchObject({ arg0: 123.45 });
    });

    it("should match multiple params", () => {
      expect(extractParams("/abc/{arg0:int}/{arg1:str}", "/abc/123/def")).toMatchObject({
        arg0: 123,
        arg1: "def",
      });

      expect(
        extractParams("/abc/{arg0:bool}/{arg1:int}/{arg2:str}", "/abc/true/1/def"),
      ).toMatchObject({
        arg0: true,
        arg1: 1,
        arg2: "def",
      });
    });

    it("should throw for unknown types", () => {
      expect(() =>
        extractParams("/abc/{arg0:bool}/{arg1:incorrectType}", "/abc/true/123"),
      ).toThrowError(
        "Unknown type 'incorrectType'. Either a typo, or you forgot to add a custom type.",
      );
    });
  });
});
