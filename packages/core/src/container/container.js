const { hasMetadataKeys, getMetadataKeys } = require("./metadata");

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
class Container {
  constructor() {
    this.iterator = this.iterator.bind(this);
    this[Symbol.iterator] = this.iterator;
  }

  toString = () =>
    this.entries().reduce(
      (object, [key, value]) =>
        Object.assign(object, {
          [key]: hasMetadataKeys(value) ? getMetadataKeys(value) : value
        }),
      {}
    );

  has = key => key in this.dependencies;

  get = key => this.dependencies[key];

  set = (key, value) => {
    this.dependencies[key] = value;
  };

  delete = key => delete this.dependencies[key];

  clear = () => Object.keys(this.dependencies).forEach(key => this.delete(key));

  // NOTE: Should we use a Map so we can typecheck and get Class, or
  // stick with object to create a useDependencies function(object with getters).
  dependencies = Object.create(null);

  entries = () => Object.entries(this.dependencies);

  forEach = callbackFn =>
    this.entries().forEach(([key, value]) => callbackFn(value, key, this));

  keys = () => Object.keys(this.dependencies);

  values = () => Object.values(this.dependencies);

  *iterator() {
    const entries = this.entries();
    // eslint-disable-next-line no-restricted-syntax
    for (const item of entries) {
      yield item;
    }
  }
}

const container = new Container();

module.exports = {
  container,
  ...container
};
