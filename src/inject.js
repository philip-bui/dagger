import { resolve, resolveDependencies } from "./resolve";

export const validateInjections = names =>
  names.forEach(name => {
    if (typeof name !== "string") {
      throw new Error(`Unexpected dependency ${name}`);
    }
  });

export const Inject = (...names) => {
  validateInjections(names);
  return Class => {
    Class.prototype.constructor = (...args) =>
      new Class(
        ...args,
        ...resolveDependencies(Class.prototype.constructor.dagger.dependencies)
      );
    Class.prototype.constructor.dagger = {
      name: Class.name,
      dependencies: names
    };
    return Class.prototype.constructor;
  };
};

export const reduceDependenciesToObject = names =>
  names.reduce((object, name) => {
    object[name] = resolve(name);
    return object;
  }, {});

export const assignDependencies = (target, names) =>
  Object.assign(target, reduceDependenciesToObject(names));

export const InjectPrototype = (...names) => {
  validateInjections(names);
  return Class => {
    Class.prototype.constructor = (...args) => {
      assignDependencies(Class.prototype, names);
      return new Class(...args);
    };
    Class.prototype.constructor.dagger = {
      name: Class.name
    };
    return Class.prototype.constructor;
  };
};

export const InjectStatic = (...names) => {
  validateInjections(names);
  return Class => {
    assignDependencies(Class.prototype, names);
  };
};
