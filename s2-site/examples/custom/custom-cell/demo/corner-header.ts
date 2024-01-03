import { PivotSheet, S2DataConfig, S2Options } from '@antv/s2';
import { get } from 'lodash';
import { Image as GImage, Group, Text } from '@antv/g';

/**
 * 自定义整个角头, 添加文字和背景色
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/header/corner.ts
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
  }

  initBg() {
    const img = new Image();

    img.src =
      'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png';

    img.onload = () => {
      this.backgroundShape = this.node.appendChild(
        new GImage({
          style: {
            x: 0,
            y: 0,
            width: get(this.node, 'headerConfig.width'),
            height: get(this.node, 'headerConfig.height'),
            img,
          },
        }),
      );

      this.initText();
    };
  }

  initText() {
    this.textShape = this.node.appendChild(
      new Text({
        zIndex: 100,
        style: {
          x: 50,
          y: 60,
          text: 'corner in S2',
          fontFamily: 'PingFang SC',
          fontSize: 20,
          fill: 'black',
          stroke: 'black',
        },
      }),
    );
  }
}

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      meta: res.meta,
      data: res.data,
    };

    const s2Options: S2Options = {
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

    await s2.render();
  });
