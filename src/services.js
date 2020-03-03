export const services = {};

export const assignMetadata = (service, source) => {
  service._dagger = Object.assign(service._dagger || {}, source);
};

export const register = (name, service) => {
  services[name] = service;
};

export const registerLazily = (name, service) => {
  if (typeof service !== "function") {
    throw new Error("Invalid service, expected function to lazy load");
  }
  assignMetadata(service, {
    lazyLoad: true
  });
  register(name, service);
};
