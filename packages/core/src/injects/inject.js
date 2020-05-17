const { resolve, resolveDependency } = require("../container/resolve");
const { getDependencies } = require("../container/metadata");
const { setChainMethods } = require("../helper/chain-method");
const { lazyLoader } = require("../helper/lazy");
const {
  isClass,
  isClassDecoratorFromArguments,
  extendFunctionFromClass
} = require("../utils/class");
const {
  isPropertyDescriptor,
  isPropertyDecoratorFromArguments
} = require("../utils/property-descriptor");
const { injectChainMethodOptions } = require("./options");

const injectClass = (Class, options = {}) => {
  function constructor(...args) {
    const dependencies = getDependencies(Class);
    dependencies.forEach((dependency, i) => {
      if (dependency && (args.length <= i || args[i] === undefined)) {
        args[i] = resolveDependency(dependency, options);
      }
    });
    return new Class(...args);
  }
  extendFunctionFromClass(constructor, Class);
  return constructor;
};

const injectPropertyDescriptor = (target, key, descriptor, options = {}) => {
  if (typeof descriptor.initializer === "function") {
    const value = descriptor.initializer();
    if (isClass(value)) {
      key = value.name;
    }
  }
  // eslint-disable-next-line no-use-before-define
  const { defaults } = Inject;
  const {
    computed = defaults.computed,
    lazy = defaults.lazy,
    optional = defaults.optional,
    named = key
  } = options;
  const attributes = {
    enumerable: true,
    configurable: true
  };

  const resolver = resolve.bind(this, named, { optional });
  const lazyLoad = lazyLoader.bind(this, target, key, resolver, attributes);
  if (computed) {
    attributes.get = resolver;
  } else if (lazy) {
    attributes.get = lazyLoad;
  } else {
    attributes.value = resolver();
  }
  return attributes;
};

function Inject(target, key, descriptor) {
  if (target == null) {
    throw new SyntaxError(
      "Injection target is null, did you invoke too many ()'s?"
    );
  }
  if (isPropertyDescriptor(descriptor)) {
    return injectPropertyDescriptor(target, key, descriptor, this);
  }
  return injectClass(target, this);
}

Inject.defaults = {
  computed: false,
  lazy: false,
  optional: false
};

setChainMethods(
  Inject,
  args =>
    isPropertyDecoratorFromArguments(args) ||
    isClassDecoratorFromArguments(args),
  injectChainMethodOptions,
  Inject
);

module.exports = {
  Inject,
  inject: Inject
};
