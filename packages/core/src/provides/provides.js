const { setClassDecoratorChainMethods } = require("../helper/chain-method");
const { setProvides } = require("../container/metadata");
const { register, registerLazyLoader } = require("../container/register");
const { providesOptions } = require("./options");

function Provides(Class) {
  setProvides(Class, true);
  const { lazy, named = Class.name } = this || {};
  if (lazy) {
    registerLazyLoader(named, () => Class);
  } else {
    register(named, Class);
  }
}

setClassDecoratorChainMethods(Provides, providesOptions);

module.exports = {
  Provides,
  provides: Provides
};
