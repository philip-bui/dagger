const lazyLoader = (
  object,
  property,
  resolver,
  descriptor = { writable: false, enumerable: true, configurable: true }
) => {
  const resolved = resolver();
  const { writable, enumerable, configurable } = descriptor;
  Object.defineProperty(object, property, {
    writable,
    enumerable,
    configurable,
    value: resolved
  });
  return resolved;
};

module.exports = {
  lazyLoader
};
