/* eslint-disable max-classes-per-file */
import { TableColCell, TableDataCell, TableSheet } from '@antv/s2';

/**
 * 自定义 TableDataCell，通过复写基类方法, 给特定单元格设置背景色, 文字大小, 颜色等...
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-data-cell.ts
 */
class CustomDataCell extends TableDataCell {
  getBackgroundColor() {
    // 特定数据
    if (this.meta.fieldValue >= 6000) {
      return {
        backgroundColor: 'red',
        backgroundColorOpacity: 0.2,
      };
    }

    return super.getBackgroundColor();
  }

  getTextStyle() {
    const defaultTextStyle = super.getTextStyle();
    // 序号

    if (this.meta.colIndex === 0) {
      return {
        ...defaultTextStyle,
        fontWeight: 600,
        textAlign: 'center',
      };
    }

    // 指定列
    if (this.meta.rowIndex % 2 === 0 && this.meta.colIndex > 0) {
      return {
        ...defaultTextStyle,
        fontSize: 16,
        fill: '#396',
        textAlign: 'left',
      };
    }

    // 指定数据
    if (this.meta.fieldValue >= 600 || this.meta.fieldValue === '沙发') {
      return {
        ...defaultTextStyle,
        fontSize: 14,
        fontWeight: 700,
        fill: '#f63',
        textAlign: 'center',
      };
    }

    // 指定单元格
    if (this.meta.id === '7-root[&]省份') {
      return {
        ...defaultTextStyle,
        fontSize: 12,
        fontWeight: 200,
        fill: '#dcdcdc',
        opacity: 0.9,
        textAlign: 'right',
      };
    }

    // 使用默认处理
    return super.getTextStyle();
  }
}

/**
 * 自定义 ColCell, 通过复写基类方法, 给特定单元格设置文字大小, 颜色等...
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/table-col-cell.ts
 */
class CustomColCell extends TableColCell {
  getTextStyle() {
    const defaultTextStyle = super.getTextStyle();

    // 指定列
    if (this.meta.colIndex % 2 === 0) {
      return {
        ...defaultTextStyle,
        fontSize: 16,
        fill: '#396',
        textAlign: 'left',
      };
    }

    // 指定层级
    if (this.meta.level >= 0) {
      return {
        ...defaultTextStyle,
        fill: 'pink',
        textAlign: 'center',
      };
    }

    // 指定文本
    if (this.meta.label === '子类别') {
      return {
        ...defaultTextStyle,
        fontSize: 22,
        textAlign: 'right',
      };
    }

    // 使用默认处理
    return super.getTextStyle();
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
        columns: ['province', 'city', 'type', 'sub_type', 'number'],
      },
      meta: res.meta,
      data: res.data,
    };
    const s2Options = {
      width: 600,
      height: 480,
      seriesNumber: {
        enable: true,
      },
      colCell: (node, spreadsheet, headerConfig) => {
        return new CustomColCell(node, spreadsheet, headerConfig);
      },
      dataCell: (viewMeta) => {
        return new CustomDataCell(viewMeta, viewMeta?.spreadsheet);
      },
    };

    const s2 = new TableSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
