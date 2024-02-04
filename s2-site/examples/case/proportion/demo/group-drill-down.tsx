import { isUpDataValue } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import insertCSS from 'insert-css';
import React from 'react';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/ff31b171-17a7-4d29-b20a-0b90a810d2de.json',
)
  .then((res) => res.json())
  .then((data) => {
    const GridSheet = () => {
      const [s2DataConfig, setS2DataConfig] = React.useState(data.dataCfg);
      const [drillDownField, setDrillDownField] = React.useState('');
      const s2Options: SheetComponentOptions = {
        width: 800,
        height: 600,
        tooltip: {
          enable: false,
        },
        style: {
          layoutWidthType: 'colAdaptive',
          dataCell: {
            width: 400,
            height: 100,
            valuesCfg: {
              widthPercent: [40, 20, 20, 20],
            },
          },
        },
        conditions: {
          text: [
            {
              mapping: (value, cellInfo) => {
                // 添加文本颜色映射逻辑
                const { colIndex } = cellInfo;

                if (colIndex <= 1) {
                  // 主指标为黑色
                  return {
                    fill: '#000',
                  };
                }

                // 同环比红张绿跌
                return {
                  fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
                };
              },
            },
          ],
        },
      };

      const Breadcrumb = () => {
        if (!drillDownField) {
          return null;
        }

        return (
          <div className="antv-s2-breadcrumb">
            <span
              className="antv-s2-breadcrumb-all"
              onClick={() => {
                setS2DataConfig(data.dataCfg);
                setDrillDownField('');
              }}
            >
              全部
            </span>
            <span> / {drillDownField}</span>
          </div>
        );
      };

      const dataCellTooltip = (viewMeta) => {
        const { spreadsheet, fieldValue } = viewMeta;

        return (
          <div>
            <div className="antv-s2-tooltip-operator">
              <div
                className="antv-s2-tooltip-action"
                onClick={() => {
                  setS2DataConfig(data.drillDownDataCfg);
                  setDrillDownField(fieldValue.label);
                }}
              >
                下钻
              </div>
              <div
                className="antv-s2-tooltip-action"
                onClick={() => {
                  spreadsheet.interaction.mergeCells();
                }}
              >
                合并
              </div>
            </div>
            <div className="antv-s2-tooltip-divider"></div>
            <div className="antv-s2-tooltip-head-info-list">
              {fieldValue.label}
            </div>
            <div className="antv-s2-tooltip-detail-list">
              {fieldValue.values.map((item, key) => (
                <div key={key} className="antv-s2-tooltip-detail-item">
                  <span className="antv-s2-tooltip-detail-item-key">
                    {item[0]}
                  </span>
                  <span className="antv-s2-tooltip-detail-item-val antv-s2-tooltip-highlight">
                    {`${item[1]} | 环比率：${item[2]} | 环比差值：${item[3]}`}
                  </span>
                </div>
              ))}
            </div>
            <div className="antv-s2-tooltip-infos">
              按住 Shift 多选单元格进行人群合并
            </div>
          </div>
        );
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
          content: dataCellTooltip(viewMeta),
        });
      };

      return (
        <SheetComponent
          dataCfg={s2DataConfig}
          options={s2Options}
          sheetType="gridAnalysis"
          header={{
            title: '人群网络分析',
            advancedSort: { open: true },
            extra: <Breadcrumb />,
          }}
          onDataCellMouseUp={onDataCellMouseUp}
        />
      );
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<GridSheet />);
  });

insertCSS(`
  .antv-s2-tooltip-operator {
    display: flex
  }
  .antv-s2-tooltip-action {
    width: 50%;
    text-align: center;
  }
  .antv-s2-breadcrumb {
  position: absolute;
    left: 130px;
    top: 11px;
  }
  .antv-s2-breadcrumb-all {
     color: #706f6f;
  }
  .antv-s2-breadcrumb-all:hover {
    color: #873bf4;
    cursor: pointer;
  }
  .antv-s2-advanced-sort {
    display: none;
  }
  .antv-s2-header {
    margin:0px !important;
  }
`);
