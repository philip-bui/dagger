const { resolve, provides, clear } = require("@dagger-js/core");

const providers = [
  ["provides", provides],
  ["lazy", provides.lazy],
  ["named", provides.named("provides"), "provides"]
];

describe("provides", () => {
  beforeEach(clear);

  test.each(providers)("%s", (_, decorator, key = "Provider") => {
    @decorator
    class Provider {
      static i = 0;

      constructor() {
        Provider.i++;
      }
    }

    expect(resolve(key)).toEqual(new Provider());
    expect(Provider.i).toEqual(2);
    resolve(key);
    expect(Provider.i).toEqual(3);
  });
});
