import { createParamDefinitionRegExp } from "../src/core";

const f = createParamDefinitionRegExp;

describe("createParamDefinitionRegExp", () => {
  it("should be a function", () => {
    expect(f).toBeInstanceOf(Function);
  });

  it("should return instance of RegExp", () => {
    expect(f("int")).toBeInstanceOf(RegExp);
  });

  it("should set global flag", () => {
    expect(f("int").flags).toBe("g");
  });

  it("should create correct regexp", () => {
    expect(f("int")).toEqual(/\{([a-zA-Z\d_-]+)\:int\}/g);
  });
});
