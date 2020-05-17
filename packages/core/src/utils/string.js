const toString = target => {
  if (target === null) {
    return "null";
  }
  if (target === undefined) {
    return "undefined";
  }
  switch (typeof target) {
    case "object":
      if (Array.isArray(target)) {
        return `[array Array[${target.length}]]`;
      }
      return `[object Object]`;
    case "function":
      return `[function ${target.name}]`;
    default:
      return target;
  }
};

module.exports = {
  toString
};
