import { PivotSheet, CornerCell } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

// 自定义角头单元格，实现特有功能
class CustomCornelCell extends CornerCell {
  protected initCell() {
    this.renderExtraImg();

    super.initCell();
  }

  /**
   * 绘制其他信息，自定义用户需要的画布元素
   */
  renderExtraImg() {
    this.addShape('image', {
      attrs: {
        ...this.getCellArea(),
        img: 'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png',
      },
    });
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
        columns: ['type'],
        values: ['price', 'cost'],
      },
      meta: [
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'type',
          name: '商品类别',
        },
        {
          field: 'price',
          name: '价格',
        },
        {
          field: 'cost',
          name: '成本',
        },
      ],
      data: res.data,
    };
    const s2Options = {
      width: 600,
      height: 480,
      cornerCell: (node, s2, headConfig) => {
        return new CustomCornelCell(node, s2, headConfig);
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    // 使用
    s2.render();
  });
