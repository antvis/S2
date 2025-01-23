const path = require('path');

module.exports = {
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  setupFilesAfterEnv: ['jest-extended', './__tests__/setup.js'],
  clearMocks: true,
  collectCoverage: false,
  verbose: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,vue}',
    '!**/node_modules/**',
    '!**/interface/**',
    '!**/interface.ts',
    '!**/i18n/**',
    '!**/icons/**',
    '!**/constant/**',
    '!**/constant.ts',
    '!**/index.{ts,tsx,js,vue}',
    '!**/icons.{ts,tsx,js,vue}',
  ],
  coveragePathIgnorePatterns: [
    'facet/mobile',
    'hd-adapter/index.ts',
    'packages/s2-vue',
  ],
  testPathIgnorePatterns: ['benchmark'],
  coverageReporters: ['text', 'clover', 'html'],
  transformIgnorePatterns: [],
  testRegex: '/__tests__/*.*(-|\\.)spec\\.(tsx|ts|js|vue)?$',
  transform: {
    '\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            // https://swc.rs/docs/configuration/compilation#jsctransformusedefineforclassfields
            useDefineForClassFields: false,
          },
        },
      },
    ],
    '\\.vue$': 'vue-jest',
    '\\.(less|css)$': 'jest-less-loader',
    '\\.svg$': 'jest-raw-loader',
  },
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__tests__/__mocks__/svg.ts',
    '^@/(.*)': '<rootDir>/src/$1',
    '^tests/(.*)': '<rootDir>/__tests__/$1',
    '^@antv/s2$': path.join(__dirname, 'packages/s2-core/src'),
    '^@antv/s2/esm/(.*)$': path.join(__dirname, 'packages/s2-core/src/$1'),
    '^@antv/s2/extends$': path.join(__dirname, 'packages/s2-core/src/extends'),
    '^@antv/s2-react$': path.join(__dirname, 'packages/s2-react/src'),
    '^@antv/s2-react-components$': path.join(
      __dirname,
      'packages/s2-react-components/src',
    ),
    /* ignore module query: foo.less?a=1 -> foo.less */
    '(.+)\\.(.+)\\?(.*)$': '$1.$2',
  },
  testTimeout: 100000,
};
