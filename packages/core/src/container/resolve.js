const { has, get, set } = require("./container");
const {
  hasMetadataKeys,
  hasDependencies,
  getDependencies,
  isProvides,
  isSingleton,
  isLazy
} = require("./metadata");
const { mapKeysToString } = require("../utils/map");

const checkCycle = (key, map) => {
  if (map.has(key)) {
    throw new Error(
      `'${key}' has cyclic dependency for ${mapKeysToString(map, {
        limit: Number.MAX_VALUE
      })}`
    );
  }
};

const resolveDependency = (dependency, options, map) => {
  if (!dependency) {
    return undefined;
  }
  const { optional = options.optional, named } = dependency;
  // eslint-disable-next-line no-use-before-define
  return resolve(named, { optional }, map);
};

const resolveDependencies = (array = [], options, map) =>
  array.map(dependency => resolveDependency(dependency, options, map));

const resolveClass = (Class, options = {}, map) => {
  if (!hasDependencies(Class)) {
    return new Class();
  }
  return new Class(
    ...getDependencies(Class).map(dependency =>
      resolveDependency(dependency, options, map)
    )
  );
};

const resolveProvides = (key, Class, options, map = new Map()) => {
  checkCycle(key, map);
  map.set(key, null);
  const instance = resolveClass(Class, options, map);
  map.delete(key);
  return instance;
};

const resolveSingleton = (key, Class, options, map = new Map()) => {
  checkCycle(key, map);
  map.set(key, null);
  const instance = resolveClass(Class, options, map);
  set(key, instance);
  map.delete(key);
  return instance;
};

const resolveLazy = (key, lazyFn, options, map = new Map()) => {
  set(key, lazyFn());
  // eslint-disable-next-line no-use-before-define
  return resolve(key, options, map);
};

const resolve = (key, options = {}, map = new Map()) => {
  const { optional } = options;
  if (!has(key)) {
    if (optional) {
      return null;
    }
    throw new ReferenceError(
      `'${key}' could not be resolved for ${mapKeysToString(map)}`
    );
  }
  const value = get(key);
  if (!value || !hasMetadataKeys(value)) {
    return value;
  }

  if (isProvides(value)) {
    return resolveProvides(key, value, options, map);
  }
  if (isSingleton(value) || hasDependencies(value)) {
    return resolveSingleton(key, value, options, map);
  }
  if (isLazy(value)) {
    return resolveLazy(key, value, options, map);
  }
  return value;
};

module.exports = {
  resolve,
  resolveDependency,
  resolveDependencies
};
