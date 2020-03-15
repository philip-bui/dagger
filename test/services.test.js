/* eslint-disable max-classes-per-file */
import {
  register,
  registerLazily,
  registerModule,
  resolve,
  inject,
  singleton
} from "../src";

import { A, Function, TestDataTypes } from "./test-data";

describe("Services", () => {
  describe("registers", () => {
    it.each(TestDataTypes)("for data type %s", (key, service) => {
      register(key, service);
      expect(resolve(key)).toEqual(service);
    });
  });
  describe("registers lazily", () => {
    it.each(TestDataTypes)("for data type %s", (key, service) => {
      const fn = jest.fn().mockReturnValue(service);
      expect(() => registerLazily(key, fn)).not.toThrowError();
      expect(fn).not.toHaveBeenCalled();
      expect(resolve(key)).toEqual(service);
      expect(resolve(key)).toEqual(service);
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
      expect(() => resolve("A")).toThrowError();
      expect(() => resolve("Function")).toThrowError();
      // eslint-disable-next-line global-require
      registerModule(require("./test-data"));
      expect(resolve("A")).toEqual(A);
      expect(resolve("Function")).toEqual(Function);
    });
  });
});
