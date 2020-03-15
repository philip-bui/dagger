/* eslint-disable max-classes-per-file */
import {
  singleton,
  singletonNamed,
  generator,
  generatorNamed,
  resolve,
  inject
} from "../src";

describe("Class Decorator", () => {
  class Person {
    constructor(name = "Unknown") {
      this.name = name;
    }
  }

  describe.each([["singleton", singleton], ["generator", generator]])(
    "%s",
    (_, decorator) => {
      @decorator
      class Stranger extends Person {}

      it("works with constructor arguments", () => {
        expect(new Stranger("Philip")).toEqual({ name: "Philip" });
      });

      it("works with class name", () => {
        expect(resolve("Stranger")).toEqual({ name: "Unknown" });
      });
    }
  );

  describe.each([
    ["singletonNamed", singletonNamed],
    ["generatorNamed", generatorNamed]
  ])("%s", (_, decorator) => {
    @decorator("custom")
    class CustomPerson extends Person {}

    // eslint-disable-next-line jest/no-identical-title
    it("works with constructor arguments", () => {
      expect(new CustomPerson("Philip")).toEqual({ name: "Philip" });
    });

    it("works with custom name", () => {
      expect(resolve("custom")).toEqual({ name: "Unknown" });
    });

    it("throws for class name", () => {
      expect(() => resolve("CustomPerson")).toThrowError();
    });
  });

  describe.each([
    ["generator", generator, "GeneratedPerson"],
    ["generatorNamed", generatorNamed("Robot"), "Robot"]
  ])("%s", (_, decorator, key) => {
    it("creates new instance on each injection", () => {
      @decorator
      class GeneratedPerson extends Person {
        static counter = 0;

        constructor(name) {
          super(name);
          GeneratedPerson.counter++;
        }
      }
      for (let i = 0; i < 100; i++) {
        expect(GeneratedPerson.counter).toEqual(i);
        expect(new GeneratedPerson(i)).toEqual({ name: i });
      }

      for (let i = 100; i < 200; i++) {
        expect(GeneratedPerson.counter).toEqual(i);
        expect(resolve(key)).toEqual({ name: "Unknown" });
      }

      @inject(key)
      class Test {
        constructor(argument, injection) {
          this.argument = argument;
          this.injection = injection;
        }
      }
      for (let i = 200; i < 300; i++) {
        expect(GeneratedPerson.counter).toEqual(i);
        expect(new Test("argument", i)).toEqual({
          argument: "argument",
          injection: i
        });
      }
    });
  });
});
