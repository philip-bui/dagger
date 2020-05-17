const {
  container,
  toString,
  has,
  get,
  set,
  delete: deleteKey,
  clear,
  entries,
  forEach,
  keys,
  values,
  iterator
} = require("../../src/container/container");

const v = "v";

describe("container", () => {
  beforeEach(clear);
  afterEach(toString);

  test("toString", () => {
    expect(toString).toBeDefined();
  });

  test("set", () => {
    set("set", v);
  });

  test("get", () => {
    expect(get("get")).not.toBeDefined();
    set("get", v);
    expect(get("get")).toEqual(v);
  });

  test("has", () => {
    expect(has("has")).not.toBeTruthy();
    set("has", v);
    expect(has("has")).toBeTruthy();
  });

  test("delete", () => {
    set("delete", v);
    expect(has("delete")).toBeTruthy();
    deleteKey("delete");
    expect(has("delete")).not.toBeTruthy();
  });

  test("clear", () => {
    set("clear", v);
    expect(has("clear")).toBeTruthy();
    clear();
    expect(has("clear")).not.toBeTruthy();
  });

  test("entries", () => {
    expect(entries()).toHaveLength(0);
    set("entries", v);
    expect(entries()).toHaveLength(1);
  });

  test("forEach", () => {
    const callback = jest.fn();
    forEach(callback);
    expect(callback).not.toHaveBeenCalled();

    set("forEach", v);
    forEach(callback);
    expect(callback).toHaveBeenCalledWith(v, "forEach", container);
  });

  test("keys", () => {
    expect(keys()).toHaveLength(0);

    set("keys", v);
    expect(keys()).toEqual(["keys"]);
  });

  test("values", () => {
    expect(values()).toHaveLength(0);

    set("values", v);
    expect(values()).toEqual([v]);
  });

  test.each([
    ["iterator", iterator],
    ["Symbol.iterator", container[Symbol.iterator]]
  ])("%s", (name, iter) => {
    const fn = jest.fn();
    // eslint-disable-next-line no-restricted-syntax
    for (const next of iter()) {
      fn(next);
    }
    expect(fn).not.toHaveBeenCalled();
    set(name, v);

    // eslint-disable-next-line no-restricted-syntax
    for (const next of iter()) {
      fn(next);
    }

    expect(fn).toHaveBeenCalledWith([name, v]);
  });
});
