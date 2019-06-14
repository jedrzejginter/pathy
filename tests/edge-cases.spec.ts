import { createRoutePath } from "../src/core";

describe("edge cases", () => {
  describe("createRoutePath", () => {
    it("should behave like identity function if passing route as argument", () => {
      const route = "/abc/def/1/2";

      expect(createRoutePath(route)).toBe(route);
    });

    it("should normalize slashes", () => {
      expect(createRoutePath("//abc/def/1/2")).toBe("/abc/def/1/2");
    });
  });
});
