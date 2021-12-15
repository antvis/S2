module.exports = {
  branches: [
    'latest',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
    { name: 'next', prerelease: true },
  ],
  extends: 'semantic-release-monorepo',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/git',
      {
        message: 'chore(release): 🤖 ${nextRelease.gitTag} [skip ci]',
      },
    ],
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
  preset: 'angular',
};
