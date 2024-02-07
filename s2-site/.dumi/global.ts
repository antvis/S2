if (window) {
  (window as any).react = require('react');
  (window as any).reactDom = require('react-dom');
  (window as any).lodash = require('lodash');
  (window as any).reactColor = require('react-color');
  (window as any).copyToClipboard = require('copy-to-clipboard');

  (window as any).antd = require('antd');
  (window as any).antdIcons = require('@ant-design/icons');

  (window as any).gCanvas = require('@antv/g-canvas');
  (window as any).s2 = require('@antv/s2');
  (window as any).s2React = require('@antv/s2-react');

  (window as any).tableCss = require('antd/es/table/style/index.css');
  (window as any).spaceCss = require('antd/es/space/style/index.css');
  (window as any).cascaderCss = require('antd/es/cascader/style/index.css');
  (window as any).checkboxCss = require('antd/es/checkbox/style/index.css');
  (window as any).paginationCss = require('antd/es/pagination/style/index.css');
  (
    window as any
  ).inputNumberCss = require('antd/es/input-number/style/index.css');

  // 本地通过 monorepoRedirect link 时不需要引入样式, 发布时引入, 避免样式丢失
  if (process.env.NODE_ENV === 'production') {
    (window as any).s2CSS = require('@antv/s2/dist/style.min.css');
    (window as any).s2ReactCSS = require('@antv/s2-react/dist/style.min.css');
  }

  // 码云和老网站统一跳转 antgroup 新域名
  const hosts = ['s2.antv.vision', 'antv-s2.gitee.io'];
  if (hosts.includes(location.host)) {
    (window as any).location.href = location.href.replace(
      location.origin,
      'https://s2.antv.antgroup.com',
    );
  }

  // 能获取到 version 说明没有走 dumi 的代理, 运行的 node_modules 的包
  console.table([
    {
      package: '@antv/s2',
      version: (window as any).s2?.version || 'development',
    },
    {
      package: '@antv/s2-react',
      version: (window as any).s2React?.version || 'development',
    },
    {
      package: '@antv/s2-vue',
      version: (window as any).s2Vue?.version || 'development',
    },
  ]);
}
