/* eslint-disable max-classes-per-file */
const { clear, inject, register, singleton } = require("@dagger-js/core");

const injections = [
  ["inject", inject],
  ["computed", inject.computed],
  ["lazy", inject.lazy],
  ["optional", inject.optional],
  ["named", inject.named("inject")],
  ["optional named", inject.optional.named("unavailable"), { optional: true }]
];

describe("inject", () => {
  beforeEach(clear);

  describe.each(injections)("%s", (_, decorator, { optional } = {}) => {
    it("works", () => {
      register("inject", "poison");

      class Injection {
        @decorator
        inject = "default";
      }

      const instance = new Injection();
      expect(instance.inject).toEqual(optional ? null : "poison");
    });

    it("works with class typing", () => {
      @singleton
      class HeroService {}

      singleton.named("inject")(HeroService);

      class Injection {
        @decorator
        inject = HeroService;
      }

      const instance = new Injection();
      expect(instance.inject).toEqual(optional ? null : new HeroService());
    });
  });
});
