const { assignMetadata, register } = require("./services");

const singleton = Class => {
  assignMetadata(Class, { provides: true });
  register(Class._dagger.name || Class.name, Class);
};

const singletonNamed = name => Class => {
  assignMetadata(Class, { name });
  singleton(Class);
};

const generator = Class => {
  assignMetadata(Class, { generator: true });
  register(Class._dagger.name || Class.name, Class);
};

const generatorNamed = name => Class => {
  assignMetadata(Class, { name });
  generator(Class);
};

module.exports = {
  singleton,
  singletonNamed,
  generator,
  generatorNamed
};
