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
  describe("provides", () => {
    class Person {
      constructor(name = "Unknown") {
        this.name = name;
      }
    }
    @singleton
    class Stranger extends Person {}

    it("with constructor arguments", () => {
      expect(new Stranger("John").name).toEqual("John");
    });

    it("with class name", () => {
      expect(resolve("Stranger")).toEqual({ name: "Unknown" });
    });

    describe("named with", () => {
      describe("provided and named", () => {
        @singletonNamed("Philip")
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

        describe("with injection", () => {
          @singletonNamed("PhilipWife")
          @inject("Philip")
          class PhilipPartner extends Person {}

          it("with constructor arguments", () => {
            expect(new PhilipPartner("Philip Wife").name).toEqual(
              "Philip Wife"
            );
          });

          it("custom name", () => {
            expect(resolve("PhilipWife")).toEqual(new PhilipPartner());
            expect(resolve("PhilipWife").name).toEqual(new PhilipPerson());
          });

          it("custom name excluding default class name", () => {
            expect(() => resolve("PhilipPartner")).toThrowError();
          });
        });
      });

      describe("provides named", () => {
        @singletonNamed("Terry")
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

        describe("with injection", () => {
          @singletonNamed("TerryWife")
          @inject("Terry")
          class TerryPartner extends Person {}

          it("with constructor arguments", () => {
            expect(new TerryPartner("Terry Wife").name).toEqual("Terry Wife");
          });

          it("custom name", () => {
            expect(resolve("TerryWife")).toEqual(new TerryPartner());
            expect(resolve("TerryWife").name).toEqual(new TerryPerson());
          });

          it("custom name excluding default class name", () => {
            expect(() => resolve("TerryPartner")).toThrowError();
          });
        });
      });
    });
  });
  describe("generates", () => {
    class Counter {
      static count = 0;

      constructor(name = "Unknown") {
        this.name = name;
        Counter.count++;
        this.count = Counter.count;
      }
    }

    @generator
    class UnknownCounter extends Counter {}

    it("with constructor arguments", () => {
      const { count } = Counter;
      const instance = new UnknownCounter("John");
      expect(instance.name).toEqual("John");
      expect(instance.count).toEqual(count + 1);
    });
    it("with class name", () => {
      const { count } = Counter;
      const instance = resolve("UnknownCounter");
      expect(instance.name).toEqual("Unknown");
      expect(instance.count).toEqual(count + 1);
    });

    it("new instances", () => {
      const { count } = Counter;
      let instance = resolve("UnknownCounter");
      expect(instance.count).toEqual(count + 1);
      instance = resolve("UnknownCounter");
      expect(instance.count).toEqual(count + 2);
    });
    describe("named with", () => {
      describe("provided and named", () => {
        @generatorNamed("PhilipCount")
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
        @generatorNamed("TerryCount")
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
  describe("generates named", () => {
    @generatorNamed("John")
    @inject()
    class Person {
      constructor(name = "Unknown") {
        this.name = name;
      }
    }

    it("with constructor arguments", () => {
      expect(resolve("John")).toEqual(new Person());
    });
  });
});
