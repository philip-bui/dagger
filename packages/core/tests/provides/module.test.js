const { registerModule } = require("@dagger-js/core");
const Module = require("test-factory");

describe("module", () => {
  test("registerModule", () => {
    registerModule(Module);
  });
});
