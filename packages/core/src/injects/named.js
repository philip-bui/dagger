const { getDependencies, setDependencies } = require("../container/metadata");
const { createChainMethod } = require("../helper/chain-method");
const {
  isParameterDecoratorFromArguments
} = require("../utils/parameter-decorator");

const { optionalChainMethodOption } = require("./options");

function namedParameter(target, propertyKey, parameterIndex) {
  const options = this || {};
  const dependencies = getDependencies(target, propertyKey) || [];
  dependencies[parameterIndex] = options;
  setDependencies(target, dependencies, propertyKey);
}

function Named(named) {
  const thisArg = {
    selectedOptions: {
      named
    }
  };
  const chainMethod = namedParameter.bind(thisArg.selectedOptions);
  Object.defineProperty(chainMethod, "optional", {
    get() {
      return createChainMethod(
        thisArg,
        namedParameter,
        isParameterDecoratorFromArguments,
        "optional",
        optionalChainMethodOption
      );
    }
  });
  return chainMethod;
}

module.exports = {
  Named,
  named: Named
};
