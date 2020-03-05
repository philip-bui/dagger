import { singleton, singletonNamed, generator, generatorNamed } from "./class";
import { inject, injectPrototype, injectStatic } from "./inject";
import { resolve } from "./resolve";
import { register, registerLazily, registerModule } from "./services";

export {
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
