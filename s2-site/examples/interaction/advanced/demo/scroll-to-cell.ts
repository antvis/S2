import { PivotSheet, S2Options, SpreadSheet } from '@antv/s2';
import insertCSS from 'insert-css';

function addScrollRowHeaderButton(s2: SpreadSheet) {
  const btn = document.createElement('button');

  btn.className = 'ant-btn ant-btn-default';
  btn.innerHTML = '滚动行头';

  btn.addEventListener('click', () => {
    s2.interaction.scrollTo({
      rowHeaderOffsetX: {
        value: 50,
        animate: true,
      },
    });
  });
  document.querySelector('#container > canvas')?.before(btn);
}

function addScrollToCellButton(s2: SpreadSheet) {
  const btn = document.createElement('button');

  btn.className = 'ant-btn ant-btn-default';
  btn.innerHTML = '滚动至成都市';

  btn.addEventListener('click', () => {
    const rowNode = s2.facet.getRowNodeById('root[&]四川省[&]成都市');

    // 方式 1: 获取行头是成都市对应的单元格, 使用 scrollTo, 只会改变纵向滚动条
    if (rowNode) {
      s2.interaction.scrollTo({
        offsetY: {
          value: rowNode.y,
          animate: true,
        },
      });
    }

    // 方式 2: 使用 scrollToCellById
    // s2.interaction.scrollToCellById('root[&]四川省[&]成都市');

    // 方式 3: 使用 scrollToNode
    // s2.interaction.scrollToNode(rowNode);
  });
  document.querySelector('#container > canvas')?.before(btn);
}

function addScrollToTopButton(s2: SpreadSheet) {
  const btn = document.createElement('button');

  btn.className = 'ant-btn ant-btn-default';
  btn.innerHTML = '滚动至顶部';

  btn.addEventListener('click', () => {
    s2.interaction.scrollToTop();

    // 等价于:
    // s2.interaction.scrollTo({
    //   offsetY: {
    //     value: 0,
    //   },
    // });
  });
  document.querySelector('#container > canvas')?.before(btn);
}

function addScrollToBottomButton(s2: SpreadSheet) {
  const btn = document.createElement('button');

  btn.className = 'ant-btn ant-btn-default';
  btn.innerHTML = '滚动至底部';

  btn.addEventListener('click', () => {
    s2.interaction.scrollToBottom();
    // 等价于:
    // s2.interaction.scrollTo({
    //   offsetY: {
    //     value: 0,
    //   },
    // });
  });
  document.querySelector('#container > canvas')?.before(btn);
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then(async (dataCfg) => {
    const container = document.getElementById('container');

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      frozen: {
        rowHeader: true,
      },
      style: {
        // 让行头区域显示滚动条
        rowCell: {
          width: 200,
        },
        // 让表格数值区域显示滚动条
        dataCell: {
          height: 100,
        },
      },
    };

    const s2 = new PivotSheet(container, dataCfg, s2Options);

    await s2.render();

    addScrollToCellButton(s2);
    addScrollToTopButton(s2);
    addScrollToBottomButton(s2);
    addScrollRowHeaderButton(s2);
  });

insertCSS(`
  #container > canvas {
    margin-top: 10px;
  }
`);
