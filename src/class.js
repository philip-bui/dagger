import { assignMetadata, register } from "./services";

export const singleton = Class => {
  assignMetadata(Class, { provides: true });
  register(Class._dagger.name || Class.name, Class);
};

export const singletonNamed = name => Class => {
  assignMetadata(Class, { name });
  singleton(Class);
};

export const generator = Class => {
  assignMetadata(Class, { generator: true });
  register(Class._dagger.name || Class.name, Class);
};

export const generatorNamed = name => Class => {
  assignMetadata(Class, { name });
  generator(Class);
};
