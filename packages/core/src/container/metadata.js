require("reflect-metadata");

const DAGGER = "dagger";
const PROVIDES = `${DAGGER}:provides`;
const SINGLETON = `${DAGGER}:singleton`;
const LAZY = `${DAGGER}:lazy`;
const NAMED = `${DAGGER}:named`;
const DEPS = `${DAGGER}:dependencies`;

const isObject = target =>
  typeof target === "object" ? target !== null : typeof target === "function";

const defineMetadata = (metadataKey, metadataValue, target, propertyKey) =>
  Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);

const getMetadataKeys = (target, propertyKey) =>
  Reflect.getMetadataKeys(target, propertyKey);

const getMetadata = (metadataKey, target, propertyKey) =>
  Reflect.getMetadata(metadataKey, target, propertyKey);

const hasMetadataKeys = (target, propertyKey) =>
  isObject(target) && getMetadataKeys(target, propertyKey).length !== 0;

const hasMetadata = (metadataKey, target, propertyKey) =>
  isObject(target) && Reflect.hasMetadata(metadataKey, target, propertyKey);

const deleteMetadata = (metadataKey, target, propertyKey) =>
  Reflect.deleteMetadata(metadataKey, target, propertyKey);

const isProvides = (target, propertyKey) =>
  getMetadata(PROVIDES, target, propertyKey) === true;

const setProvides = (target, value, propertyKey) => {
  if (value) {
    defineMetadata(PROVIDES, value, target, propertyKey);
  } else {
    deleteMetadata(PROVIDES, target, propertyKey);
  }
};

const isSingleton = (target, propertyKey) =>
  getMetadata(SINGLETON, target, propertyKey) === true;

const setSingleton = (target, value, propertyKey) => {
  if (value) {
    defineMetadata(SINGLETON, true, target, propertyKey);
  } else {
    deleteMetadata(SINGLETON, target, propertyKey);
  }
};

const isLazy = (target, propertyKey) =>
  getMetadata(LAZY, target, propertyKey) === true;

const setLazy = (target, value, propertyKey) => {
  if (value) {
    defineMetadata(LAZY, true, target, propertyKey);
  } else {
    deleteMetadata(LAZY, target, propertyKey);
  }
};

const hasNamed = (target, propertyKey) =>
  hasMetadata(NAMED, target, propertyKey);

const getNamed = (target, propertyKey) =>
  getMetadata(NAMED, target, propertyKey);

const setNamed = (target, value, propertyKey) =>
  defineMetadata(NAMED, value, target, propertyKey);

const hasDependencies = (target, propertyKey) =>
  hasMetadata(DEPS, target, propertyKey);

const getDependencies = (target, propertyKey) =>
  getMetadata(DEPS, target, propertyKey);

const setDependencies = (target, value, propertyKey) =>
  defineMetadata(DEPS, value, target, propertyKey);

module.exports = {
  defineMetadata,
  getMetadataKeys,
  getMetadata,
  hasMetadataKeys,
  hasMetadata,
  deleteMetadata,
  isProvides,
  setProvides,
  isSingleton,
  setSingleton,
  isLazy,
  setLazy,
  hasNamed,
  getNamed,
  setNamed,
  hasDependencies,
  getDependencies,
  setDependencies
};
