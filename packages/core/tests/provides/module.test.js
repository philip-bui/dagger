const { registerModule } = require("@dagger/core");
const Module = require("test-factory");

describe("module", () => {
  test("registerModule", () => {
    registerModule(Module);
  });
});
