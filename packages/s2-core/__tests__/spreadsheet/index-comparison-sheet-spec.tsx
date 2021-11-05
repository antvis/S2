import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { getContainer } from 'tests/util/helpers';
import * as data from '../data/index-comparison.json';

import { CustomColCell } from './custom/custom-col-cell';
import { CustomDataCell } from './custom/custom-data-cell';
import { CustomCornelCell } from './custom/custom-corner-cell';
import { CustomFrame } from './custom/custom-frame';
import { SheetComponent } from '@/components';

const UP_COLOR = '#F46649';
const DOWN_COLOR = '#2AA491';

function MainLayout() {
  const s2DataConfig = {
    fields: {
      rows: ['type'],
      columns: ['tag'],
      values: ['price', 'uv', 'pv', 'click_uv'],
    },
    meta: [
      {
        field: 'type',
        name: '服装服饰',
      },
      {
        field: 'price',
        name: '金额',
      },
      {
        field: 'uv',
        name: '搜索uv',
      },
      {
        field: 'pv',
        name: '搜索pv',
      },
      {
        field: 'click_uv',
        name: '点击uv',
      },
    ],
    data,
  };
  const getIcon = (fieldValue) => {
    return parseFloat(fieldValue) > 0
      ? 'CellUp'
      : fieldValue < 0
      ? 'CellDown'
      : '';
  };

  const conditionsIcon = [
    {
      field: 'price',
      mapping(fieldValue) {
        return {
          icon: getIcon(fieldValue),
        };
      },
    },
    {
      field: 'uv',
      mapping(fieldValue) {
        return {
          icon: getIcon(fieldValue),
        };
      },
    },
    {
      field: 'click_uv',
      mapping(fieldValue) {
        return {
          icon: getIcon(fieldValue),
        };
      },
    },
  ];
  const getCustomTextStyle = (value, textStyle) => {
    return {
      fill:
        parseFloat(value) > 0
          ? UP_COLOR
          : parseFloat(value) < 0
          ? DOWN_COLOR
          : textStyle?.fill,
    };
  };
  const lineConfigStyle = {
    stroke: '#3471F9',
    lineWidth: 1,
    opacity: 0.5,
  };
  const lineConfig = {
    price: 1,
    pv: 1,
  };
  const s2options = {
    width: 800,
    height: 600,
    showDefaultHeaderActionIcon: false,
    tooltip: {
      showTooltip: false,
    },
    colCell: (node, spreadsheet, ...restOptions) => {
      return new CustomColCell(
        node,
        spreadsheet,
        ...restOptions,
        lineConfig,
        lineConfigStyle,
      );
    },
    dataCell: (viewMeta) => {
      return new CustomDataCell(viewMeta, viewMeta.spreadsheet, {
        lineConfig,
        lineConfigStyle,
        conditions: {
          周环比差值: {
            icon: conditionsIcon,
          },
          周环比率: {
            icon: conditionsIcon,
          },
        },
        textConfig: {
          周环比差值: {
            // 自定义文字样式
            getCustomTextStyle,
          },
          周环比率: {
            // 自定义文字formatted
            getCustomFormattedValue: (value) => {
              return `${parseFloat(value)?.toFixed(4) * 100}%`;
            },
            // 自定义文字样式
            getCustomTextStyle,
          },
        },
      });
    },
    cornerCell: (node, s2, headConfig) => {
      return new CustomCornelCell(node, s2, headConfig);
    },
    frame: (cfg) => {
      return new CustomFrame({ ...cfg, lineConfigStyle });
    },
  };

  return (
    <div>
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2options}
        sheetType="pivot"
      />
      ,
    </div>
  );
}

describe('spreadsheet normal spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
});
