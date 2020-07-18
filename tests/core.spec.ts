import {
  coreTypes,
  createParamDefinitionRegExp,
  extractParamsDefinitions,
  extractRegExpForParamType,
  extractValuesOfUrlParams,
  getParamDefinitionStruct,
  normalizePath,
  replaceParamTypeWithRegExp,
  validatePath,
} from "../src/core";

describe("coreTypes", () => {
  it("should be an object", () => {
    expect(coreTypes).toBeInstanceOf(Object);
  });

  it("should have all common types pre-defined", () => {
    expect(coreTypes).toHaveProperty("bool");
    expect(coreTypes).toHaveProperty("float");
    expect(coreTypes).toHaveProperty("int");
    expect(coreTypes).toHaveProperty("str");
    expect(coreTypes).toHaveProperty("uint");
    expect(coreTypes).toHaveProperty("uuid");
  });
});

describe("createParamDefinitionRegExp", () => {
  it("should be a function", () => {
    expect(createParamDefinitionRegExp).toBeInstanceOf(Function);
  });

  it("should return instance of RegExp", () => {
    expect(createParamDefinitionRegExp("int")).toBeInstanceOf(RegExp);
  });

  it("should set global flag", () => {
    expect(createParamDefinitionRegExp("int").flags).toBe("g");
  });

  it("should create correct regexp", () => {
    expect(createParamDefinitionRegExp("int")).toEqual(/\{([a-zA-Z\d_-]+):int\}/g);
  });
});

describe("extractParamsDefinitions", () => {
  it("should be a function", () => {
    expect(extractParamsDefinitions).toBeInstanceOf(Function);
  });

  it("should return an empty array for no parameter definitions", () => {
    expect(extractParamsDefinitions("/abc/def")).toEqual([]);
  });

  it("should extract single parameter definition", () => {
    expect(extractParamsDefinitions("/abc/{arg0:int}")).toEqual(["{arg0:int}"]);
  });

  it("should extract multiple parameter definitions", () => {
    expect(extractParamsDefinitions("/abc/{arg0:int}/{arg1:uuid}")).toEqual([
      "{arg0:int}",
      "{arg1:uuid}",
    ]);
  });

  it("should not rely on core or user-defined types", () => {
    expect(extractParamsDefinitions("/abc/{arg0:fake-type}/{arg1:another-type}")).toEqual([
      "{arg0:fake-type}",
      "{arg1:another-type}",
    ]);
  });

  it("should work for parameter name in camel case", () => {
    expect(extractParamsDefinitions("/abc/{mySampleArgument:int}")).toEqual([
      "{mySampleArgument:int}",
    ]);
    expect(extractParamsDefinitions("/abc/{_mySampleArgument:int}")).toEqual([
      "{_mySampleArgument:int}",
    ]);
    expect(extractParamsDefinitions("/abc/{mySampleArgument123:int}")).toEqual([
      "{mySampleArgument123:int}",
    ]);
  });

  it("should work for parameter name in pascal case", () => {
    expect(extractParamsDefinitions("/abc/{MySampleArgument:int}")).toEqual([
      "{MySampleArgument:int}",
    ]);
    expect(extractParamsDefinitions("/abc/{MySampleArgument123:int}")).toEqual([
      "{MySampleArgument123:int}",
    ]);
  });

  it("should work for parameter name in kebab case", () => {
    expect(extractParamsDefinitions("/abc/{my-sample-argument:int}")).toEqual([
      "{my-sample-argument:int}",
    ]);
    expect(extractParamsDefinitions("/abc/{my-sample-argument123:int}")).toEqual([
      "{my-sample-argument123:int}",
    ]);
  });

  it("should work for parameter name in constant case", () => {
    expect(extractParamsDefinitions("/abc/{my-sample-argument:int}")).toEqual([
      "{my-sample-argument:int}",
    ]);
    expect(extractParamsDefinitions("/abc/{my-sample-argument123:int}")).toEqual([
      "{my-sample-argument123:int}",
    ]);
  });

  it("should not work for parameter name with spaces", () => {
    expect(extractParamsDefinitions("/abc/{my arg:int}")).toEqual([]);
    expect(extractParamsDefinitions("/abc/{ myarg:int}")).toEqual([]);
    expect(extractParamsDefinitions("/abc/{ myarg :int}")).toEqual([]);
    expect(extractParamsDefinitions("/abc/{myarg :int}")).toEqual([]);
  });
});

