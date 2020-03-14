const { resolve, resolveDependencies } = require("./resolve");
const { assignMetadata } = require("./services");

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

const assignProperties = Class =>
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
    assignProperties(Class);
    assignMetadata(Class.constructor, {
      name: Class.name,
      dependencies: names
    });
    return Class.constructor;
  };
};

const injectPrototype = (...names) => {
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

const injectStatic = (...names) => {
  validateInjections(names);
  return Class => {
    assignDependencies(Class.prototype, names);
  };
};

module.exports = {
  validateInjections,
  reduceDependenciesToObject,
  assignDependencies,
  assignProperties,
  inject,
  injectPrototype,
  injectStatic
}