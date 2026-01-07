/** @type {import('jest').Config} */
module.exports = {
  forceExit: true,
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/__tests__/setup.js'],
  testMatch: ['**/__tests__/**/*.spec.[jt]s?(x)'],
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest'],
  },
  collectCoverageFrom: ['src/**/*.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transformIgnorePatterns: [],
  moduleNameMapper: {
    '@antv/s2': '<rootDir>/../s2-core/src',
    // Mock CSS/LESS/SVG imports
    '\\.(css|less)$': '<rootDir>/__tests__/__mocks__/styleMock.js',
    '\\.svg$': '<rootDir>/__tests__/__mocks__/styleMock.js',
  },
};
