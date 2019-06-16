import { extractParamsDefinitions } from "../src/core";

const f = extractParamsDefinitions;

describe("extractParamsDefinitions", () => {
  it("should be a function", () => {
    expect(f).toBeInstanceOf(Function);
  });

  it("should return an empty array for no parameter definitions", () => {
    expect(f("/abc/def")).toEqual([]);
  });

  it("should extract single parameter definition", () => {
    expect(f("/abc/{arg0:int}")).toEqual(["{arg0:int}"]);
  });

  it("should extract multiple parameter definitions", () => {
    expect(f("/abc/{arg0:int}/{arg1:uuid}")).toEqual(["{arg0:int}", "{arg1:uuid}"]);
  });

  it("should not rely on core or user-defined types", () => {
    expect(f("/abc/{arg0:fake-type}/{arg1:another-type}")).toEqual([
      "{arg0:fake-type}",
      "{arg1:another-type}",
    ]);
  });

  it("should work for parameter name in camel case", () => {
    expect(f("/abc/{mySampleArgument:int}")).toEqual(["{mySampleArgument:int}"]);
    expect(f("/abc/{_mySampleArgument:int}")).toEqual(["{_mySampleArgument:int}"]);
    expect(f("/abc/{mySampleArgument123:int}")).toEqual(["{mySampleArgument123:int}"]);
  });

  it("should work for parameter name in pascal case", () => {
    expect(f("/abc/{MySampleArgument:int}")).toEqual(["{MySampleArgument:int}"]);
    expect(f("/abc/{MySampleArgument123:int}")).toEqual(["{MySampleArgument123:int}"]);
  });

  it("should work for parameter name in kebab case", () => {
    expect(f("/abc/{my-sample-argument:int}")).toEqual(["{my-sample-argument:int}"]);
    expect(f("/abc/{my-sample-argument123:int}")).toEqual(["{my-sample-argument123:int}"]);
  });

  it("should work for parameter name in constant case", () => {
    expect(f("/abc/{my-sample-argument:int}")).toEqual(["{my-sample-argument:int}"]);
    expect(f("/abc/{my-sample-argument123:int}")).toEqual(["{my-sample-argument123:int}"]);
  });

  it("should not work for parameter name with spaces", () => {
    expect(f("/abc/{my arg:int}")).toEqual([]);
    expect(f("/abc/{ myarg:int}")).toEqual([]);
    expect(f("/abc/{ myarg :int}")).toEqual([]);
    expect(f("/abc/{myarg :int}")).toEqual([]);
  });
});
