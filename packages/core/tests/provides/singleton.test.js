const { resolve, singleton, clear } = require("@dagger/core");

const singletons = [
  ["singleton", singleton],
  ["lazy", singleton.lazy],
  ["named", singleton.named("singleton"), "singleton"]
];

describe("singleton", () => {
  beforeEach(clear);

  test.each(singletons)("%s", (_, decorator, key = "Singleton") => {
    @decorator
    class Singleton {
      static i = 0;

      constructor() {
        Singleton.i++;
      }
    }

    expect(resolve(key)).toEqual(new Singleton());
    expect(Singleton.i).toEqual(2);
    resolve(key);
    expect(Singleton.i).toEqual(2);
  });
});
