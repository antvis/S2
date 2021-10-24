import { PivotSheet, DataCell } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

// 自定义单元格，实现特有功能
class CustomDataCell extends DataCell {
  /**
   * Draw cell backgroud with image
   */
  protected drawBackgroundShape() {
    this.backgroundShape = this.addShape('image', {
      attrs: {
        ...this.getCellArea(),
        img: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*2vnsQ58ErqkAAAAAAAAAAAAAARQnAQ',
      }
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
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      data: res.data,
    };
    const s2options = {
      width: 660,
      height: 600,
      hoverHighlight: false, // 为了视觉效果，可不设置
      dataCell: (viewMeta) => {
        return new CustomDataCell(viewMeta, viewMeta?.spreadsheet);
      }
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2options);
    
    // 使用
    s2.render();
  });
