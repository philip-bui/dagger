const { singleton, singletonNamed, generator, generatorNamed } = require("./class");
const { inject, injectPrototype, injectStatic } = require("./inject");
const { resolve } = require("./resolve");
const { register, registerLazily, registerModule } = require("./services");

module.exports = {
  singleton,
  singletonNamed,
  generator,
  generatorNamed,
  inject,
  injectPrototype,
  injectStatic,
  resolve,
  register,
  registerLazily,
  registerModule
};
