const { register, inject, named, clear } = require("@dagger/core");

const names = [
  ["named", named("name")],
  ["optional", named("name").optional],
  ["named optional", named("unavailable").optional, null]
];

describe("named", () => {
  beforeEach(clear);

  describe.each(names)("%s", (s, decorator, value = "antonym") => {
    it("works", () => {
      register("name", "antonym");

      @inject
      class Injection {
        constructor(a, @decorator b, c, @decorator d) {
          this.a = a;
          this.b = b;
          this.c = c;
          this.d = d;
        }
      }

      const instance = new Injection(null);
      expect(instance.a).toEqual(null);
      expect(instance.b).toEqual(value);
      expect(instance.c).not.toBeDefined();
      expect(instance.d).toEqual(value);
    });
  });
});
