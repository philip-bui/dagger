class Person {
  constructor(name = "Unknown") {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  get personName() {
    return this.name;
  }
}

module.exports.Person = Person;

module.exports.dataTypes = [
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
  ],
  ["class", Person]
];
