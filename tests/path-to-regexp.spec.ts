import * as pathToRegexp from "path-to-regexp";

import { createRoute } from "../src/core";

const UUID = "85e43f8c-36e8-40f4-890f-fd857cba8a81";

describe("pathToRegexp", () => {
  it("should match params for generated paths", () => {
    const url = "/abc/{arg0:int}/{arg1:bool}";
    const route = createRoute(url);
    const match = pathToRegexp(route);
    const result = match.exec("/abc/123/true");

    expect(result).not.toBeNull();
    expect(result[1]).toBe("123");
    expect(result[2]).toBe("true");
  });

  it("should match bool param", () => {
    const url = "/abc/{arg0:bool}";
    const route = createRoute(url);
    const match = pathToRegexp(route);
    const result = match.exec("/abc/false");

    expect(result).not.toBeNull();
    expect(result[1]).toBe("false");
  });

  it("should match float param", () => {
    const url = "/abc/{arg0:float}";
    const route = createRoute(url);
    const match = pathToRegexp(route);
    const result = match.exec("/abc/45.012");

    expect(result).not.toBeNull();
    expect(result[1]).toBe("45.012");
  });

  it("should match string param", () => {
    const url = "/abc/{arg0:str}";
    const route = createRoute(url);
    const match = pathToRegexp(route);
    const result = match.exec("/abc/def");

    expect(result).not.toBeNull();
    expect(result[1]).toBe("def");
  });

  it("should match uuid param", () => {
    const url = "/abc/{arg0:uuid}";
    const route = createRoute(url);
    const match = pathToRegexp(route);
    const result = match.exec(`/abc/${UUID}`);

    expect(result).not.toBeNull();
    expect(result[1]).toBe(UUID);
  });
});
