const services = {};

export const register = (name, service) => {
  services[name] = service;
};

export const registerLazily = (name, service) => {
  if (typeof service !== "function") {
    throw new Error("Invalid service, expected function to lazy load");
  }
  service.prototype.Dagger = true;
  service.prototype.LazyLoaded = true;
  register(name, service);
};

export default services;
