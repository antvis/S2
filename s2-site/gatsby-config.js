const { version, repository, homepage } = require('./package.json');

module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {
        GATrackingId: ``,
      },
    },
  ],
  siteMetadata: {
    title: 'S2',
    description: 'Ant effective spreadsheet render core lib homepage',
    siteUrl: homepage,
    githubUrl: repository.url,
    showLanguageSwitcher: false,
    showChartResize: false,
    showAPI: false,
    versions: {
      [version]: 'https://s2.antv.vision',
    },
    navs: [
      {
        slug: 'docs/manual',
        title: {
          zh: '使用文档',
          en: 'Manual',
        },
      },
      {
        slug: 'docs/api',
        title: {
          zh: 'API 文档',
          en: 'API',
        },
      },
    ],
    docs: [
      {
        slug: 'api/general',
        title: {
          zh: '基础配置项',
          en: 'Common configuration',
        },
        order: 1,
      },
      {
        slug: 'api/components',
        title: {
          zh: '组件',
          en: 'Components',
        },
        order: 2,
      },
    ],
    redirects: [],
  },
};
