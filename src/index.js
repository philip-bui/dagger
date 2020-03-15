const {
  singleton,
  singletonNamed,
  generator,
  generatorNamed
} = require("./class");
const { inject, injectPrototype, injectPrototypeDynamic } = require("./inject");
const { resolve } = require("./resolve");
const { register, registerLazily, registerModule } = require("./services");

module.exports = {
  singleton,
  singletonNamed,
  generator,
  generatorNamed,
  inject,
  injectPrototype,
  injectPrototypeDynamic,
  resolve,
  register,
  registerLazily,
  registerModule
};
