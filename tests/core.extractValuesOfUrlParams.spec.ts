import { extractValuesOfUrlParams } from "../src/core";

const f = extractValuesOfUrlParams;

describe("extractValuesOfUrlParams", () => {
  it("should be a function", () => {
    expect(f).toBeInstanceOf(Function);
  });

  it("should return an empty array when no params to match", () => {
    expect(f("/abc/def", "/abc/def")).toEqual([]);
  });

  it("should return an empty array when no params matched", () => {
    expect(f("/abc/def/123", "/abc/def")).toEqual([]);
  });

  it("should match a single param", () => {
    expect(f("/abc/def/123", "/abc/def/(\\d+)")).toEqual(["123"]);
  });

  it("should match multiple params", () => {
    expect(f("/abc/def/123/true/x/12.0", "/abc/def/(\\d+)/(true|false)/x/(\\d+\\.\\d+)")).toEqual([
      "123",
      "true",
      "12.0",
    ]);
  });

  it("should fail if at least one param cannot be matched", () => {
    expect(f("/abc/def/123.0/true", "/abc/def/(\\d+)/(true|false)")).toEqual([]);
  });

  it("should match params if url contains", () => {
    expect(f("/abc/def/1/true/something", "/abc/def/(\\d+)/(true|false)")).toEqual(["1", "true"]);
    expect(f("/abc/def/1/trueorfalse/something", "/abc/def/(\\d+)/(true)")).toEqual(["1", "true"]);
  });
});
