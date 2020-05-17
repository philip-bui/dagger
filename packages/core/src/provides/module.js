const { register } = require("../container/register");

const registerModule = module => {
  if (!module || typeof module !== "object") {
    throw new TypeError(`Expected object, found ${module}`);
  }
  const object = typeof module.exports === "object" ? module.exports : module;
  Object.entries(object).forEach(([key, value]) => register(key, value));
};

module.exports = {
  registerModule
};
