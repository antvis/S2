import { S2DataConfig } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import insertCSS from 'insert-css';
import React from 'react';
import '@antv/s2-react/dist/style.min.css';

const PALETTE_COLORS = [
  {
    limit: 10,
    background: '#b8e1ff',
  },
  {
    limit: 20,
    background: '#b4d3fb',
  },
  {
    limit: 30,
    background: '#7daaff',
  },
  {
    limit: 40,
    background: '#5b8ff9',
  },
  {
    limit: 50,
    background: '#3d76dd',
  },
  {
    limit: 60,
    background: '#085ec0',
  },
  {
    limit: 70,
    background: '#085ec0cc',
  },
  {
    limit: 80,
    background: '#0047a5',
  },
  {
    limit: 90,
    background: '#00318a',
  },
  {
    limit: 100,
    background: '#001d70',
  },
];

const getTargetColor = (value) => {
  if (Number.isNaN(Number(value))) {
    return PALETTE_COLORS[0].background;
  }

  return PALETTE_COLORS[Math.floor(Number(value) / 10)].background;
};

const PaletteLegend = () => {
  return (
    <div className="palette-legend">
      <div className="palette-limit">0%</div>
      {PALETTE_COLORS.map((color) => (
        <span
          key={color.background}
          className="palette-color"
          style={{ background: color.background }}
        />
      ))}
      <div className="palette-limit">100%</div>
    </div>
  );
};

fetch('https://assets.antv.antgroup.com/s2/single-population-proportion.json')
  .then((res) => res.json())
  .then(({ data }) => {
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['type', 'job'],
        columns: ['age', 'city'],
        values: ['count'],
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
          field: 'count',
          name: '数值',
        },
      ],
      data,
    };

    const s2Options: SheetComponentOptions = {
      width: 800,
      height: 600,
      tooltip: {
        enable: true,
        operation: {
          hiddenColumns: true,
        },
      },
      interaction: {
        selectedCellsSpotlight: false,
        hoverHighlight: false,
      },
      style: {
        layoutWidthType: 'colAdaptive',
        colCell: {
          hideValue: true,
        },
        dataCell: {
          width: 100,
        },
      },
      conditions: {
        text: [
          {
            field: 'count',
            mapping(value) {
              return {
                fill: value >= 50 ? '#fff' : '#282b32',
              };
            },
          },
        ],
        background: [
          {
            field: 'count',
            mapping(value) {
              const backgroundColor = getTargetColor(value);

              return {
                fill: backgroundColor,
              };
            },
          },
        ],
      },
    };

    reactDOMClient.createRoot(document.getElementById('container')).render(
      <div className="root">
        <SheetComponent
          dataCfg={s2DataConfig}
          options={s2Options}
          sheetType="pivot"
          adaptive={false}
          header={{
            title: '单人群占比表',
            extra: <PaletteLegend />,
          }}
        />
      </div>,
    );
  });

insertCSS(`
  .root{
    display: inline-block;
  }

  .palette-legend {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 8px;
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

  .antv-s2-header {
    margin:0px !important;
  }
`);
