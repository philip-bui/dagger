const { isClassDecoratorFromArguments } = require("../utils/class");
const {
  callFunctionWithBound,
  bindFunctionWithBound
} = require("../utils/function");
const {
  isPropertyDecoratorFromArguments
} = require("../utils/property-descriptor");

const validateEndMethod = method => {
  if (typeof method !== "function") {
    throw new TypeError(`Expected function, found ${method}`);
  }
};

const validateChainMethodOptions = chainMethodOptions => {
  if (typeof chainMethodOptions !== "object") {
    throw new TypeError(`Expected object, found ${chainMethodOptions}`);
  }
};

const onChainMethodCreated = (caller, chainMethod, name, chainMethodOption) => {
  chainMethod.selectedOptions = (caller && caller.selectedOptions) || {};
  if (chainMethodOption.default) {
    chainMethod.selectedOptions[name] = chainMethodOption.default;
  }
};

const onChainMethodCall = (
  chainMethod,
  name,
  chainMethodOption,
  chainMethodArguments
) => {
  const { type } = chainMethodOption;
  if (chainMethodArguments.length !== 1) {
    throw new TypeError(
      `${name} expected to be called with ${type}, found ${chainMethodArguments}`
    );
  }
  const [chainArgument] = chainMethodArguments;
  chainMethod.selectedOptions[name] = chainArgument;
};

const createChainMethod = (
  caller,
  endMethod,
  isEndMethodFromArguments,
  name,
  chainMethodOption
) => {
  const chainMethod = (...decoratorOrChainMethodArguments) => {
    if (isEndMethodFromArguments(decoratorOrChainMethodArguments)) {
      // Call decorator function with this binded to selectedOptions.
      return callFunctionWithBound(
        endMethod,
        chainMethod.selectedOptions,
        decoratorOrChainMethodArguments
      );
    }
    onChainMethodCall(
      chainMethod,
      name,
      chainMethodOption,
      decoratorOrChainMethodArguments
    );
    // Create decorator function with this binded to selectedOptions.
    return bindFunctionWithBound(endMethod, chainMethod.selectedOptions);
  };
  onChainMethodCreated(caller, chainMethod, name, chainMethodOption);
  return chainMethod;
};

const setChainMethod = (
  endMethod,
  isEndMethodFromArguments,
  name,
  chainMethodOption,
  prototype
) =>
  Object.defineProperty(prototype, name, {
    get() {
      const chainMethod = createChainMethod(
        this,
        endMethod,
        isEndMethodFromArguments,
        name,
        chainMethodOption
      );
      Object.setPrototypeOf(chainMethod, prototype);
      return chainMethod;
    }
  });

const setChainMethods = (
  endMethod,
  isEndMethodFromArguments,
  chainMethodOptions,
  prototype
) => {
  validateEndMethod(endMethod);
  validateChainMethodOptions(chainMethodOptions);
  Object.entries(chainMethodOptions).forEach(([name, chainMethodOption]) =>
    setChainMethod(
      endMethod,
      isEndMethodFromArguments,
      name,
      chainMethodOption,
      prototype
    )
  );
};

const setPropertyDecoratorChainMethods = (
  propertyDecorator,
  chainMethodOptions = {}
) =>
  setChainMethods(
    propertyDecorator,
    isPropertyDecoratorFromArguments,
    chainMethodOptions,
    propertyDecorator
  );

const setClassDecoratorChainMethods = (
  classDecorator,
  chainMethodOptions = {}
) =>
  setChainMethods(
    classDecorator,
    isClassDecoratorFromArguments,
    chainMethodOptions,
    classDecorator
  );

function returnBound() {
  return this;
}

module.exports = {
  createChainMethod,
  setChainMethod,
  setChainMethods,
  setPropertyDecoratorChainMethods,
  setClassDecoratorChainMethods,
  returnBound
};
