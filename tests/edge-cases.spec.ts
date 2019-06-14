import { createRoute } from "../src/core";

describe("edge cases", () => {
  describe("createRoute", () => {
    it("should behave like identity function if passing route as argument", () => {
      const route = "/abc/def/1/2";

      expect(createRoute(route)).toBe(route);
    });

    it("should normalize slashes", () => {
      expect(createRoute("//abc/def/1/2")).toBe("/abc/def/1/2");
    });
  });
});
