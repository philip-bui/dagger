/* eslint-disable max-classes-per-file */
import {
  register,
  registerLazily,
  registerModule,
  resolve,
  inject,
  singleton
} from "../src/index";

import { a, b } from "./module";

describe("Services", () => {
  describe("registers", () => {
    it("string", () => {
      const s = "Superman";
      register("String", s);
      expect(resolve("String")).toEqual(s);
    });

    it("number", () => {
      const n = 2207.1992;
      register("Number", n);
      expect(resolve("Number")).toEqual(n);
    });
    it("function", () => {
      const value = jest.fn();
      register("Function", value);
      expect(value).not.toHaveBeenCalled();
      expect(resolve("Function")).toEqual(value);
      expect(resolve("Function")).toEqual(value);
      expect(value).not.toHaveBeenCalled();
    });
    it("undefined", () => {
      register("Undefined");
      expect(resolve("Undefined")).toBeUndefined();

      register("Undefined", undefined);
      expect(resolve("Undefined")).toBeUndefined();
    });

    it("null", () => {
      register("Null", null);
      expect(resolve("Null")).toBeNull();
    });
  });
  describe("registers lazily", () => {
    it("string", () => {
      const s = "lazy";
      const fn = jest.fn().mockReturnValue(s);
      registerLazily("String", fn);
      expect(fn).not.toHaveBeenCalled();
      expect(resolve("String")).toEqual(s);
      expect(resolve("String")).toEqual(s);
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it("number", () => {
      const n = 2207.1992;
      const fn = jest.fn().mockReturnValue(n);
      registerLazily("Number", fn);
      expect(fn).not.toHaveBeenCalled();
      expect(resolve("Number")).toEqual(n);
      expect(resolve("Number")).toEqual(n);
      expect(fn).toHaveBeenCalledTimes(1);
    });
    it("function", () => {
      const value = jest.fn();
      const fn = jest.fn().mockReturnValue(value);
      registerLazily("Function", fn);
      expect(fn).not.toHaveBeenCalled();
      expect(resolve("Function")).toEqual(value);
      expect(resolve("Function")).toEqual(value);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(value).not.toHaveBeenCalled();
    });

    it("undefined", () => {
      const fn = jest.fn();
      registerLazily("Undefined", fn);
      expect(fn).not.toHaveBeenCalled();
      expect(resolve("Undefined")).toBeUndefined();
      expect(resolve("Undefined")).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(1);

      fn.mockReturnValue();
      registerLazily("Undefined", fn);
      expect(resolve("Undefined")).toBeUndefined();
      expect(resolve("Undefined")).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(2);

      fn.mockReturnValue(undefined);
      registerLazily("Undefined", fn);
      expect(resolve("Undefined")).toBeUndefined();
      expect(resolve("Undefined")).toBeUndefined();
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("null", () => {
      const fn = jest.fn().mockReturnValue(null);
      registerLazily("Null", fn);
      expect(fn).not.toHaveBeenCalled();
      expect(resolve("Null")).toBeNull();
      expect(resolve("Null")).toBeNull();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("class with dependencies", () => {
      @singleton
      class Foo {}

      @inject("Foo")
      class Bar {
        constructor(foo) {
          this.foo = foo;
        }
      }
      const fn = jest.fn().mockReturnValue(Bar);
      registerLazily("Bar", fn);
      expect(fn).not.toHaveBeenCalled();
      expect(resolve("Bar")).toEqual(new Bar());
      expect(resolve("Bar").foo).toEqual(new Foo());
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("throws for unlazy values", () => {
      expect(() =>
        registerLazily("Error", "Not expecting a non-function here")
      ).toThrowError();
    });

    it("throws on duplicate", () => {
      expect(() => resolve("duplicate")).toThrowError();
      register("duplicate", "dupe", false);
      expect(() => register("duplicate", "dupe", false)).toThrowError();
      expect(resolve("duplicate")).toEqual("dupe");
    });
  });
  describe("register module", () => {
    it("functions", () => {
      expect(() => resolve("a")).toThrowError();
      expect(() => resolve("b")).toThrowError();
      // eslint-disable-next-line global-require
      registerModule(require("./module"));
      expect(resolve("a")).toEqual(a);
      expect(resolve("b")).toEqual(b);
    });
  });
});
