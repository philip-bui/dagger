const services = {};

const { NODE_ENV } = process.env;

const assignMetadata = (service, source) => {
  service._dagger = Object.assign(service._dagger || {}, source);
};

const register = (name, service, override = NODE_ENV === "test") => {
  if (!override && name in services) {
    throw new Error(`${name} has already been registered`);
  }
  services[name] = service;
};

const registerModule = (module) => {
  Object.entries(module).forEach(([key, value]) => {
    if (key === "default") {
      return;
    }
    register(key, value);
  });
}

const registerLazily = (name, service) => {
  if (typeof service !== "function") {
    throw new Error("Invalid service, expected function to lazy load");
  }
  assignMetadata(service, {
    lazyLoad: true
  });
  register(name, service);
};

module.exports = {
  assignMetadata,
  register,
  registerModule,
  registerLazily
}