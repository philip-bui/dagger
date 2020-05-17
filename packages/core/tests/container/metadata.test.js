const {
  getMetadataKeys,
  hasMetadataKeys,
  deleteMetadata,
  isProvides,
  setProvides,
  isSingleton,
  setSingleton,
  isLazy,
  setLazy,
  hasNamed,
  getNamed,
  setNamed,
  hasDependencies,
  getDependencies,
  setDependencies
} = require("../../src/container/metadata");

const metadata = [
  ["provides true", isProvides, isProvides, setProvides, true],
  ["provides false", isProvides, isProvides, setProvides, false],
  ["singleton true", isSingleton, isSingleton, setSingleton, true],
  ["singleton false", isSingleton, isSingleton, setSingleton, false],
  ["lazy true", isLazy, isLazy, setLazy, true],
  ["lazy false", isLazy, isLazy, setLazy, false],
  ["getNamed", hasNamed, getNamed, setNamed, "AU REVOIR"],
  ["dependencies", hasDependencies, getDependencies, setDependencies, []]
];

describe("metadata", () => {
  test.each(metadata)("%s", (_, has, get, set, value) => {
    class Class {}
    expect(hasMetadataKeys(Class)).not.toBeTruthy();

    expect(has(Class)).not.toBeTruthy();
    expect(get(Class)).not.toBeTruthy();
    set(Class, value);

    if (value !== false) {
      expect(has(Class)).toBeTruthy();
    }
    expect(get(Class)).toEqual(value);

    getMetadataKeys(Class).forEach(metadataKey =>
      deleteMetadata(metadataKey, Class)
    );
    expect(hasMetadataKeys(Class)).not.toBeTruthy();
  });
});
