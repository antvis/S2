import React from 'react';

import { max, min, replace } from 'lodash';
import insertCSS from 'insert-css';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { S2DataConfig } from '@antv/s2';

const PALETTE_COLORS = [
  '#B8E1FF',
  '#9AC5FF',
  '#7DAAFF',
  '#5B8FF9',
  '#3D76DD',
  '#085EC0',
  '#0047A5',
  '#00318A',
  '#001D70',
];

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/24cac0f7-70f0-4131-be61-df11da3ca921.json',
)
  .then((res) => res.json())
  .then((data) => {
    const weights = data.map((item) => item.weight);
    const maxWeight = max(weights);
    const minWeight = min(weights);
    const weightSpan = maxWeight - minWeight;

    const PaletteLegend = () => (
      <div className="legend">
        <div className="legend-limit">{minWeight.toFixed(2)}</div>
        {PALETTE_COLORS.map((color, index) => (
          <span
            key={index}
            className="legend-color"
            style={{ background: color }}
          />
        ))}
        <div className="legend-limit">{maxWeight.toFixed(2)}</div>
      </div>
    );

    const getFormatter = (val) => {
      if (val < 0) {
        return `公元前${replace(val, '-', '')}年`;
      }

      return `${val}年`;
    };

    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['country', 'name', 'start', 'end', 'points', 'word'],
        columns: [],
        values: ['weight'],
      },
      meta: [
        {
          field: 'word',
          name: '关键词',
        },
        {
          field: 'points',
          name: '观点',
        },
        {
          field: 'name',
          name: '姓名',
        },
        {
          field: 'country',
          name: '国家',
        },
        {
          field: 'start',
          name: '出生',
          formatter: getFormatter,
        },
        {
          field: 'end',
          name: '逝世',
          formatter: getFormatter,
        },
        {
          field: 'weight',
          name: '权重',
          formatter: (val) => val.toFixed(2),
        },
      ],
      data,
    };

    const TooltipContent = (props) => {
      const { rowQuery, fieldValue } = props;
      const { name, country, start, end, points } = rowQuery;
      const pointsLines = points.split('&');

      return (
        <div className="antv-s2-tooltip-container">
          <div className="antv-s2-tooltip-head-info-list">
            <div>姓名：{name}</div>
            <div>国家：{country}</div>
            <div>出生：{getFormatter(start)}</div>
            <div>逝世：{getFormatter(end)}</div>
            {pointsLines.length > 1 ? (
              <div>
                观点:
                {pointsLines.map((point, index) => (
                  <div key={index}>
                    {index + 1}: {point}
                  </div>
                ))}
              </div>
            ) : (
              <div>观点: {pointsLines[0]}</div>
            )}
          </div>
          <div className="antv-s2-tooltip-divider"></div>
          <div className="antv-s2-tooltip-detail-list">
            <div className="antv-s2-tooltip-detail-item">
              <span className="antv-s2-tooltip-detail-item-key">权重</span>
              <span className="antv-s2-tooltip-detail-item-val">
                {fieldValue}
              </span>
            </div>
          </div>
        </div>
      );
    };

    const s2Options: SheetComponentOptions = {
      height: 400,
      conditions: {
        text: [
          {
            field: 'weight',
            mapping(value) {
              if (value >= 20) {
                return {
                  fill: '#fff',
                };
              }
            },
          },
        ],
        background: [
          {
            field: 'weight',
            mapping(value) {
              let backgroundColor;
              const colorIndex =
                Math.floor(
                  (((value - minWeight) / weightSpan) * 100) /
                    PALETTE_COLORS.length,
                ) - 1;

              if (colorIndex <= 0) {
                backgroundColor = PALETTE_COLORS[0];
              } else if (colorIndex >= PALETTE_COLORS.length) {
                backgroundColor = PALETTE_COLORS[PALETTE_COLORS.length - 1];
              } else {
                backgroundColor = PALETTE_COLORS[colorIndex];
              }

              return {
                fill: backgroundColor,
              };
            },
          },
        ],
      },
      interaction: {
        selectedCellsSpotlight: false,
        hoverHighlight: false,
      },
    };

    const onDataCellMouseUp = (value) => {
      const viewMeta = value?.viewMeta;

      if (!viewMeta) {
        return;
      }

      const position = {
        x: value.event.clientX,
        y: value.event.clientY,
      };

      viewMeta.spreadsheet.tooltip.show({
        position,
        content: TooltipContent(viewMeta),
      });
    };

    reactDOMClient.createRoot(document.getElementById('container')).render(
      <SheetComponent
        dataCfg={s2DataConfig}
        options={s2Options}
        adaptive={true}
        header={{
          title: '哲学家的观点',
          extra: <PaletteLegend />,
        }}
        onDataCellMouseUp={onDataCellMouseUp}
      />,
    );
  });

insertCSS(`
  .ant-page-header-compact {
    width: 100% ;
  }
  .legend {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 8px;
  }
  .legend-color {
    width: 12px;
    height: 12px;
  }

  .legend-limit{
    font-size: 12px;
    color: rgb(94,94,94);
  }

  .legend-color + .legend-limit {
    margin-left: 5px;
  }

  .legend-limit + .legend-color {
    margin-left: 5px;
  }
  .antv-s2-header {
    margin:0px !important;
  }
`);
