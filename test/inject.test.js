/* eslint-disable max-classes-per-file */
import {
  singleton,
  inject,
  injectPrototype,
  injectPrototypeDynamic,
  register
} from "../src";
import { TestDataTypes } from "./test-data";

describe("inject", () => {
  describe.each([
    ["injects", inject],
    ["injectsPrototype", injectPrototype],
    ["injectsPrototypeDynamic", injectPrototypeDynamic]
  ])("%s", (_, decorator) => {
    it.each(TestDataTypes)("%s", (key, service) => {
      register(key, service);
      @inject(key)
      class Example {
        constructor(argument, injection) {
          this.argument = argument;
          if (injection !== undefined) {
            this[key] = injection;
          }
        }
      }

      const instance = new Example("argument");
      expect(instance.argument).toEqual("argument");
      expect(instance[key]).toEqual(service);
    });

    it("no dependencies", () => {
      @decorator()
      class NoDependency {}

      expect(new NoDependency()).toBeDefined();
    });
    it("throws on invalid", () => {
      expect(() => {
        @decorator
        // eslint-disable-next-line no-unused-vars
        class Invalidinjection {}
      }).toThrowError();
    });
    it("injects multiple", () => {
      register("InjectionOne", undefined);
      const fn = jest.fn();
      register("InjectionTwo", fn);

      @decorator("InjectionOne", "InjectionTwo")
      class Example {
        constructor(argument, InjectionOne, InjectionTwo) {
          this.argument = argument;
          if (InjectionOne || InjectionTwo) {
            this.InjectionOne = InjectionOne;
            this.InjectionTwo = InjectionTwo;
          }
        }
      }

      const instance = new Example("argument");
      expect(instance.argument).toEqual("argument");
      expect(instance.InjectionOne).toBeUndefined();
      expect(instance.InjectionTwo).toEqual(fn);
    });

    it("nested dependencies", () => {
      @singleton
      @decorator("B")
      class A {
        constructor(B) {
          if (B) {
            this.B = B;
          }
        }
      }

      @singleton
      class B {}

      @decorator("A", "B")
      class C {
        // eslint-disable-next-line no-shadow
        constructor(argument, A, B) {
          this.argument = argument;
          if (A && B) {
            this.A = A;
            this.B = B;
          }
        }
      }

      const instance = new C("argument");
      expect(instance.argument).toEqual("argument");
      expect(instance.A).toEqual(new A());
      expect(instance.B).toEqual(new B());
      expect(instance.A.B).toEqual(new B());
    });

    it("injects on super parents", () => {
      @singleton
      class A {}

      @inject("A")
      class B extends A {
        // eslint-disable-next-line no-shadow
        constructor(argument, A) {
          super();
          this.argument = argument;
          if (A) {
            this.A = A;
          }
        }
      }

      class C extends B {}
      const instance = new C("argument");
      expect(instance.argument).toEqual("argument");
      expect(instance.A).toEqual(new A());
    });
  });

  describe("injectsPrototypeDynamic", () => {
    it("dynamic values that auto-update to latest value", () => {
      register("Dynamic", "abc");

      @injectPrototypeDynamic("Dynamic")
      class A {
        constructor(argument) {
          this.argument = argument;
        }
      }

      const instanceOne = new A(1);
      expect(instanceOne.argument).toEqual(1);
      expect(instanceOne.Dynamic).toEqual("abc");

      register("Dynamic", 123);
      expect(instanceOne.argument).toEqual(1);
      expect(instanceOne.Dynamic).toEqual(123);

      const instanceTwo = new A(2);
      expect(instanceTwo.argument).toEqual(2);
      expect(instanceTwo.Dynamic).toEqual(123);
    });
  });
});
