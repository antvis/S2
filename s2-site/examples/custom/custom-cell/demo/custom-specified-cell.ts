/* eslint-disable max-classes-per-file */
import { PivotSheet, DataCell, ColCell, CornerCell, RowCell } from '@antv/s2';

/**
 * 自定义 DataCell，通过复写基类方法, 给特定单元格设置背景色, 文字大小, 颜色等...
 * 查看更多方法 https://github.com/antvis/S2/blob/master/packages/s2-core/src/cell/data-cell.ts
 */
class CustomDataCell extends DataCell {
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

    // 指定列
    if (this.meta.rowIndex % 2 === 0) {
      return {
        ...defaultTextStyle,
        fontSize: 16,
        fill: '#396',
        textAlign: 'left',
      };
    }

    // 指定数据
    if (this.meta.fieldValue >= 600) {
      return {
        ...defaultTextStyle,
        fontSize: 14,
        fontWeight: 700,
        fill: '#f63',
        textAlign: 'center',
      };
    }

    // 指定单元格
    if (
      this.meta.id === 'root[&]四川省[&]乐山市-root[&]办公用品[&]纸张[&]number'
    ) {
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
 * 查看更多方法 https://github.com/antvis/S2/blob/master/packages/s2-core/src/cell/col-cell.ts
 */
class CustomColCell extends ColCell {
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
    if (this.meta.level >= 1) {
      return {
        ...defaultTextStyle,
        fill: 'pink',
        textAlign: 'center',
      };
    }

    // 指定文本
    if (this.meta.value === '办公用品') {
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

/**
 * 自定义 CornerCell, 通过复写基类方法, 给特定单元格设置文字大小, 颜色等...
 * 查看更多方法 https://github.com/antvis/S2/blob/master/packages/s2-core/src/cell/corner-cell.ts
 */
class CustomCornerCell extends CornerCell {
  getBackgroundColor() {
    // 特定数据
    if (this.meta.field === 'province') {
      return {
        backgroundColor: 'red',
        backgroundColorOpacity: 0.2,
      };
    }

    return super.getBackgroundColor();
  }

  getTextStyle() {
    const defaultTextStyle = super.getTextStyle();

    if (this.meta.field === 'type') {
      return {
        ...defaultTextStyle,
        fill: '#06a',
        fontSize: 20,
        fontWeight: 200,
      };
    }

    return super.getTextStyle();
  }
}

/**
 * 自定义 RowCell, 通过复写基类方法, 给特定单元格设置文字大小, 颜色等...
 * 查看更多方法 https://github.com/antvis/S2/blob/master/packages/s2-core/src/cell/row-cell.ts
 */
class CustomRowCell extends RowCell {
  getBackgroundColor() {
    // 特定数据
    if (this.meta.field === 'province') {
      return {
        backgroundColor: 'red',
        backgroundColorOpacity: 0.2,
      };
    }

    return super.getBackgroundColor();
  }

  getTextStyle() {
    const defaultTextStyle = super.getTextStyle();

    if (this.meta.field === 'type') {
      return {
        ...defaultTextStyle,
        fill: '#06a',
        fontSize: 20,
        fontWeight: 200,
      };
    }

    if (this.meta.rowIndex >= 1) {
      return {
        ...defaultTextStyle,
        fill: '#dcdcdc',
        fontSize: 20,
        fontWeight: 700,
      };
    }

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
      cornerCell: (node, spreadsheet, headerConfig) => {
        return new CustomCornerCell(node, spreadsheet, headerConfig);
      },
      colCell: (node, spreadsheet, headerConfig) => {
        return new CustomColCell(node, spreadsheet, headerConfig);
      },
      rowCell: (node, spreadsheet, headerConfig) => {
        return new CustomRowCell(node, spreadsheet, headerConfig);
      },
      dataCell: (viewMeta) => {
        return new CustomDataCell(viewMeta, viewMeta?.spreadsheet);
      },
    };
    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    s2.render();
  });
