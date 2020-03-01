import services from "./services";

export const hasRegistered = name => services.hasOwnProperty(name);

export default function resolve(name) {
  if (!hasRegistered(name)) {
    throw new Error(`${name} was not provided.`);
  }
  if (
    !services[name] ||
    !services[name].prototype ||
    !services[name].prototype.Dagger
  ) {
    return services[name];
  }
  const { prototype } = services[name];
  // eslint-disable-next-line no-use-before-define
  const injections = resolveDependencies(prototype);
  if (prototype.ClassGenerator) {
    return new services[name](...injections);
  }
  if (prototype.ClassProvides || injections.length > 0) {
    services[name] = new services[name](...injections);
  }
  if (prototype.LazyLoaded) {
    services[name] = services[name]();
    if (
      services[name] &&
      services[name].prototype &&
      services[name].prototype.Dagger
    ) {
      // Could require injection of dependencies,
      // or generator or provider which needs resolving.
      services[name] = resolve(name);
    }
  }
  return services[name];
}

export const resolveDependencies = target =>
  (target.Dependencies || []).map(dependency => resolve(dependency));
