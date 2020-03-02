/* eslint-disable max-classes-per-file */
import {
  Provides,
  Inject,
  InjectPrototype,
  InjectStatic,
  register
} from "../src";

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
      @Inject("A")
      class B {
        constructor(a) {
          this.a = a;
        }
      }

      @Provides
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

    it("on super constructors", () => {
      @Provides
      class A {}

      @Inject("A")
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

      @InjectPrototype("String")
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

      @InjectPrototype("null")
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

      @InjectPrototype("Function")
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

      @InjectPrototype("Number", "Undefined", "Function")
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
      @Provides
      @InjectPrototype("A")
      class B {}

      @Provides
      class A {}

      @InjectPrototype("B", "A")
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
      @InjectPrototype()
      class NoDependency {}

      expect(new NoDependency()).toBeDefined();
    });
    it("throws on invalid", () => {
      expect(() => {
        @InjectPrototype
        // eslint-disable-next-line no-unused-vars
        class InvalidInjection {}
      }).toThrowError();
    });

    it("on super constructors", () => {
      @Provides
      class A {}

      @InjectPrototype("A")
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

      @InjectStatic("String")
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

      @InjectStatic("null")
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

      @InjectStatic("Function")
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

      @InjectStatic("Number", "Undefined", "Function")
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
      @Provides
      @InjectStatic("A")
      class B {}

      @Provides
      class A {}

      @InjectStatic("B", "A")
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
      @InjectStatic()
      class NoDependency {}

      expect(new NoDependency()).toBeDefined();
    });
    it("throws on invalid", () => {
      expect(() => {
        @InjectStatic
        // eslint-disable-next-line no-unused-vars
        class InvalidInjection {}
      }).toThrowError();
    });

    it("on super constructors", () => {
      @Provides
      class A {}

      @InjectStatic("A")
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
