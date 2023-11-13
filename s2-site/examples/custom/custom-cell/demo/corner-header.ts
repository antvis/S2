import { PivotSheet } from '@antv/s2';
import { Group } from '@antv/g-canvas';
import { get } from 'lodash';

/**
 * 自定义整个角头, 添加文字和背景色
 * 查看更多方法 https://github.com/antvis/S2/blob/master/packages/s2-core/src/facet/header/corner.ts
 */
class CustomCornerHeader extends Group {
  node;

  backgroundShape;

  textShape;

  constructor(node) {
    super({});
    this.node = node;
    this.initCornerHeader();
  }

  initCornerHeader() {
    this.initBg();
    this.initText();
  }

  initBg() {
    this.backgroundShape = this.addShape('image', {
      attrs: {
        x: 0,
        y: 0,
        width: get(this.node, 'headerConfig.width'),
        height: get(this.node, 'headerConfig.height'),
        img: 'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png',
      },
    });
    this.node.add(this.backgroundShape);
  }

  initText() {
    this.textShape = this.addShape('text', {
      zIndex: 100,
      attrs: {
        x: 50,
        y: 70,
        text: 'corner in S2',
        fontFamily: 'PingFang SC',
        fontSize: 20,
        fill: 'black',
        stroke: 'black',
      },
    });
    this.node.add(this.textShape);
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then((res) => {
    const container = document.getElementById('container');
    const s2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };
    const s2Options = {
      width: 600,
      height: 480,
      interaction: {
        hoverHighlight: false,
      },
      cornerHeader: (node, s2, headConfig) => {
        return new CustomCornerHeader(node);
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
