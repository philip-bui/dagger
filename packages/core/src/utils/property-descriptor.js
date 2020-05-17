const isPropertyDescriptor = descriptor => {
  if (!descriptor || !descriptor.hasOwnProperty) {
    return false;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
  const keys = [
    "configurable",
    "enumerable",
    "writable",
    "initializer",
    "get",
    "set",
    "value"
  ];

  for (let i = 0, l = keys.length; i < l; i++) {
    if (descriptor.hasOwnProperty(keys[i])) {
      return true;
    }
  }

  return false;
};

const isPropertyDecoratorFromArguments = args =>
  args.length === 3 && isPropertyDescriptor(args[2]);

const deletePropertyDescriptor = (target, key, descriptor) => {
  if (descriptor.value) {
    // Typescript
    delete target[key];
  } else if (descriptor.initializer) {
    // Babel
    descriptor.initializer = () => {
      delete target[key];
      return null;
    };
  }
};

module.exports = {
  isPropertyDescriptor,
  isPropertyDecoratorFromArguments,
  deletePropertyDescriptor
};
