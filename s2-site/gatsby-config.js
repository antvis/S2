const { repository, homepage } = require('./package.json');

module.exports = {
  plugins: [
    {
      resolve: '@antv/gatsby-theme-antv',
      options: {
        GATrackingId: `G-SJ4N89WC85`,
      },
    },
  ],
  // 站点配置
  siteMetadata: {
    title: 'S2',
    description: '多维交叉分析表格',
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
        order: 0,
      },
      {
        slug: 'api/basic-class',
        title: {
          zh: '基础类',
          en: 'Basic class',
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
        slug: 'manual/basic',
        title: {
          zh: '基础教程',
          en: 'Basic tutorial',
        },
        order: 3,
      },
      {
        slug: 'manual/basic/sheet-type',
        title: {
          zh: '表形态',
          en: 'Sheet type',
        },
        order: 1,
      },
      {
        slug: 'manual/advanced',
        title: {
          zh: '进阶教程',
          en: 'Advanced tutorial',
        },
        order: 4,
      },
      {
        slug: 'manual/advanced/data-process',
        title: {
          zh: '数据流处理',
          en: 'Data Process',
        },
        order: 2,
      },
      {
        slug: 'manual/advanced/layout',
        title: {
          zh: '布局',
          en: 'Layout',
        },
        order: 3,
      },
      {
        slug: 'manual/advanced/custom',
        title: {
          zh: '自定义',
          en: 'Custom',
        },
        order: 4,
      },
      {
        slug: 'manual/advanced/interaction',
        title: {
          zh: '交互',
          en: 'interaction',
        },
        order: 5,
      },
      {
        slug: 'manual/basic/sort',
        title: {
          zh: '排序',
          en: 'Sort',
        },
        order: 6,
      },
      {
        slug: 'manual/basic/analysis',
        title: {
          zh: '分析组件',
          en: 'Analyze component',
        },
        order: 7,
      },
      {
        slug: 'manual/contribution',
        title: {
          zh: '贡献指南',
          en: 'Contributing',
        },
        order: 8,
      },
      {
        slug: 'manual/faq',
        title: {
          zh: '常见问题',
          en: 'Common problem',
        },
        order: 8,
      },
    ],
    // demo配置
    examples: [
      {
        slug: 'case',
        icon: 'star-single-line',
        title: {
          zh: '场景案例',
          en: 'Show Case',
        },
      },
      {
        slug: 'basic',
        icon: 'facet',
        title: {
          zh: '表格形态',
          en: 'Basic Sheets',
        },
      },
      {
        slug: 'layout',
        icon: 'other',
        title: {
          zh: '布局',
          en: 'Layout',
        }
      },
      {
        slug: 'theme',
        icon: 'skin',
        title: {
          zh: '表格主题',
          en: 'Theme',
        },
      },
      {
        slug: 'interaction',
        icon: 'block',
        title: {
          zh: '表格交互',
          en: 'Interaction',
        },
      },
      {
        slug: 'analysis',
        icon: 'bulb',
        title: {
          zh: '分析能力',
          en: 'Analysis',
        },
      },
      {
        slug: 'react-component',
        icon: 'build',
        title: {
          zh: 'React 组件',
          en: 'React Component',
        },
      },
      {
        slug: 'custom',
        icon: 'edit',
        title: {
          zh: '自定义',
          en: 'Custom Hooks',
        },
      },
    ],
    mdPlayground: {
      // markdown 文档中的 playground 若干设置
      splitPaneMainSize: '75%',
    },
    docsearchOptions: {
      versionV3: true,
      apiKey: '90c9a5dbf6e5ea7058cc32bcde8e94b2',
      indexName: 's2-antv-vision',
      appId: 'D73DOU8RXD',
    },
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
