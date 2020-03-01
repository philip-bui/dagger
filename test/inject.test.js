/* eslint-disable max-classes-per-file */
import { Provides, ProvidesNamed, Named, Inject, register } from "../src";

describe("Inject Decorator", () => {
  describe("injects", () => {
    it("string", () => {
      register("String", "injectionOne");

      @Inject("String")
      class StringExample {
        constructor(argumentOne, injectionOne) {
          this.argumentOne = argumentOne;
          this.injectionOne = injectionOne;
        }
      }

      const instance = new StringExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.injectionOne).toEqual("injectionOne");
    });

    it("null", () => {
      register("null", null);

      @Inject("null")
      class NullExample {
        constructor(argumentOne, injectionOne) {
          this.argumentOne = argumentOne;
          this.injectionOne = injectionOne;
        }
      }

      const instance = new NullExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.injectionOne).toEqual(null);
    });

    it("functions", () => {
      const fn = () => {};
      register("Function", fn);

      @Inject("Function")
      class FunctionExample {
        constructor(argumentOne, injectionOne) {
          this.argumentOne = argumentOne;
          this.injectionOne = injectionOne;
        }
      }

      const instance = new FunctionExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.injectionOne).toEqual(fn);
    });

    it("multi-injections", () => {
      register("Number", 0.1);
      register("Undefined", undefined);
      const fn = () => {};
      register("Function", fn);

      @Inject("Number", "Undefined", "Function")
      class FunctionExample {
        constructor(argumentOne, injectionOne, injectionTwo, injectionThree) {
          this.argumentOne = argumentOne;
          this.injectionOne = injectionOne;
          this.injectionTwo = injectionTwo;
          this.injectionThree = injectionThree;
        }
      }

      const instance = new FunctionExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.injectionOne).toEqual(0.1);
      expect(instance.injectionTwo).toBeUndefined();
      expect(instance.injectionThree).toEqual(fn);
    });

    it("nested dependencies", () => {
      @Provides
      @Named("B")
      @Inject("A")
      class B {
        constructor(a) {
          this.a = a;
        }
      }

      @ProvidesNamed("A")
      class A {}

      @Inject("B", "A")
      class C {
        constructor(b, a) {
          this.b = b;
          this.a = a;
        }
      }

      const instance = new C();
      expect(instance.b).toEqual(new B());
      expect(instance.a).toEqual(new A());
      expect(instance.b.a).toEqual(new A());
    });

    it("no dependencies", () => {
      @Inject()
      class NoDependency {}

      expect(new NoDependency()).toBeDefined();
    });
    it("throws on invalid", () => {
      expect(() => {
        @Inject
        // eslint-disable-next-line no-unused-vars
        class InvalidInjection {}
      }).toThrowError();
    });
  });
});
