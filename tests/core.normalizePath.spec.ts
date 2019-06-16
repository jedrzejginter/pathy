import { normalizePath } from "../src/core";

const f = normalizePath;

describe("normalizePath", () => {
  it("should be a function", () => {
    expect(f).toBeInstanceOf(Function);
  });

  it("should be an identity function for already normalized paths", () => {
    expect(f("/")).toBe("/");
    expect(f("/abc")).toBe("/abc");
  });

  it("should remove single trailing slash", () => {
    expect(f("/abc/")).toBe("/abc");
    expect(f("/abc/def/")).toBe("/abc/def");
  });

  it("should remove multiple trailing slashes", () => {
    expect(f("/abc//")).toBe("/abc");
    expect(f("/abc///")).toBe("/abc");
    expect(f("/abc/def//")).toBe("/abc/def");
    expect(f("/abc/def///")).toBe("/abc/def");
  });

  it("should remove single trailing space", () => {
    expect(f("/abc ")).toBe("/abc");
    expect(f("/abc/def ")).toBe("/abc/def");
  });

  it("should remove multiple trailing spaces", () => {
    expect(f("/abc   ")).toBe("/abc");
    expect(f("/abc/def   ")).toBe("/abc/def");
  });

  it("should remove single leading space", () => {
    expect(f(" /abc")).toBe("/abc");
    expect(f(" /abc/def")).toBe("/abc/def");
  });

  it("should remove multiple leading spaces", () => {
    expect(f("   /abc")).toBe("/abc");
    expect(f("   /abc/def")).toBe("/abc/def");
  });

  it("should replace multiple leading slashed when leading spaces", () => {
    expect(f(" ///abc")).toBe("/abc");
  });

  it("should not replace double slash for protocols", () => {
    expect(f("ws://abc.com")).toBe("ws://abc.com");
    expect(f("http://abc.com")).toBe("http://abc.com");
    expect(f("file://abc.com")).toBe("file://abc.com");
    expect(f("https://abc.com")).toBe("https://abc.com");
  });

  it("should leave double slash for protocols if there are following slashes", () => {
    expect(f("http:///abc.com")).toBe("http://abc.com");
    expect(f("http:////abc.com")).toBe("http://abc.com");
  });

  it("should work for combination of incorrect paths", () => {
    expect(f("/abc//def")).toBe("/abc/def");
    expect(f(" /abc//def//")).toBe("/abc/def");
    expect(f(" http:///abc.com")).toBe("http://abc.com");
  });

  it("should keep parameter definitions", () => {
    expect(f("/abc/{arg0:int}/")).toBe("/abc/{arg0:int}");
    expect(f("//abc/{arg0:int}/{arg1:str}")).toBe("/abc/{arg0:int}/{arg1:str}");
  });
});
