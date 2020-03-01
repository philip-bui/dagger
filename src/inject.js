import { resolveDependencies } from "./resolve";

export default function Inject(...names) {
  names.forEach(name => {
    if (typeof name !== "string") {
      throw new Error(`Unexpected dependency ${name}`);
    }
  });
  return Class => {
    const constructor = (...args) =>
      new Class(...args, ...resolveDependencies(constructor.prototype));

    constructor.prototype.Dagger = true;
    constructor.prototype.Dependencies = names;
    return constructor;
  };
}
