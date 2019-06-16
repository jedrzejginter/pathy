import { extractParamsDefinitions } from "../src/core";

describe("extractParamsDefinitions", () => {
  beforeEach(() => {
    this.fn = extractParamsDefinitions;
  });

  it("should be a function", () => {
    expect(this.fn).toBeInstanceOf(Function);
  });

  it("should return an empty array for no parameter definitions", () => {
    expect(this.fn("/abc/def")).toEqual([]);
  });

  it("should extract single parameter definition", () => {
    expect(this.fn("/abc/{arg0:int}")).toEqual(["{arg0:int}"]);
  });

  it("should extract multiple parameter definitions", () => {
    expect(this.fn("/abc/{arg0:int}/{arg1:uuid}")).toEqual(["{arg0:int}", "{arg1:uuid}"]);
  });

  it("should not rely on core or user-defined types", () => {
    expect(this.fn("/abc/{arg0:fake-type}/{arg1:another-type}")).toEqual([
      "{arg0:fake-type}",
      "{arg1:another-type}",
    ]);
  });

  it("should work for parameter name in camel case", () => {
    expect(this.fn("/abc/{mySampleArgument:int}")).toEqual(["{mySampleArgument:int}"]);
    expect(this.fn("/abc/{_mySampleArgument:int}")).toEqual(["{_mySampleArgument:int}"]);
    expect(this.fn("/abc/{mySampleArgument123:int}")).toEqual(["{mySampleArgument123:int}"]);
  });

  it("should work for parameter name in pascal case", () => {
    expect(this.fn("/abc/{MySampleArgument:int}")).toEqual(["{MySampleArgument:int}"]);
    expect(this.fn("/abc/{MySampleArgument123:int}")).toEqual(["{MySampleArgument123:int}"]);
  });

  it("should work for parameter name in kebab case", () => {
    expect(this.fn("/abc/{my-sample-argument:int}")).toEqual(["{my-sample-argument:int}"]);
    expect(this.fn("/abc/{my-sample-argument123:int}")).toEqual(["{my-sample-argument123:int}"]);
  });

  it("should work for parameter name in constant case", () => {
    expect(this.fn("/abc/{my-sample-argument:int}")).toEqual(["{my-sample-argument:int}"]);
    expect(this.fn("/abc/{my-sample-argument123:int}")).toEqual(["{my-sample-argument123:int}"]);
  });

  it("should not work for parameter name with spaces", () => {
    expect(this.fn("/abc/{my arg:int}")).toEqual([]);
    expect(this.fn("/abc/{ myarg:int}")).toEqual([]);
    expect(this.fn("/abc/{ myarg :int}")).toEqual([]);
    expect(this.fn("/abc/{myarg :int}")).toEqual([]);
  });
});
