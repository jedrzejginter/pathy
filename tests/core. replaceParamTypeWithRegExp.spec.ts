import { replaceParamTypeWithRegExp } from "../src/core";

const f = replaceParamTypeWithRegExp;

describe("replaceParamTypeWithRegExp", () => {
  it("should be a function", () => {
    expect(f).toBeInstanceOf(Function);
  });

  it("should replace param definition with regex and keep the name", () => {
    expect(f("/abc/{arg0:int}", /\{(.+)\:int\}/, /(\d+)/)).toBe("/abc/:arg0(\\d+)");
  });

  it("should replace param definition with regex and omit the name", () => {
    expect(f("/abc/{arg0:int}", /\{(.+)\:int\}/, /(\d+)/, false)).toBe("/abc/(\\d+)");
  });
});
