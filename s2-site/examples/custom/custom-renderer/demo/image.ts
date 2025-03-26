import {S2DataConfig, S2Options, TableSheet} from '@antv/s2';

async function render(data) {
  const container = document.getElementById('container');

  const s2DataConfig: S2DataConfig = {
    fields: {
      columns: ['lang', 'category', 'icon', 'title', 'slogan', 'description'],
      valueInCols: true,
    },
    data,
    meta: [
      {
        field: 'lang',
        name: '语言',
      },
      {
        field: 'category',
        name: '分类',
      },
      {
        field: 'title',
        name: '产品名称',
      },
      {
        field: 'icon',
        name: '图标',
        renderer: {
          type: 'IMAGE',
          fallback: `https://mdn.alipayobjects.com/huamei_2yzvel/afts/img/A*WxI6T4znRX0AAAAAAAAAAAAAeriAAQ/original`,
        },
      },
      {
        field: 'slogan',
        name: '宣传语',
      },
    ],
  };

  const s2Options: S2Options = {
    width: 1000,
    height: 480,
    style: {
      dataCell: {
        height: 50,
      },
    },
  };

  const s2 = new TableSheet(container, s2DataConfig, s2Options);

  s2.setTheme({
    dataCell: {
      text: {
        textAlign: 'center',
      },
    },
  });

  await s2.render();
}

fetch('https://assets.antv.antgroup.com/antv/products.json')
  .then((res) => res.json())
  .then((data) => {
    // 示例：错误的图片链接
    data.push({
      title: 'GError',
      icon: 'https://gw.alipayobjects.com/zos/antfincdn/FLa/antv.png',
      slogan: '示例',
      description: '错误的图片链接',
      category: 'basic',
      lang: 'zh',
      links:
        '{"home":{"url":"https://g.antv.antgroup.com/"},"example":{"url":"https://g.antv.antgroup.com/examples"},"api":{"url":"https://g.antv.antgroup.com/api/canvas/intro"}}',
    });
    render(data);
  });
