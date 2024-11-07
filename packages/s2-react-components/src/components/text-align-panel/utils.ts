import type { S2Theme } from '@antv/s2';
import type { TextAlignPanelOptions } from './interface';

/**
 * 生成表格文本对齐方式主题配置
 * @see https://s2.antv.antgroup.com/zh/docs/api/general/s2-theme
 */
export function generateCellTextAlignTheme(
  options: TextAlignPanelOptions,
): S2Theme {
  const {
    colCellTextAlign: colCellAlignType,
    rowCellTextAlign: rowCellAlignType = 'left',
    dataCellTextAlign: dataCellAlignType = 'right',
  } = options;

  return {
    // 角头取列头的对齐方式, 但底表默认行角头是靠左, 列角头是靠右, 所以没有指定默认值时默认按底表对齐方式展示.
    cornerCell: {
      text: {
        textAlign: options?.colCellTextAlign || 'left',
      },
      bolderText: {
        textAlign: options?.colCellTextAlign || 'right',
      },
    },
    colCell: {
      text: {
        textAlign: colCellAlignType,
      },
      bolderText: {
        textAlign: colCellAlignType,
      },
      measureText: {
        textAlign: dataCellAlignType,
      },
    },
    rowCell: {
      text: {
        textAlign: rowCellAlignType,
      },
      bolderText: {
        textAlign: rowCellAlignType,
      },
      measureText: {
        textAlign: rowCellAlignType,
      },
    },
    dataCell: {
      text: {
        textAlign: dataCellAlignType,
      },
      bolderText: {
        textAlign: dataCellAlignType,
      },
    },
  };
}
