const { repository, homepage } = require('./package.json');

module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {
        GATrackingId: ``,
      },
    },
  ],
  // 站点配置
  siteMetadata: {
    title: 'S2',
    description: 'Ant effective spreadsheet render core lib homepage',
    siteUrl: homepage,
    githubUrl: repository.url,
    showLanguageSwitcher: true,
    showChartResize: false,
    showAPIDoc: true,
    galleryMenuCloseAll: true,
    showWxQrcode: true,
    wxQrcode:
      'https://gw.alipayobjects.com/zos/antfincdn/ZKlx96dsfs/qrcode_for_gh_f52d8b6aa591_258.jpg',
    // 一级导航
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
      {
        slug: 'examples',
        title: {
          zh: '图表示例',
          en: 'Examples',
        },
      },
    ],
    // 文档配置
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
      {
        slug: 'manual/interaction',
        title: {
          zh: '交互',
          en: 'Interaction',
        },
        order: 3,
      },
    ],
    // demo配置
    examples: [
      {
        slug: 'case',
        icon: 'gallery',
        title: {
          zh: '场景案例',
          en: 'Show Case',
        },
      },
      {
        slug: 'basic',
        icon: 'facet',
        title: {
          zh: '表形态',
          en: 'Basic Sheets',
        },
      },
      {
        slug: 'interaction',
        icon: 'facet',
        title: {
          zh: '交互',
          en: 'Interaction',
        },
      },
    ],
    // 编辑器配置
    playground: {
      container: '<div id="container" />',
      playgroundDidMount: 'console.log("playgroundDidMount");',
      playgroundWillUnmount: 'console.log("playgroundWillUnmount");',
      devDependencies: {
        typescript: 'latest',
      },
      htmlCodeTemplate: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>{{title}}</title>
          </head>
          <body>
            <div id="container" />
            <script src="https://gw.alipayobjects.com/os/antv/pkg/_antv.data-set-0.10.1/dist/data-set.min.js"></script>
            <script>
        {{code}}
            </script>
          </body>
        </html>`,
    },
  },
};
