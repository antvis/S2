import React from 'react';
import { Line, Rect } from '@antv/g';

import insertCSS from 'insert-css';
import { ColCell, S2DataConfig, S2Theme } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';

const PALETTE_COLORS = [
  {
    limit: -50,
    background: 'rgb(62,144,109)',
    color: 'black',
  },
  {
    limit: -35,
    background: 'rgb(74,181,120)',
    color: 'black',
  },
  {
    limit: -20,
    background: 'rgb(112,196,121)',
    color: 'black',
  },
  {
    limit: -5,
    background: 'rgb(150,212,164)',
    color: 'black',
  },
  {
    limit: 10,
    background: 'rgb(190,226,188)',
    color: 'black',
  },
  {
    limit: 25,
    background: 'rgb(238,229,229)',
    color: 'black',
  },
  {
    limit: 40,
    background: 'rgb(243,187,161)',
    color: 'white',
  },
  {
    limit: 55,
    background: 'rgb(238,154,119)',
    color: 'white',
  },
  {
    limit: 70,
    background: 'rgb(235,123,85)',
    color: 'white',
  },
  {
    limit: 85,
    background: 'rgb(230,91,55)',
    color: 'white',
  },
  {
    limit: 100,
    background: 'rgb(214,61,33)',
    color: 'white',
  },
];

const GROUP_COLOR = {
  'people-group-a': 'rgb(99,133,241)',
  'people-group-b': 'rgb(116,213,157)',
};

const GROUP_SEPARATOR_WIDTH = 4;

const getFormatter =
  (enablePrefix = false) =>
  (value) => {
    const prefix = enablePrefix && value > 0 ? '+' : '';
    const suffix = value !== 0 ? '%' : '';

    return `${prefix}${value}${suffix}`;
  };

const getTargetColor = (value) =>
  PALETTE_COLORS.find((color) => color.limit >= value) ??
  PALETTE_COLORS[PALETTE_COLORS.length - 1];

class CustomColCell extends ColCell {
  initCell() {
    super.initCell();
    this.renderGroupSeparator();
  }

  renderGroupSeparator() {
    const { value, isLeaf } = this.meta;

    // 只需要为 A B 群组绘制标识
    if (!isLeaf || value === 'people-group-delta') {
      return;
    }

    const fill = GROUP_COLOR[value] || '#000';
    const { x, y, height } = this.textShape.getBBox();

    this.appendChild(
      new Rect({
        style: {
          x: x - GROUP_SEPARATOR_WIDTH * 1.5,
          y,
          height,
          width: GROUP_SEPARATOR_WIDTH,
          fill,
        },
      }),
    );
  }
}

const PaletteLegend = () => {
  return (
    <div className="palette-legend">
      <div className="palette-limit">-56%</div>
      {PALETTE_COLORS.map((color) => (
        <span
          key={color.background}
          className="palette-color"
          style={{ background: color.background }}
        />
      ))}
      <div className="palette-limit">96.32%</div>
    </div>
  );
};

fetch('https://assets.antv.antgroup.com/s2/multiple-people-comparison.json')
  .then((res) => res.json())
  .then(({ data }) => {
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['type', 'job'],
        columns: ['age', 'city'],
        values: ['people-group-a', 'people-group-b', 'people-group-delta'],
        valueInCols: true,
      },
      meta: [
        {
          field: 'type',
          name: '类别',
        },
        {
          field: 'job',
          name: '职业',
        },
        {
          field: 'age',
          name: '年龄分布',
        },
        {
          field: 'city',
          name: '所在城市',
        },
        {
          field: 'people-group-a',
          name: 'A人群',
          formatter: getFormatter(),
        },
        {
          field: 'people-group-b',
          name: 'B人群',
          formatter: getFormatter(),
        },
        {
          field: 'people-group-delta',
          name: '差值',
          formatter: getFormatter(true),
        },
      ],
      data,
    };

    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      tooltip: {
        operation: {
          hiddenColumns: true,
        },
      },
      interaction: {
        selectedCellsSpotlight: true,
        hoverHighlight: false,
      },
      style: {
        layoutWidthType: 'colAdaptive',
        dataCell: {
          width: 100,
        },
      },
      conditions: {
        text: [
          {
            field: 'people-group-delta',
            mapping(value) {
              const { color } = getTargetColor(value);

              return {
                fill: color,
              };
            },
          },
        ],
        background: [
          {
            field: 'people-group-delta',
            mapping(value) {
              const { background } = getTargetColor(value);

              return {
                fill: background,
              };
            },
          },
        ],
      },
      colCell(viewMeta, spreadsheet, headerConfig) {
        return new CustomColCell(viewMeta, spreadsheet, headerConfig);
      },
    };

    const theme: S2Theme = {
      dataCell: {
        // 父节点
        bolderText: {
          fill: 'rgb(84,84,84)',
        },
        // 子节点
        text: {
          fill: 'rgb(84,84,84)',
        },
      },
    };

    reactDOMClient.createRoot(document.getElementById('container')).render(
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2Options}
        sheetType="pivot"
        themeCfg={{ theme }}
        header={{
          title: '多人群对比表',
          extra: <PaletteLegend />,
        }}
      />,
    );
  });

insertCSS(`
  .ant-page-header {
    margin: 0 !important;
    padding: 0 !important;
  }

  .palette-legend {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 8px;
  }

  .palette-color {
    width: 12px;
    height: 12px;
  }

  .palette-limit{
    font-size: 12px;
    color: rgb(94,94,94);
  }

  .palette-color + .palette-limit {
    margin-left: 5px;
  }

  .palette-limit + .palette-color {
    margin-left: 5px;
  }
`);
