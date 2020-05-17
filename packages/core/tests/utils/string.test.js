const { dataTypes } = require("test-factory");
const { toString } = require("../../src/utils/string");

describe("string", () => {
  test.each(dataTypes)("%s", (_, data) => {
    expect(toString(data)).toBeDefined();
  });
});
