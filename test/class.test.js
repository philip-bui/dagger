/* eslint-disable max-classes-per-file */
import {
  Provides,
  ProvidesNamed,
  Generator,
  GeneratorNamed,
  Named,
  resolve
} from "../src";

describe("Class Decorator", () => {
  describe("provides", () => {
    @Provides
    class Person {
      constructor(name = "Unknown") {
        this.name = name;
      }
    }

    it("with constructor arguments", () => {
      expect(new Person("John").name).toEqual("John");
    });

    it("with class name", () => {
      expect(resolve("Person")).toEqual({ name: "Unknown" });
    });

    describe("named with", () => {
      describe("provided and named", () => {
        @Provides
        @Named("Philip")
        class PhilipPerson extends Person {
          constructor(name = "Philip") {
            super(name);
          }
        }

        it("with constructor arguments", () => {
          expect(new PhilipPerson("philip").name).toEqual("philip");
        });

        it("custom name", () => {
          expect(resolve("Philip")).toEqual({ name: "Philip" });
        });

        it("custom name excluding default class name", () => {
          expect(() => resolve("PhilipPerson")).toThrowError();
        });
      });

      describe("provides named", () => {
        @ProvidesNamed("Terry")
        class TerryPerson extends Person {
          constructor(name = "Terry") {
            super(name);
          }
        }

        it("with constructor arguments", () => {
          expect(new TerryPerson("terry").name).toEqual("terry");
        });

        it("custom name", () => {
          expect(resolve("Terry")).toEqual({ name: "Terry" });
        });

        it("custom name excluding default class name", () => {
          expect(() => resolve("TerryPerson")).toThrowError();
        });
      });
    });
  });
  describe("generates", () => {
    @Generator
    class Counter {
      static count = 0;

      constructor(name = "Unknown") {
        this.name = name;
        Counter.count++;
        this.count = Counter.count;
      }
    }

    it("with constructor arguments", () => {
      const { count } = Counter;
      const instance = new Counter("John");
      expect(instance.name).toEqual("John");
      expect(instance.count).toEqual(count + 1);
    });
    it("with class name", () => {
      const { count } = Counter;
      const instance = resolve("Counter");
      expect(instance.name).toEqual("Unknown");
      expect(instance.count).toEqual(count + 1);
    });

    it("new instances", () => {
      const { count } = Counter;
      let instance = resolve("Counter");
      expect(instance.count).toEqual(count + 1);
      instance = resolve("Counter");
      expect(instance.count).toEqual(count + 2);
    });
    describe("named with", () => {
      describe("provided and named", () => {
        @Generator
        @Named("PhilipCount")
        class PhilipCounter extends Counter {
          constructor(name = "Philip") {
            super(name);
          }
        }

        it("with constructor arguments", () => {
          const { count } = Counter;
          const instance = new PhilipCounter("philip");
          expect(instance.name).toEqual("philip");
          expect(instance.count).toEqual(count + 1);
        });

        it("custom name", () => {
          const { count } = Counter;
          const instance = resolve("PhilipCount");
          expect(instance.name).toEqual("Philip");
          expect(instance.count).toEqual(count + 1);
        });

        it("custom name excluding default class name", () => {
          expect(() => resolve("PhilipCounter")).toThrowError();
        });
      });

      describe("provides named", () => {
        @GeneratorNamed("TerryCount")
        class TerryCounter extends Counter {
          constructor(name = "Terry") {
            super(name);
          }
        }

        it("with constructor arguments", () => {
          const { count } = Counter;
          const instance = new TerryCounter("terry");
          expect(instance.name).toEqual("terry");
          expect(instance.count).toEqual(count + 1);
        });

        it("custom name", () => {
          const { count } = Counter;
          const instance = resolve("TerryCount");
          expect(instance.name).toEqual("Terry");
          expect(instance.count).toEqual(count + 1);
        });

        it("custom name excluding default class name", () => {
          expect(() => resolve("TerryCounter")).toThrowError();
        });
      });
    });
  });
});
