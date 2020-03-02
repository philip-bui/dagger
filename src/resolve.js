import services from "./services";

export const hasRegistered = name => services.hasOwnProperty(name);

export const resolve = name => {
  if (!hasRegistered(name)) {
    throw new Error(`${name} was not provided.`);
  }
  if (!services[name] || !services[name].dagger) {
    return services[name];
  }
  const { dagger } = services[name];
  // eslint-disable-next-line no-use-before-define
  const injections = resolveDependencies(dagger.dependencies);
  if (dagger.generator) {
    return new services[name](...injections);
  }
  if (dagger.provides || injections.length > 0) {
    services[name] = new services[name](...injections);
  }
  if (dagger.lazyLoad) {
    services[name] = services[name]();
    if (services[name] && services[name].dagger) {
      // Could require injection of dependencies,
      // or generator or provider which needs resolving.
      services[name] = resolve(name);
    }
  }
  return services[name];
};

export const resolveDependencies = dependencies =>
  (dependencies || []).map(dependency => resolve(dependency));
