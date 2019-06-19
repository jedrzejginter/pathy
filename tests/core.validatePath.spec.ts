import { validatePath } from "../src/core";

const f = validatePath;

describe("validatePath", () => {
  it("should be a function", () => {
    expect(f).toBeInstanceOf(Function);
  });

  it("should not throw for no params specified", () => {
    expect(() => f("/abc/def", {})).not.toThrow();
  });

  it("should not throw for single valid param specified", () => {
    expect(() => f("/abc/def/{arg0:int}", { int: /^$/ })).not.toThrow();
  });

  it("should not throw for multiple valid params specified", () => {
    expect(() => f("/abc/def/{arg0:int}/{arg1:str}", { int: /^$/, str: /^$/ })).not.toThrow();
  });

  it("should throw for param with unknown type specified", () => {
    expect(() =>
      f("/abc/def/{arg0:unknownType}/{arg1:str}", { int: /^$/, str: /^$/ }),
    ).toThrowError(
      "Unknown type 'unknownType'. Either a typo, or you forgot to add a custom type.",
    );
  });
});
