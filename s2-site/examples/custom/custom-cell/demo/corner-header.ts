import { Image as GImage, Group, Text } from '@antv/g';
import {
  PivotSheet,
  S2DataConfig,
  S2Options,
  type CornerHeader,
} from '@antv/s2';

/**
 * 自定义整个角头, 添加文字和背景色
 * 查看更多方法: https://github.com/antvis/S2/blob/next/packages/s2-core/src/facet/header/corner.ts
 */
class CustomCornerHeader extends Group {
  header: CornerHeader;

  backgroundShape;

  textShape;

  constructor(header) {
    super({});
    this.header = header;
    this.initCornerHeader();
  }

  initCornerHeader() {
    this.initBg();
    this.initText();
  }

  initBg() {
    const url =
      'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png';
    const { width, height } = this.header.getHeaderConfig();

    this.backgroundShape = this.header.appendChild(
      new GImage({
        style: {
          x: 0,
          y: 0,
          width,
          height,
          src: url,
        },
      }),
    );
  }

  initText() {
    this.textShape = this.header.appendChild(
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
      cornerHeader: (header, spreadsheet, headConfig) => {
        return new CustomCornerHeader(header);
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
