/* eslint-disable max-classes-per-file */
module.exports.default = () => {};

module.exports.A = class A {};

module.exports.B = class B {};

module.exports.Function = () => {};

module.exports.TestDataTypes = [
  ["string", "Superman"],
  ["number", 2207.1992],
  ["undefined", undefined],
  ["null", null],
  ["object", {}],
  ["array", []],
  [
    "function",
    () => {
      throw new Error("Should not be called");
    }
  ]
];