describe("extractRegExpForParamType", () => {
  it("should be a function", () => {
    expect(extractRegExpForParamType).toBeInstanceOf(Function);
  });

  it("should return RegExp if RegExp is passed", () => {
    expect(extractRegExpForParamType(new RegExp("^$"))).toBeInstanceOf(RegExp);
  });

  it("should return RegExp if { regex: RegExp } is passed", () => {
    expect(extractRegExpForParamType({ regex: new RegExp("^$") })).toBeInstanceOf(RegExp);
  });

  it("should return RegExp without modification", () => {
    const regExp = new RegExp("^$");

    expect(extractRegExpForParamType(regExp)).toBe(regExp);
    expect(extractRegExpForParamType({ regex: regExp })).toBe(regExp);
  });
});

describe("extractValuesOfUrlParams", () => {
  it("should be a function", () => {
    expect(extractValuesOfUrlParams).toBeInstanceOf(Function);
  });

  it("should return an empty array when no params to match", () => {
    expect(extractValuesOfUrlParams("/abc/def", "/abc/def")).toEqual([]);
  });

  it("should return an empty array when no params matched", () => {
    expect(extractValuesOfUrlParams("/abc/def/123", "/abc/def")).toEqual([]);
  });

  it("should match a single param", () => {
    expect(extractValuesOfUrlParams("/abc/def/123", "/abc/def/(\\d+)")).toEqual(["123"]);
  });

  it("should match multiple params", () => {
    expect(
      extractValuesOfUrlParams(
        "/abc/def/123/true/x/12.0",
        "/abc/def/(\\d+)/(true|false)/x/(\\d+\\.\\d+)",
      ),
    ).toEqual(["123", "true", "12.0"]);
  });

  it("should fail if at least one param cannot be matched", () => {
    expect(extractValuesOfUrlParams("/abc/def/123.0/true", "/abc/def/(\\d+)/(true|false)")).toEqual(
      [],
    );
  });

  it("should match params if url contains", () => {
    expect(
      extractValuesOfUrlParams("/abc/def/1/true/something", "/abc/def/(\\d+)/(true|false)"),
    ).toEqual(["1", "true"]);
    expect(
      extractValuesOfUrlParams("/abc/def/1/trueorfalse/something", "/abc/def/(\\d+)/(true)"),
    ).toEqual(["1", "true"]);
  });
});

describe("getParamDefinitionStruct", () => {
  it("should be a function", () => {
    expect(getParamDefinitionStruct).toBeInstanceOf(Function);
  });

  it("should extract struct for correct param definition", () => {
    expect(getParamDefinitionStruct("{myParam:myType}")).toMatchObject({
      name: "myParam",
      type: "myType",
    });
  });

  it("should throw an error for incorrect param definition", () => {
    expect(() => getParamDefinitionStruct("brokenParamDef:myType")).toThrow();
    expect(() => getParamDefinitionStruct("brokenParamDef:myType}")).toThrow();
  });
});

