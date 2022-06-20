'use strict';

const getText = (values, maxLength) => {
  return values.reduce((acc, value) => {
    const concatValues = `${acc} ${value}`;
    if (concatValues.length <= maxLength) {
      return concatValues;
    }

    return acc;
  }, ``);
};

module.exports = getText;
