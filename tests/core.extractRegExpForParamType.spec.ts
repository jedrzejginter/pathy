import { extractRegExpForParamType } from "../src/core";

const f = extractRegExpForParamType;

describe("extractRegExpForParamType", () => {
  it("should be a function", () => {
    expect(f).toBeInstanceOf(Function);
  });

  it("should return RegExp if RegExp is passed", () => {
    expect(f(new RegExp("^$"))).toBeInstanceOf(RegExp);
  });

  it("should return RegExp if { regex: RegExp } is passed", () => {
    expect(f({ regex: new RegExp("^$") })).toBeInstanceOf(RegExp);
  });

  it("should return RegExp without modification", () => {
    const regExp = new RegExp("^$");

    expect(f(regExp)).toBe(regExp);
    expect(f({ regex: regExp })).toBe(regExp);
  });
});
