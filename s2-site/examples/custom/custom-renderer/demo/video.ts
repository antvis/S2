import {S2DataConfig, S2Options, TableSheet} from '@antv/s2';

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
          type: 'VIDEO',
        },
      },
    ],
  };

  const s2Options: S2Options = {
    width: 800,
    height: 800,
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
    src: `https://gw.alipayobjects.com/v/rms_6ae20b/afts/video/A*VD0TTbZB9WMAAAAAAAAAAAAAARQnAQ/720P`,
    desc: `动画`,
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
