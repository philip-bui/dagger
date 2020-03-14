const { services } = require("./services");

const hasRegistered = name => services.hasOwnProperty(name);

const resolve = name => {
  if (!hasRegistered(name)) {
    throw new Error(`${name} was not provided.`);
  }
  if (!services[name] || !services[name]._dagger) {
    return services[name];
  }
  const { _dagger: dagger } = services[name];
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
    if (services[name] && services[name]._dagger) {
      // Could require injection of dependencies,
      // or generator or provider which needs resolving.
      services[name] = resolve(name);
    }
  }
  return services[name];
};

const resolveDependencies = dependencies =>
  (dependencies || []).map(dependency => resolve(dependency));

  module.exports = {
    hasRegistered,
    resolve,
    resolveDependencies
  };