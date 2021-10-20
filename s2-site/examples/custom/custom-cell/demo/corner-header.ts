import { PivotSheet } from '@antv/s2';
import { Group, IShape } from '@antv/g-canvas';
import { get } from 'lodash';
import '@antv/s2/dist/s2.min.css';

// 自定义角头单元格，实现特有功能
class CustomCornerHeader<Group> extends Group {
  protected node: Group;
  protected backgroundShape: IShape;
  protected textShape: IShape;
  public constructor(node: Group) {
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
            img: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*2vnsQ58ErqkAAAAAAAAAAAAAARQnAQ',
        }
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
      }
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
      data: res.data,
    };
    const s2options = {
      width: 660,
      height: 600,
      cornerHeader: (node, s2, headConfig) => {
        return new CustomCornerHeader(node);
      }
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);
    
    // 使用
    s2.render();
  });
