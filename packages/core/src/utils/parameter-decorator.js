const isParameterDecoratorFromArguments = args =>
  args.length === 3 && typeof args[2] === "number";

module.exports = {
  isParameterDecoratorFromArguments
};
