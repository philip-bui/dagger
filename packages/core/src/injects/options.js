const bindChainMethodOptions = Object.freeze({
  computed: {
    default: true,
    type: "boolean"
  },
  lazy: {
    default: true,
    type: "boolean"
  },
  optional: {
    default: true,
    type: "boolean"
  },
  named: {
    type: "string"
  }
});

const injectChainMethodOptions = Object.freeze({
  ...bindChainMethodOptions
});

const optionalChainMethodOption = Object.freeze({
  default: true,
  type: "boolean"
});

module.exports = {
  bindChainMethodOptions,
  injectChainMethodOptions,
  optionalChainMethodOption
};
