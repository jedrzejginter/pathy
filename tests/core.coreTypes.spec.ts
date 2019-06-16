import { coreTypes } from "../src/core";

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
