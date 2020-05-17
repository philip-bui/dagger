const { register, clear, bind } = require("@dagger/core");

const binds = [
  ["computed", bind.computed],
  ["lazy", bind.lazy],
  ["optional", bind.optional],
  ["named", bind.named("bind")],
  ["optional named", bind.optional.named("unavailable"), null]
];

describe("bind", () => {
  beforeEach(clear);

  describe.each(binds)("%s", (_, options, value = "me") => {
    test.each([
      [
        "function",
        function func() {
          return this;
        }
      ],
      ["anonymous function", (_, binded) => binded]
    ])("%s", (_, fn) => {
      register("bind", "me");
      const bounded = bind({
        bind: options
      });
      expect(bounded(fn)().bind).toEqual(value);
    });
  });
});
