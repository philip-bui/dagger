const { container } = require("../container/container");
const { resolve } = require("../container/resolve");
const { setChainMethods, returnBound } = require("../helper/chain-method");
const { lazyLoader } = require("../helper/lazy");
const { bindFunctionWithBound } = require("../utils/function");
const { bindChainMethodOptions } = require("./options");

const handleDependenciesToBind = mapDependenciesToBind => {
  if (typeof mapDependenciesToBind === "function") {
    const dependencies = mapDependenciesToBind(container);
    if (typeof dependencies !== "object") {
      throw new TypeError(
        `Expected function to return object for bind.options, found ${mapDependenciesToBind}`
      );
    }
    return dependencies;
  }
  if (mapDependenciesToBind && typeof mapDependenciesToBind !== "object") {
    throw new TypeError(
      `Expected function for object for bind.options, found ${mapDependenciesToBind}`
    );
  }
  return mapDependenciesToBind;
};

const bindDependency = (object, key, option) => {
  if (!option) {
    return object;
  }
  // eslint-disable-next-line no-use-before-define
  const { defaults } = Bind;
  const {
    computed = defaults.computed,
    lazy = defaults.lazy,
    optional = defaults.optional,
    named = key
  } = option;
  const attributes = {
    enumerable: true,
    configurable: true
  };

  const resolver = resolve.bind(this, named, { optional });
  const lazyLoad = lazyLoader.bind(this, object, key, resolver, attributes);
  if (computed) {
    attributes.get = resolver;
  } else if (lazy) {
    attributes.get = lazyLoad;
  } else {
    attributes.value = resolver();
  }
  return Object.defineProperty(object, key, attributes);
};

const resolveDependenciesToBind = dependenciesToBind => {
  if (!dependenciesToBind) {
    return {};
  }
  const dependencies = {};
  Object.entries(dependenciesToBind).forEach(([key, option]) => {
    if (typeof option === "function") {
      option = option();
    }
    bindDependency(dependencies, key, option);
  });
  return dependencies;
};

const Bind = mapDependenciesToBind => targetFn => {
  const dependenciesToBind = handleDependenciesToBind(mapDependenciesToBind);
  const dependencies = resolveDependenciesToBind(dependenciesToBind);
  return bindFunctionWithBound(targetFn, dependencies);
};

Bind.defaults = {
  computed: false,
  lazy: false,
  optional: false
};

setChainMethods(
  returnBound,
  args => args.length === 0,
  bindChainMethodOptions,
  Bind
);

module.exports = {
  Bind,
  bind: Bind
};
