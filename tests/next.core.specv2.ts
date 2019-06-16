import { extractPathParamsAnnotations as fn } from "../src/core";

describe("extractPathParamsAnnotations", () => {
  it("should return an empty array for no parameter definitions", () => {
    expect(fn("/abc/def")).toEqual([]);
  });

  it("should extract single parameter definition", () => {
    expect(fn("/abc/{arg0:int}")).toEqual(["{arg0:int}"]);
  });

  it("should extract multiple parameter definitions", () => {
    expect(fn("/abc/{arg0:int}/{arg1:uuid}")).toEqual(["{arg0:int}", "{arg1:uuid}"]);
  });
});