describe("normalizePath", () => {
  it("should be a function", () => {
    expect(normalizePath).toBeInstanceOf(Function);
  });

  it("should be an identity function for already normalized paths", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("/abc")).toBe("/abc");
  });

  it("should keep single trailing slash", () => {
    expect(normalizePath("/abc/")).toBe("/abc/");
    expect(normalizePath("/abc/def/")).toBe("/abc/def/");
  });

  it("should replace multiple trailing slashes with single one", () => {
    expect(normalizePath("/abc//")).toBe("/abc/");
    expect(normalizePath("/abc///")).toBe("/abc/");
    expect(normalizePath("/abc/def//")).toBe("/abc/def/");
    expect(normalizePath("/abc/def///")).toBe("/abc/def/");
  });

  it("should remove single trailing space", () => {
    expect(normalizePath("/abc ")).toBe("/abc");
    expect(normalizePath("/abc/def ")).toBe("/abc/def");
  });

  it("should remove multiple trailing spaces", () => {
    expect(normalizePath("/abc   ")).toBe("/abc");
    expect(normalizePath("/abc/def   ")).toBe("/abc/def");
  });

  it("should remove single leading space", () => {
    expect(normalizePath(" /abc")).toBe("/abc");
    expect(normalizePath(" /abc/def")).toBe("/abc/def");
  });

  it("should remove multiple leading spaces", () => {
    expect(normalizePath("   /abc")).toBe("/abc");
    expect(normalizePath("   /abc/def")).toBe("/abc/def");
  });

  it("should replace multiple leading slashed when leading spaces", () => {
    expect(normalizePath(" ///abc")).toBe("/abc");
  });

  it("should not replace double slash for protocols", () => {
    expect(normalizePath("ws://abc.com")).toBe("ws://abc.com");
    expect(normalizePath("http://abc.com")).toBe("http://abc.com");
    expect(normalizePath("file://abc.com")).toBe("file://abc.com");
    expect(normalizePath("https://abc.com")).toBe("https://abc.com");
  });

  it("should leave double slash for protocols if there are following slashes", () => {
    expect(normalizePath("http:///abc.com")).toBe("http://abc.com");
    expect(normalizePath("http:////abc.com")).toBe("http://abc.com");
  });

  it("should work for combination of incorrect paths", () => {
    expect(normalizePath("/abc//def")).toBe("/abc/def");
    expect(normalizePath(" /abc//def//")).toBe("/abc/def/");
    expect(normalizePath(" http:///abc.com")).toBe("http://abc.com");
  });

  it("should keep parameter definitions", () => {
    expect(normalizePath("/abc/{arg0:int}/")).toBe("/abc/{arg0:int}/");
    expect(normalizePath("//abc/{arg0:int}/{arg1:str}")).toBe("/abc/{arg0:int}/{arg1:str}");
  });
});

describe("replaceParamTypeWithRegExp", () => {
  it("should be a function", () => {
    expect(replaceParamTypeWithRegExp).toBeInstanceOf(Function);
  });

  it("should replace param definition with regex and keep the name", () => {
    expect(replaceParamTypeWithRegExp("/abc/{arg0:int}", /\{(.+):int\}/, /(\d+)/)).toBe(
      "/abc/:arg0(\\d+)",
    );
  });

  it("should replace param definition with regex and omit the name", () => {
    expect(replaceParamTypeWithRegExp("/abc/{arg0:int}", /\{(.+):int\}/, /(\d+)/, false)).toBe(
      "/abc/(\\d+)",
    );
  });
});

describe("validatePath", () => {
  it("should be a function", () => {
    expect(validatePath).toBeInstanceOf(Function);
  });

  it("should not throw for no params specified", () => {
    expect(() => validatePath("/abc/def", {})).not.toThrow();
  });

  it("should not throw for single valid param specified", () => {
    expect(() => validatePath("/abc/def/{arg0:int}", { int: /^$/ })).not.toThrow();
  });

  it("should not throw for multiple valid params specified", () => {
    expect(() =>
      validatePath("/abc/def/{arg0:int}/{arg1:str}", { int: /^$/, str: /^$/ }),
    ).not.toThrow();
  });

  it("should throw for param with unknown type specified", () => {
    expect(() =>
      validatePath("/abc/def/{arg0:unknownType}/{arg1:str}", { int: /^$/, str: /^$/ }),
    ).toThrowError(
      "Unknown type 'unknownType'. Either a typo, or you forgot to add a custom type.",
    );
  });
});
