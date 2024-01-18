const path = require('path');

module.exports = {
  extends: 'semantic-release-monorepo',
  branches: [
    'latest',
    { name: 'beta', channel: 'beta', prerelease: true },
    { name: 'alpha', channel: 'alpha', prerelease: true },
    { name: 'next', channel: 'next', prerelease: true },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'style', release: 'patch' },
          { scope: 'no-release', release: false },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    [
      '@semantic-release/git',
    {
        message: 'chore(release): 🤖 ${nextRelease.gitTag} [skip ci]',
    },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/exec',
      {
        prepareCmd:
          `node ${path.resolve(__dirname, './scripts/add-version.js')} ` +
          '${nextRelease.gitTag}',
      },
    ],
  ],
  preset: 'angular',
};
