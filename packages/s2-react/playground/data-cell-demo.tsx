/* eslint-disable no-console */
import { PivotSheet } from '@antv/s2';
import { get } from 'lodash';
const data = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price', 'cost'],
    valueInCols: true,
  },
  data: [
    {
      province: '浙江',
      city: '义乌',
      type: '笔',
      price: 1,
      cost: 2,
    },
    {
      province: '浙江',
      city: '义乌',
      type: '笔',
      price: 1,
      cost: 2,
    },
    {
      province: '浙江',
      city: '杭州',
      type: '笔',
      price: 1,
      cost: 2,
    },
  ],
};

const getContainer = () => {
  const rootContainer = document.createElement('div');
  rootContainer.setAttribute('style', 'margin-left: 32px');
  document.body.appendChild(rootContainer);
  return rootContainer;
};

const s2Instance = new PivotSheet(getContainer(), data, {
  hdAdapter: false,
});

const info = (textAlign) => {
  console.log(`theme.dataCell.text.textAlign:${textAlign}`);
  const panelBBoxInstance = s2Instance.facet.panelGroup.getChildByIndex(0);

  const dataCell = (panelBBoxInstance as any).getChildByIndex(0);

  const { minX, maxX } = (dataCell as any).linkFieldShape.getBBox();

  const linkLength = maxX - minX;
  console.log('宽度相当比较：');
  console.log('link宽度与actualTextWidth 值的差值为:');
  console.log(Math.abs(linkLength - get(dataCell, 'actualTextWidth')));

  const linkCenterX = minX + linkLength / 2;
  console.log('link shape 的中点坐标与 text 中点对齐:');
  console.log(`linkCenterX:${linkCenterX}`);
};

s2Instance.render();

s2Instance.setOptions({
  interaction: {
    linkFields: ['price'],
  },
});

s2Instance.setTheme({
  dataCell: {
    text: {
      textAlign: 'left',
    },
  },
});

s2Instance.render();

info('left');

s2Instance.setTheme({
  dataCell: {
    text: {
      textAlign: 'center',
    },
  },
});
s2Instance.render();
info('center');

s2Instance.setTheme({
  dataCell: {
    text: {
      textAlign: 'right',
    },
  },
});
s2Instance.render();
info('right');
