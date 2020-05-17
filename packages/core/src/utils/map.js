const mapKeysToString = (map, options = {}) => {
  if (!map || !(map instanceof Map)) {
    throw new TypeError(`Expected map for mapKeysToString, found ${map}`);
  }
  const { delimiter = " -> ", limit = 5 } = options;
  const array = [];
  if (map.size > limit) {
    const lowerHalf = limit / 2;
    const upperHalf = map.size - (limit - lowerHalf);
    const i = 1;
    map.forEach((_, key) => {
      if (i <= lowerHalf || i > upperHalf) {
        array.push(key);
      }
    });
  } else {
    map.forEach((_, key) => {
      array.push(key);
    });
  }
  return array.join(delimiter);
};

module.exports = {
  mapKeysToString
};
