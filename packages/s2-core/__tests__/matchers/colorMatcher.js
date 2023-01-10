const tinycolor2 = require('tinycolor2');

function toBeColor(actual, hexString) {
  if (typeof actual !== 'object' || typeof hexString !== 'string') {
    throw new Error('Input Params Error!');
  }

  const sameColor = tinycolor2.equals(actual, hexString);

  if (sameColor) {
    return {
      message: () =>
        `expected ${this.utils.printReceived(
          actual,
        )} not to be same color with ${this.utils.printExpected(hexString)}`,
      pass: true,
    };
  }

  return {
    message: () =>
      `expected ${this.utils.printReceived(
        actual,
      )} to be same color with ${this.utils.printExpected(hexString)}`,
    pass: false,
  };
}

expect.extend({
  toBeColor,
});
