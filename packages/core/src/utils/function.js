const callFunctionWithBound = (func, thisArg, args = []) => {
  if (func.prototype !== undefined) {
    return func.apply(thisArg, args);
  }
  if (args.length < func.length) {
    args[func.length - 1] = thisArg;
    return func.call(null, ...args);
  }
  return func.call(null, ...args, thisArg);
};

const bindFunctionWithBound = (func, thisArg) => {
  if (func.prototype !== undefined) {
    return func.bind(thisArg);
  }
  return (...args) => {
    // If called with (a) for (a,b,c), calls (a,undefined,c);
    if (args.length < func.length) {
      args[func.length - 1] = thisArg;
      return func.call(null, ...args);
    }
    // If called with (a,b) for (...a), calls (a,b,c).
    return func.call(null, ...args, thisArg);
  };
};

module.exports = {
  callFunctionWithBound,
  bindFunctionWithBound
};
