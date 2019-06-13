const { applyParams, normalizeUrl } = require("../src");

describe("normalizeUrl", () => {
  it("should return input when nothing to do", () => {
    expect(normalizeUrl("/abc/def")).toBe("/abc/def");
  });

  it("should replace multiple slashed with one", () => {
    expect(normalizeUrl("/abc//def")).toBe("/abc/def");
    expect(normalizeUrl("/abc//def//ghi")).toBe("/abc/def/ghi");
  });

  it("should remove trailing slash", () => {
    expect(normalizeUrl("/abc/")).toBe("/abc");
  });

  it("should remove multiple trailing slashes", () => {
    expect(normalizeUrl("/abc/def//")).toBe("/abc/def");
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
});
