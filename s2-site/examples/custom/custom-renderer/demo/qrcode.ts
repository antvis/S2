import {S2DataConfig, S2Options, TableSheet} from '@antv/s2';
// import QRCode from 'qrcode'
// npm i qrcode

async function render(data) {
  const container = document.getElementById('container');

  const s2DataConfig: S2DataConfig = {
    fields: {
      columns: ['src', 'desc'],
    },
    data,
    meta: [
      {
        field: 'src',
        renderer: {
          type: 'IMAGE',
          // 在实际项目中需要新增qrcode依赖
          prepareText: value => QRCode.toDataURL(value)
        },
      },
    ],
  };

  const s2Options: S2Options = {
    width: 600,
    height: 600,
    style: {
      dataCell: {
        height: 300,
      },
    },
  };

  const s2 = new TableSheet(container, s2DataConfig, s2Options);

  await s2.render();
}

const data = [
  {
    src: `https://www.alipay.com/`,
    desc: `支付宝`,
  },
  {
    src: `https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/file/A*EZfPRJqzl4cAAAAAAAAAAAAAARQnAQ`,
    desc: `复制导出`,
  },
  {
    src: `https://gw.alipayobjects.com/v/huamei_qa8qxu/afts/video/wg8jTrLg-3EAAAAAAAAAAAAAK4eUAQBr`,
    desc: `3D大图`,
  },
  {
    src: `https://gw.alipayobjects.com/v/huamei_qa8qxu/afts/video/l9viS4v0-fgAAAAAAAAAAAAAK4eUAQBr`,
    desc: `超强性能`,
  },
  {
    src: `https://gw.alipayobjects.com/v/huamei_qa8qxu/afts/video/XHdUSp9rBo4AAAAAAAAAAAAAK4eUAQBr`,
    desc: `叙事动画`,
  },
  {
    src: `https://gw.alipayobjects.com/v/huamei_qa8qxu/afts/video/StguTYJvYQMAAAAAAAAAAAAAVoeUAQBr`,
    desc: `WebXR`,
  },
];

render(data);
