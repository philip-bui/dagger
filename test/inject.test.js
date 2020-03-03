/* eslint-disable max-classes-per-file */
import {
  singleton,
  inject,
  injectPrototype,
  injectStatic,
  register
} from "../src";

describe("inject Decorator", () => {
  describe("injects", () => {
    it("string", () => {
      register("String", "injectionOne");

      @inject("String")
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

      @inject("null")
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

      @inject("Function")
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

      @inject("Number", "Undefined", "Function")
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
      @singleton
      @inject("A")
      class B {
        constructor(a) {
          this.a = a;
        }
      }

      @singleton
      class A {}

      @inject("B", "A")
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
      @inject()
      class NoDependency {}

      expect(new NoDependency()).toBeDefined();
    });
    it("throws on invalid", () => {
      expect(() => {
        @inject
        // eslint-disable-next-line no-unused-vars
        class Invalidinjection {}
      }).toThrowError();
    });

    it("on super constructors", () => {
      @singleton
      class A {}

      @inject("A")
      class B extends A {
        constructor(a) {
          super();
          this.a = a;
        }
      }

      class C extends B {}
      expect(() => new C()).not.toThrowError();
      expect(new C().a).toEqual(new A());
      // TODO: Fix
      // expect(C.dagger).toBeUndefined();
      expect(new C().dagger).toBeUndefined();
    });
  });
  describe("injects prototype", () => {
    it("string", () => {
      register("String", "injectionOne");

      @injectPrototype("String")
      class StringExample {
        constructor(argumentOne) {
          this.argumentOne = argumentOne;
        }
      }

      expect(StringExample.prototype.String).toBeUndefined();
      expect(StringExample.prototype.String).toBeUndefined();
      const instance = new StringExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.String).toEqual("injectionOne");
    });

    it("null", () => {
      register("null", null);

      @injectPrototype("null")
      class NullExample {
        constructor(argumentOne) {
          this.argumentOne = argumentOne;
        }
      }

      expect(NullExample.prototype.null).toBeUndefined();
      const instance = new NullExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.null).toEqual(null);
    });

    it("functions", () => {
      const fn = () => {};
      register("Function", fn);

      @injectPrototype("Function")
      class FunctionExample {
        constructor(argumentOne) {
          this.argumentOne = argumentOne;
        }
      }

      expect(FunctionExample.prototype.Function).toBeUndefined();
      const instance = new FunctionExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.Function).toEqual(fn);
    });

    it("multi-injections", () => {
      register("Number", 0.1);
      register("Undefined", undefined);
      const fn = () => {};
      register("Function", fn);

      @injectPrototype("Number", "Undefined", "Function")
      class FunctionExample {
        constructor(argumentOne) {
          this.argumentOne = argumentOne;
        }
      }

      expect(FunctionExample.prototype.Number).toBeUndefined();
      expect(FunctionExample.prototype.Undefined).toBeUndefined();
      expect(FunctionExample.prototype.Function).toBeUndefined();

      const instance = new FunctionExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.Number).toEqual(0.1);
      expect(instance.Undefined).toBeUndefined();
      expect(instance.Function).toEqual(fn);
    });

    it("nested dependencies", () => {
      @singleton
      @injectPrototype("A")
      class B {}

      @singleton
      class A {}

      @injectPrototype("B", "A")
      class C {}

      expect(C.prototype.C).toBeUndefined();
      expect(C.prototype.Undefined).toBeUndefined();
      expect(C.prototype.Function).toBeUndefined();

      const instance = new C();
      expect(instance.B).toEqual(new B());
      expect(instance.A).toEqual(new A());
      expect(instance.B.A).toEqual(new A());
    });

    it("no dependencies", () => {
      @injectPrototype()
      class NoDependency {}

      expect(new NoDependency()).toBeDefined();
    });
    it("throws on invalid", () => {
      expect(() => {
        @injectPrototype
        // eslint-disable-next-line no-unused-vars
        class Invalidinjection {}
      }).toThrowError();
    });

    it("on super constructors", () => {
      @singleton
      class A {}

      @injectPrototype("A")
      class B extends A {}

      class C extends B {}
      expect(C.prototype.A).toBeUndefined();
      expect(() => new C()).not.toThrowError();
      expect(new C().A).toEqual(new A());
      // TODO: Fix
      // expect(C.dagger).toBeUndefined();
      expect(new C().dagger).toBeUndefined();
    });
  });
  describe("injects static", () => {
    it("string", () => {
      register("String", "injectionOne");

      @injectStatic("String")
      class StringExample {
        constructor(argumentOne) {
          this.argumentOne = argumentOne;
        }
      }

      expect(StringExample.prototype.String).toEqual("injectionOne");
      const instance = new StringExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.String).toEqual("injectionOne");
    });

    it("null", () => {
      register("null", null);

      @injectStatic("null")
      class NullExample {
        constructor(argumentOne) {
          this.argumentOne = argumentOne;
        }
      }

      expect(NullExample.prototype.null).toBeNull();
      const instance = new NullExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.null).toEqual(null);
    });

    it("functions", () => {
      const fn = () => {};
      register("Function", fn);

      @injectStatic("Function")
      class FunctionExample {
        constructor(argumentOne) {
          this.argumentOne = argumentOne;
        }
      }

      expect(FunctionExample.prototype.Function).toEqual(fn);
      const instance = new FunctionExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.Function).toEqual(fn);
    });

    it("multi-injections", () => {
      register("Number", 0.1);
      register("Undefined", undefined);
      const fn = () => {};
      register("Function", fn);

      @injectStatic("Number", "Undefined", "Function")
      class FunctionExample {
        constructor(argumentOne) {
          this.argumentOne = argumentOne;
        }
      }

      expect(FunctionExample.prototype.Number).toEqual(0.1);
      expect(FunctionExample.prototype.Undefined).toBeUndefined();
      expect(FunctionExample.prototype.Function).toEqual(fn);

      const instance = new FunctionExample("argumentOne");
      expect(instance.argumentOne).toEqual("argumentOne");
      expect(instance.Number).toEqual(0.1);
      expect(instance.Undefined).toBeUndefined();
      expect(instance.Function).toEqual(fn);
    });

    it("nested dependencies", () => {
      @singleton
      @injectStatic("A")
      class B {}

      @singleton
      class A {}

      @injectStatic("B", "A")
      class C {}

      expect(C.prototype.A).toEqual(new A());
      expect(C.prototype.B).toEqual(new B());
      expect(C.prototype.B.A).toEqual(new A());

      const instance = new C();
      expect(instance.B).toEqual(new B());
      expect(instance.A).toEqual(new A());
      expect(instance.B.A).toEqual(new A());
    });

    it("no dependencies", () => {
      @injectStatic()
      class NoDependency {}

      expect(new NoDependency()).toBeDefined();
    });
    it("throws on invalid", () => {
      expect(() => {
        @injectStatic
        // eslint-disable-next-line no-unused-vars
        class Invalidinjection {}
      }).toThrowError();
    });

    it("on super constructors", () => {
      @singleton
      class A {}

      @injectStatic("A")
      class B extends A {}

      class C extends B {}
      expect(C.prototype.A).toEqual(new A());
      expect(() => new C()).not.toThrowError();
      expect(new C().A).toEqual(new A());
      // TODO: Fix
      // expect(C.dagger).toBeUndefined();
      expect(new C().dagger).toBeUndefined();
    });
  });
});
