const isClass = Class => {
  const ret = typeof Class === "function" && /^[A-Z]/.test(Class.name);
  return ret;
};

const isClassDecoratorFromArguments = args =>
  args.length === 1 && isClass(args[args.length - 1]);

const extendFunctionFromClass = (targetFn, Class) => {
  Object.setPrototypeOf(targetFn, Class);
  Object.entries(Object.getOwnPropertyDescriptors(Class)).forEach(
    ([key, value]) => {
      if (key === "prototype") {
        return;
      }
      const { configurable } = value;
      if (!configurable) {
        return;
      }
      Object.defineProperty(targetFn, key, value);
    }
  );
};

module.exports = {
  isClass,
  isClassDecoratorFromArguments,
  extendFunctionFromClass
};
