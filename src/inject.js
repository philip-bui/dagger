import { resolve, resolveDependencies } from "./resolve";
import { assignMetadata } from "./services";

export const validateInjections = names =>
  names.forEach(name => {
    if (typeof name !== "string") {
      throw new Error(`Unexpected dependency ${name}`);
    }
  });

export const reduceDependenciesToObject = names =>
  names.reduce((object, name) => {
    object[name] = resolve(name);
    return object;
  }, {});

export const assignDependencies = (target, names) =>
  Object.assign(target, reduceDependenciesToObject(names));

export const assignProperties = Class =>
  Object.keys(Class).forEach(key => {
    Class.constructor[key] = Class[key];
  });

export const inject = (...names) => {
  validateInjections(names);
  return Class => {
    Class.constructor = (...args) =>
      new Class(
        ...args,
        ...resolveDependencies(Class.constructor._dagger.dependencies)
      );
    assignProperties(Class);
    assignMetadata(Class.constructor, {
      name: Class.name,
      dependencies: names
    });
    return Class.constructor;
  };
};

export const injectPrototype = (...names) => {
  validateInjections(names);
  return Class => {
    Class.constructor = (...args) => {
      assignDependencies(Class.prototype, names);
      return new Class(...args);
    };
    assignProperties(Class);
    assignMetadata(Class.constructor, {
      name: Class.name
    });
    return Class.constructor;
  };
};

export const injectStatic = (...names) => {
  validateInjections(names);
  return Class => {
    assignDependencies(Class.prototype, names);
  };
};
