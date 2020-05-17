const providesOptions = Object.freeze({
  lazy: {
    default: true,
    type: "boolean"
  },
  named: {
    type: "string"
  }
});

const singletonOptions = Object.freeze({
  ...providesOptions
});

module.exports = {
  providesOptions,
  singletonOptions
};
