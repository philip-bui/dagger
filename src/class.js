const { assignDaggerProperties, register } = require("./services");

const singleton = Class => {
  assignDaggerProperties(Class, { provides: true });
  register(Class._dagger.name || Class.name, Class);
};

const singletonNamed = name => Class => {
  assignDaggerProperties(Class, { name });
  singleton(Class);
};

const generator = Class => {
  assignDaggerProperties(Class, { generator: true });
  register(Class._dagger.name || Class.name, Class);
};

const generatorNamed = name => Class => {
  assignDaggerProperties(Class, { name });
  generator(Class);
};

module.exports = {
  singleton,
  singletonNamed,
  generator,
  generatorNamed
};
