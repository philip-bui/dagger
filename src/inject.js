const { resolve, resolveDependencies } = require("./resolve");
const { assignDaggerProperties } = require("./services");

const validateInjections = names =>
  names.forEach(name => {
    if (typeof name !== "string") {
      throw new Error(`Unexpected dependency ${name}`);
    }
  });

const reduceDependenciesToObject = names =>
  names.reduce((object, name) => {
    object[name] = resolve(name);
    return object;
  }, {});

const assignDependencies = (target, names) =>
  Object.assign(target, reduceDependenciesToObject(names));

const assignDependenciesDynamic = (target, names) => {
  names.forEach(name => {
    Object.defineProperty(target, name, {
      get: () => resolve(name)
    });
  });
};

const copyPropertiesToConstructor = Class =>
  Object.keys(Class).forEach(key => {
    Class.constructor[key] = Class[key];
  });

const inject = (...names) => {
  validateInjections(names);
  return Class => {
    Class.constructor = (...args) =>
      new Class(
        ...args,
        ...resolveDependencies(Class.constructor._dagger.dependencies)
      );
    copyPropertiesToConstructor(Class);
    assignDaggerProperties(Class.constructor, {
      name: Class.name,
      dependencies: names
    });
    return Class.constructor;
  };
};

const injectPrototype = (...names) => {
  validateInjections(names);
  return Class => {
    assignDependencies(Class.prototype, names);
  };
};

const injectPrototypeDynamic = (...names) => {
  validateInjections(names);
  return Class => {
    assignDependenciesDynamic(Class.prototype, names);
  };
};

module.exports = {
  validateInjections,
  reduceDependenciesToObject,
  assignDependencies,
  copyPropertiesToConstructor,
  inject,
  injectPrototype,
  injectPrototypeDynamic
};
