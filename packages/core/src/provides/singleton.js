const { setClassDecoratorChainMethods } = require("../helper/chain-method");
const { setSingleton } = require("../container/metadata");
const { register, registerLazyLoader } = require("../container/register");
const { singletonOptions } = require("./options");

function Singleton(Class) {
  setSingleton(Class, true);
  const { lazy, named = Class.name } = this || {};
  if (lazy) {
    registerLazyLoader(named, () => Class);
  } else {
    register(named, Class);
  }
}

setClassDecoratorChainMethods(Singleton, singletonOptions);

module.exports = {
  Singleton,
  singleton: Singleton
};
