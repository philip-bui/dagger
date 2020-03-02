import { register } from "./services";

export const ProvidesNamed = name => Class => {
  Class.dagger = Object.assign(Class.dagger || {}, {
    name,
    provides: true
  });
  register(name, Class);
};

export const Provides = Class => {
  Class.dagger = Object.assign(Class.dagger || {}, {
    provides: true
  });
  register(Class.dagger.name || Class.name, Class);
};

export const GeneratorNamed = name => Class => {
  Class.dagger = Object.assign(Class.dagger || {}, {
    name,
    generator: true
  });
  register(name, Class);
};

export const Generator = Class => {
  Class.dagger = Object.assign(Class.dagger || {}, {
    generator: true
  });
  register(Class.dagger.name || Class.name, Class);
};

export const Named = name => Class => {
  Class.dagger = Object.assign(Class.dagger || {}, {
    name
  });
};
