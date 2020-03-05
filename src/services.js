export const services = {};

const { NODE_ENV } = process.env;

export const assignMetadata = (service, source) => {
  service._dagger = Object.assign(service._dagger || {}, source);
};

export const register = (name, service, override = NODE_ENV === "test") => {
  if (!override && name in services) {
    throw new Error(`${name} has already been registered`);
  }
  services[name] = service;
};

export function registerModule(module) {
  Object.entries(module).forEach(([key, value]) => {
    register(key, value);
  });
}

export const registerLazily = (name, service) => {
  if (typeof service !== "function") {
    throw new Error("Invalid service, expected function to lazy load");
  }
  assignMetadata(service, {
    lazyLoad: true
  });
  register(name, service);
};
