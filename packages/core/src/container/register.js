const { has, get, set } = require("./container");
const { setLazy } = require("./metadata");
const { isDevelopMode } = require("../config/config");
const { toString } = require("../utils/string");

const register = (key, value, isOverride = isDevelopMode) => {
  if (!isOverride && has(key)) {
    throw new Error(
      `'${key}' already exists ${toString(
        get(key)
      )}, cannot be registered with ${value}.`
    );
  }
  set(key, value);
};

const registerLazyLoader = (key, value, isOverride) => {
  if (typeof value !== "function") {
    throw new TypeError(
      `'${key}' cannot be registered with non-lazy function ${toString(value)}.`
    );
  }
  setLazy(value, true);
  register(key, value, isOverride);
};

module.exports = {
  register,
  registerLazyLoader
};
