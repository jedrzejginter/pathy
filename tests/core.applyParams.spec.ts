import { applyParams } from "../src/core";

const f = applyParams;

describe("applyParams", () => {
  it("should be a function", () => {
    expect(f).toBeInstanceOf(Function);
  });

  it("should be an identity function when no params passed", () => {
    expect(f("/abc/def", {})).toBe("/abc/def");
  });

  it("should be an identity function when no params specified", () => {
    expect(f("/abc/def", { arg0: 123 })).toBe("/abc/def");
  });

  it("should apply single param", () => {
    expect(f("/abc/def/{arg0:int}", { arg0: 123 })).toBe("/abc/def/123");
  });

  it("should apply multiple params", () => {
    expect(f("/abc/def/{arg0:int}/{arg1:str}", { arg0: 123, arg1: "my-str" })).toBe(
      "/abc/def/123/my-str",
    );
  });

  it("should be case-sensitive for param names", () => {
    expect(f("/abc/def/{myArgument:int}", { myargument: 123 })).toBe("/abc/def/{myArgument:int}");
  });

  it("should not depend on built-in types", () => {
    expect(f("/abc/def/{arg0:fakeType}", { arg0: 123 })).toBe("/abc/def/123");
  });

  it("should work for params that uses kebab case naming convention", () => {
    expect(f("/abc/def/{my-arg:int}", { "my-arg": 123 })).toBe("/abc/def/123");
  });

  it("should work for params that uses spaces in name", () => {
    expect(f("/abc/def/{my arg:int}", { "my arg": 123 })).toBe("/abc/def/123");
  });
});
