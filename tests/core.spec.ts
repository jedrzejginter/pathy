import {
  applyParams,
  normalizePath,
  replaceForBool,
  replaceForString
} from "../src/core";

describe("normalizePath", () => {
  it("should return input when nothing to do", () => {
    expect(normalizePath("/abc/def")).toBe("/abc/def");
  });

  it("should replace multiple slashed with one", () => {
    expect(normalizePath("/abc//def")).toBe("/abc/def");
    expect(normalizePath("/abc//def//ghi")).toBe("/abc/def/ghi");
  });

  it("should remove trailing slash", () => {
    expect(normalizePath("/abc/")).toBe("/abc");
  });

  it("should remove leading white spaces", () => {
    expect(normalizePath("  /abc/def")).toBe("/abc/def");
  });

  it("should remove trailing white spaces", () => {
    expect(normalizePath("/abc/def  ")).toBe("/abc/def");
  });

  it("should replace multiple leading slashes into one", () => {
    expect(normalizePath("//abc")).toBe("/abc");
  });

  it("should remove multiple trailing slashes", () => {
    expect(normalizePath("/abc/def//")).toBe("/abc/def");
  });

  it("should leave double slashes for protocol", () => {
    expect(normalizePath("http://abc.com")).toBe("http://abc.com");
    expect(normalizePath("https://abc.com")).toBe("https://abc.com");
    expect(normalizePath("file://abc.txt")).toBe("file://abc.txt");
    expect(normalizePath("ws://abc.com")).toBe("ws://abc.com");
  });

  it("should normalize slashes for protocol if sequence longer than 2", () => {
    expect(normalizePath("http:///abc.com/def")).toBe("http://abc.com/def");
    expect(normalizePath("ws://////abc.com")).toBe("ws://abc.com");
  });
});

describe("replaceForString", () => {
  it("should replace string parameter annotation", () => {
    expect(replaceForString("/abc/{arg0:str}")).toBe("/abc/:arg0([^\\/]+)");
  });
});

describe("replaceForBool", () => {
  it("should replace boolean parameter annotation", () => {
    expect(replaceForBool("/abc/{arg0:bool}")).toBe("/abc/:arg0(true|false)");
  });
});

describe("applyParams", () => {
  it("should apply single integer parameter", () => {
    const url = "/abc/{arg0:int}";

    expect(applyParams(url, { arg0: 0 })).toBe("/abc/0");
    expect(applyParams(url, { arg0: 1 })).toBe("/abc/1");
    expect(applyParams(url, { arg0: 345 })).toBe("/abc/345");

    expect(applyParams(url, { arg0: -1 })).toBe("/abc/-1");
    expect(applyParams(url, { arg0: -345 })).toBe("/abc/-345");
  });

  it("should apply multiple integer parameters", () => {
    const url = "/abc/{arg0:int}/def/{arg1:int}";

    expect(applyParams(url, { arg0: 345, arg1: 123 })).toBe("/abc/345/def/123");
  });

  it("should apply single float parameter", () => {
    const url = "/abc/{arg0:float}";

    expect(applyParams(url, { arg0: 0 })).toBe("/abc/0");
    expect(applyParams(url, { arg0: 3 })).toBe("/abc/3");
    expect(applyParams(url, { arg0: 3.01 })).toBe("/abc/3.01");

    expect(applyParams(url, { arg0: -0.123 })).toBe("/abc/-0.123");
    expect(applyParams(url, { arg0: -456.0 })).toBe("/abc/-456");
  });

  it("should apply single bool parameter", () => {
    const url = "/abc/{arg0:bool}";

    expect(applyParams(url, { arg0: true })).toBe("/abc/true");
  });

  it("should apply multiple bool parameters", () => {
    const url = "/abc/{arg0:bool}/def/{arg1:bool}";

    expect(applyParams(url, { arg0: true, arg1: false })).toBe(
      "/abc/true/def/false"
    );
  });
});
