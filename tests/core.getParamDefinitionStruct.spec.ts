import { getParamDefinitionStruct } from "../src/core";

const f = getParamDefinitionStruct;

describe("getParamDefinitionStruct", () => {
  it("should be a function", () => {
    expect(f).toBeInstanceOf(Function);
  });

  it("should extract struct for correct param definition", () => {
    expect(f("{myParam:myType}")).toMatchObject({ name: "myParam", type: "myType" });
  });

  it("should throw an error for incorrect param definition", () => {
    expect(() => f("brokenParamDef:myType")).toThrow();
    expect(() => f("brokenParamDef:myType}")).toThrow();
  });
});
