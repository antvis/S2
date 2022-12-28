import { PivotSheet } from '@antv/s2';
import insertCss from 'insert-css';

function addScrollToCellButton(s2) {
  const btn = document.createElement('button');
  btn.className = 'ant-btn ant-btn-default';
  btn.innerHTML = '滚动至成都市';

  btn.addEventListener('click', () => {
    // 获取行头是成都市对应的单元格
    const rowNode = s2
      .getRowNodes()
      .find(({ id }) => id === 'root[&]四川省[&]成都市');

    s2.updateScrollOffset({
      offsetY: {
        value: rowNode?.y,
        animate: true,
      },
    });
  });
  document.querySelector('#container > canvas').before(btn);
}

function addScrollToTopButton(s2) {
  const btn = document.createElement('button');
  btn.className = 'ant-btn ant-btn-default';
  btn.innerHTML = '滚动至顶部';

  btn.addEventListener('click', () => {
    s2.updateScrollOffset({
      offsetY: {
        value: 0,
        animate: true,
      },
    });
  });
  document.querySelector('#container > canvas').before(btn);
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const container = document.getElementById('container');

    const s2Options = {
      width: 600,
      height: 480,
      style: {
        dataCell: {
          // 让表格显示滚动条
          height: 100,
        },
      },
    };
    const s2 = new PivotSheet(container, dataCfg, s2Options);

    s2.render();

    addScrollToCellButton(s2);
    addScrollToTopButton(s2);
  });

insertCss(`
  #container > canvas {
    margin-top: 10px;
  }
`);
