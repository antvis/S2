import { defineConfig } from 'dumi';
// import { version } from '@antv/s2';
import { repository } from './package.json';

export default defineConfig({
  ...(process.env.NODE_ENV === 'production' ? { ssr: { builder: 'webpack', mako: false } } : { ssr: false, mako: {} }),
  locales: [
    { id: 'zh', name: '中文' },
    { id: 'en', name: 'English' },
  ],
  title: 'S2', // 网站 header 标题
  favicons: [
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*7svFR6wkPMoAAAAAAAAAAAAADmJ7AQ/original',
  ], // 网站 favicon
  metas: [
    // 自定义 meta 标签
    { name: 'keywords', content: 'S2 2.0' },
    { name: 'description', content: '多维交叉分析表格 2.0, S2 Next' },
  ],
  themeConfig: {
    /** 死链检查配置  */
    deadLinkChecker: {}, // 开启并采用默认配置
    /** 站点地图配置 */
    sitemap: {}, // 开启并采用默认配置
    metas: {
      title: {
        zh: "S2 多维交叉分析表格 2.0",
        en: "S2 Multi Cross Analysis Table 2.0"
      },
      description: {
        zh: "S2 是多维交叉分析领域的表格解决方案，数据驱动视图，提供底层核心库、基础组件库、业务场景库，具备自由扩展的能力，让开发者既能开箱即用，也能基于自身场景自由发挥。",
        en: "S2 is a table solution in the field of multidimensional cross analysis. It is data-driven view, provides the underlying core library, basic component library and business scenario library, and has the ability of free expansion, allowing developers to use it out of the box and freely play based on their own scenarios."
      }
    },
    title: 'S2',
    description: '多维交叉分析表格 2.0',
    defaultLanguage: 'zh', // 默认语言
    isAntVSite: false, // 是否是 AntV 的大官网
    footerTheme: 'light', // 白色 底部主题
    siteUrl: 'https://antv.antgroup.com', // 官网地址
    sitePackagePath: '/s2-site', // 官网子包所在路径
    feedback: true, // 开启文档用户反馈
    githubUrl: repository.url, // GitHub 地址
    showSearch: true, // 是否显示搜索框
    showGithubCorner: true, // 是否显示头部的 GitHub icon
    showGithubStars: true, // 是否显示 GitHub star 数量
    showAntVProductsCard: true, // 是否显示 AntV 产品汇总的卡片
    showLanguageSwitcher: true, // 是否显示官网语言切换
    showWxQrcode: true, // 是否显示头部菜单的微信公众号
    showChartResize: true, // 是否在 demo 页展示图表视图切换
    showAPIDoc: true, // 是否在 demo 页展示 API 文档
    es5: false,
    petercat: {
      show: true,
      // token 获取方式：https://github.com/petercat-ai/petercat/blob/main/docs/guides/quick_%20assistant_start_cn.md#token-%E8%8E%B7%E5%8F%96
      token: '611bb8ac-e7d2-47c6-994e-9c68421fae7d',
    },
    versions: {
      // 历史版本以及切换下拉菜单
      // [version || '2.x']: 'https://s2.antv.antgroup.com',
      '2.x': 'https://s2.antv.antgroup.com',
      '1.x': 'https://s2-v1.antv.antgroup.com',
    },
    docsearchOptions: {
      // 头部搜索框配置
      versionV3: true,
      apiKey: '74b99a09199729fd4ac472746ada8456',
      indexName: 's2-antv-antgroup',
      appId: 'LWCKDMVZ87',
    },
    // internalSite: {
    //   url: 'https://s2.antv.antgroup.com',
    //   name: {
    //     zh: '国内镜像',
    //     en: 'China Mirror',
    //   },
    // },
    navs: [
      {
        slug: 'docs/manual/getting-started',
        title: {
          zh: '使用文档',
          en: 'Manual',
        },
      },
      {
        slug: 'docs/api/general/s2-data-config',
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
      {
        slug: 'playground',
        title: {
          zh: '在线体验',
          en: 'Playground',
        },
      },
      {
        slug: 'https://github.com/antvis/S2/releases',
        title: {
          zh: '更新日志',
          en: 'ChangeLog',
        },
      },
    ],
    docs: [
      {
        slug: 'api/general',
        title: {
          zh: '基础配置项',
          en: 'Common Configuration',
        },
        order: 0,
      },
      {
        slug: 'api/basic-class',
        title: {
          zh: '基础类',
          en: 'Basic Class',
        },
        order: 1,
      },
      {
        slug: 'api/components',
        title: {
          zh: '分析组件',
          en: 'Components',
        },
        order: 2,
      },
      {
        slug: 'manual/basic',
        title: {
          zh: '基础教程',
          en: 'Basic Tutorial',
        },
        order: 3,
      },
      {
        slug: 'manual/basic/sheet-type',
        title: {
          zh: '表形态',
          en: 'Sheet Type',
        },
        order: 1,
      },
      {
        slug: 'manual/advanced',
        title: {
          zh: '进阶教程',
          en: 'Advanced Tutorial',
        },
        order: 4,
      },
      {
        slug: 'manual/advanced/cell-render',
        title: {
          zh: '单元格渲染类型',
          en: 'Advanced Tutorial',
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
          en: 'Interaction',
        },
        order: 5,
      },
      {
        slug: 'manual/advanced/analysis',
        title: {
          zh: '分析组件',
          en: 'Analyze Component',
        },
        order: 6,
      },
      {
        slug: 'manual/advanced/sheet',
        title: {
          zh: '表格组件',
          en: 'Sheet Component',
        },
        order: 7,
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
        slug: 'manual/extended-reading',
        title: {
          zh: '扩展阅读',
          en: 'Extended Reading',
        },
        order: 6,
      },
      {
        slug: 'manual/extended-reading/data-process',
        title: {
          zh: '数据流处理',
          en: 'Data Process',
        },
        order: 1,
      },
      {
        slug: 'manual/extended-reading/layout',
        title: {
          zh: '布局流程',
          en: 'Layout',
        },
        order: 2,
      },
    ],
    tutorials: [
      {
        slug: 'manual/about',
        title: {
          zh: '关于',
          en: 'About',
        },
        order: 1,
      },
    ],
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
        },
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
    // https://github.com/antvis/dumi-theme-antv/blob/v3/src/slots/CodeEditor/Toolbar.tsx#L116-L120
    playground: {
      extraLib: '',
      devDependencies: {
        typescript: 'latest',
        react: '18.3.1',
        'react-dom': '18.3.1',
      },
      dependencies: {
        antd: 'latest',
        '@ant-design/icons': '^5.3.7',
        '@antv/s2': '^2.0.0',
        '@antv/s2-react': '^2.0.0',
        '@antv/s2-react-components': '^2.0.0',
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
    /** 首页技术栈介绍 */
    detail: {
      engine: {
        zh: 'S2',
        en: 'S2',
      },
      title: {
        zh: 'S2 多维交叉分析表格 2.0',
        en: 'S2 Multi Cross Analysis Table 2.0',
      },
      description: {
        zh: 'S2 是多维交叉分析领域的表格解决方案，数据驱动视图，提供底层核心库、基础组件库、业务场景库，具备自由扩展的能力，让开发者既能开箱即用，也能基于自身场景自由发挥。',
        en: 'S2 is a table solution in the field of multidimensional cross analysis. It is data-driven view, provides the underlying core library, basic component library and business scenario library, and has the ability of free expansion, allowing developers to use it out of the box and freely play based on their own scenarios.',
      },
      image:
        'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*1PTTQLk3j5AAAAAAAAAAAAAADmJ7AQ/original',
      imageStyle: {
        marginLeft: '70px',
        marginTop: '90px',
      },
      buttons: [
        {
          text: {
            zh: '2.0 升级指南',
            en: 'Migration v2',
          },
          link: `/manual/migration-v2`,
        },
        {
          text: {
            zh: '查看 1.x 官网',
            en: 'View 1.x Website',
          },
          link: `https://s2-v1.antv.antgroup.com`,
          type: 'primary',
        },
        // 右上角有图表示例的入口, 2.0 过渡期间透出 [升级指南]
        // {
        //   text: {
        //     zh: '图表示例',
        //     en: 'Examples',
        //   },
        //   link: `/examples`,
        // },
        {
          text: {
            zh: '开始使用',
            en: 'Getting Started',
          },
          link: `/manual/getting-started`,
          type: 'primary',
        },
      ],
    },
    /** 新闻公告，优先选择配置的，如果没有配置则使用远程的！ */
    // news: [
    //   {
    //     type: {
    //       zh: '初心 · 出新 AntV 2023 年度发布',
    //       en: 'AntV 2023',
    //     },
    //     title: {
    //       zh: 'S2 2.0 表格看数新纪元',
    //       en: 'S2 2.0 Next Version',
    //     },
    //     date: '2023.11.22',
    //     link: 'https://www.yuque.com/antv/blog/1122_7_s2',
    //   },
    //   {
    //     type: {
    //       zh: 'S2 Next',
    //       en: 'S2 Next',
    //     },
    //     title: {
    //       zh: '2.0 版本开始内测啦! 欢迎尝鲜使用.',
    //       en: '2.0 is in beta! Welcome to use.',
    //     },
    //     date: '2024.2.5',
    //     link: 'https://github.com/antvis/S2/issues/2454',
    //   },
    //   {
    //     type: {
    //       zh: 'S2 1.x',
    //       en: 'S2 1.x',
    //     },
    //     title: {
    //       zh: '原 v1 文档已迁移至 https://s2-v1.antv.antgroup.com',
    //       en: 'The original v1 documentation has been migrated to https://s2-v1.antv.antgroup.com',
    //     },
    //     date: '2024.2.5',
    //     link: 'https://s2-v1.antv.antgroup.com',
    //   },
    // ],
    /** 首页特性介绍 */
    features: [
      {
        icon: 'https://gw.alipayobjects.com/zos/bmw-prod/d55190d1-2787-4a6e-abac-3ee0355f9c46.svg',
        title: {
          zh: '专业多维交叉分析',
          en: 'Professional multidimensional cross analysis',
        },
        description: {
          zh: '告别单一维度分析，全面拥抱任意维度的自由组合分析',
          en: 'Say goodbye to single dimension analysis, and fully embrace the free combination analysis of any dimension',
        },
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/bmw-prod/79453ef5-ea77-423f-ab26-c5fb503e722e.svg',
        title: {
          zh: '组件灵活，高扩展性',
          en: 'Flexible components & High scalability',
        },
        description: {
          zh: '提供不同层面分析组件，且支持任意自定义扩展（包括但不限于布局、样式、交互、数据流等）',
          en: 'To analyze components at different levels, and support any custom extensions (including but not limited to layout, style, interaction, data flow, etc.)',
        },
      },
      {
        icon: 'https://gw.alipayobjects.com/zos/bmw-prod/15da7b71-0026-4b08-a55f-c1e90ca4839c.svg',
        title: {
          zh: '高性能，秒级渲染',
          en: 'High performance & second level rendering',
        },
        description: {
          zh: '支持全量百万数据下低于 4s 的渲染，也能通过局部下钻来实现真·秒级渲染',
          en: 'Support full million data under 4s rendering, but also through local drill down to achieve true second level rendering',
        },
      },
    ],
    /** 首页案例 */
    cases: [
      {
        logo: 'https://gw.alipayobjects.com/zos/bmw-prod/2f23b9d9-9d6c-43bf-8c71-796c92a2e7b3.svg',
        title: {
          zh: '分群下钻表',
          en: 'Cluster drill-down table',
        },
        description: {
          zh: '多维细分网格化的分群探索表格叫分群下钻表',
          en: 'The group exploration table of multi-dimensional subdivision grid is called group driller table',
        },
        link: `/examples/case/proportion#group-drill-down`,
        image: 'https://gw.alipayobjects.com/zos/antfincdn/RYy4GI8Y8d/demo.gif',
      },
      {
        logo: 'https://gw.alipayobjects.com/zos/bmw-prod/291cec1b-9052-4904-a484-56c582815e7b.svg',
        title: {
          zh: '指标对比表',
          en: 'Index comparison table',
        },
        description: {
          zh: '将不同维度下的不同指标进行分组查看和分析的透视表叫指标对比表。',
          en: 'Pivottables that view and analyze different indicators in different dimensions are called indicator comparison tables.',
        },
        link: `/examples/case/comparison#measure-comparison`,
        image:
          'https://gw.alipayobjects.com/zos/antfincdn/f3djpYed%249/2d05736c-c119-4168-aa6d-5691f6fc9185.png',
      },
      {
        logo: 'https://gw.alipayobjects.com/zos/bmw-prod/291cec1b-9052-4904-a484-56c582815e7b.svg',
        title: {
          zh: '多人群对比表',
          en: 'Multipopulation comparison table',
        },
        description: {
          zh: '不同维度同类对象的对比分析表格叫对比表，而专用于不同属性、偏好等的人群对比分析表格叫人群对比表。',
          en: 'The comparative analysis table of the same object in different dimensions is called the comparison table, while the group comparative analysis table dedicated to different attributes, preferences, etc., is called the group comparison table.',
        },
        link: `/examples/case/comparison#multiple-people-comparison`,
        image:
          'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*02QuR7cajBwAAAAAAAAAAAAAARQnAQ',
      },
      {
        logo: 'https://gw.alipayobjects.com/zos/bmw-prod/dca6e7f0-f2e9-4a2b-baea-64fff4933bf4.svg',
        title: {
          zh: '单人群占比表',
          en: 'Single population proportion table',
        },
        description: {
          zh: '不同维度同类对象的对比分析表格叫对比表，而专用于不同属性、偏好等的人群对比分析表格叫人群对比表。',
          en: 'The comparative analysis table of the same object in different dimensions is called the comparison table, while the group comparative analysis table dedicated to different attributes, preferences, etc., is called the group comparison table.',
        },
        link: `/examples/case/proportion#single-population-proportion`,
        image:
          'https://gw.alipayobjects.com/zos/antfincdn/eNow%2604Qsv/6e579a67-4a4f-4b90-ad91-3fbb1def67fc.png',
      },
    ],
  },
  mfsu: false,
  alias: {
    '@': __dirname,
  },
  styles: ['/site.css'],
  links: [],
  scripts: [],
  analytics: {
    ga_v2: 'G-SJ4N89WC85',
  },
});
