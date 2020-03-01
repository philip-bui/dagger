import { register } from "./services";

export const ProvidesNamed = name => Class => {
  Class.prototype.ClassProvides = true;
  Class.prototype.Dagger = true;
  register(name, Class);
};

export const Provides = Class => {
  Class.prototype.ClassProvides = true;
  Class.prototype.Dagger = true;
  register(Class.prototype.Named || Class.name, Class);
};

export const GeneratorNamed = name => Class => {
  Class.prototype.ClassGenerator = true;
  Class.prototype.Dagger = true;
  register(name, Class);
};

export const Generator = Class => {
  Class.prototype.ClassGenerator = true;
  Class.prototype.Dagger = true;
  register(Class.prototype.Named || Class.name, Class);
};

export const Named = name => Class => {
  Class.prototype.Named = name;
  Class.prototype.Dagger = true;
};
