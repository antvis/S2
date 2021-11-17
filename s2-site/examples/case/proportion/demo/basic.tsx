import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/ee9ba442-2241-4052-ab7c-2c226765cedb.json',
)
  .then((res) => res.json())
  .then((data) => {
    const GridSheet = () => {
      const [s2DataConfig, setS2DataConfig] = useState(data.dataCfg);
      const [sheetType, setSheetType] = useState('gridAnalysis');
      const [showTooltip, setShowTooltip] = useState(false);
      const [drillDownField, setDrillDownField] = useState('');
      const s2options = {
        width: 600,
        height: 600,
        tooltip: {
          showTooltip: showTooltip,
        },
        style: {
          layoutWidthType: 'colAdaptive',
          cellCfg: {
            width: 250,
            height: 130,
            minorMeasureRowIndex: 3,
            firstDerivedMeasureRowIndex: 2,
          },
          colCfg: {
            hideMeasureColumn: true,
          },
        },
      };

      const Breadcrumb = () => {
        if (drillDownField) {
          return (
            <div className="antv-s2-breadcrumb">
              <span
                className="antv-s2-breadcrumb-all"
                onClick={() => {
                  setSheetType('gridAnalysis');
                  setShowTooltip(false);
                  setS2DataConfig(data.dataCfg);
                  setDrillDownField('');
                }}
              >
                全部
              </span>
              <span> / {drillDownField}</span>
            </div>
          );
        } else {
          return null;
        }
      };

      const dataCellTooltip = (viewMeta) => {
        const { spreadsheet, fieldValue } = viewMeta;
        return (
          <div>
            <div className="antv-s2-tooltip-operator">
              <div
                className="antv-s2-tooltip-action"
                onClick={() => {
                  setSheetType('pivot');
                  setShowTooltip(true);
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
              按住 Cmd/Ctrl 多选单元格进行人群合并
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
          element: dataCellTooltip(viewMeta),
        });
      };
      return (
        <SheetComponent
          dataCfg={s2DataConfig}
          options={s2options}
          sheetType={sheetType}
          header={{
            title: '人群网络分析',
            extra: [<Breadcrumb />],
          }}
          onDataCellMouseUp={onDataCellMouseUp}
        />
      );
    };

    ReactDOM.render(<GridSheet />, document.getElementById('container'));
  });

// We use 'insert-css' to insert custom styles
// It is recommended to add the style to your own style sheet files
// If you want to copy the code directly, please remember to install the npm package 'insert-css
// 我们用 insert-css 演示引入自定义样式
// 推荐将样式添加到自己的样式文件中
// 若拷贝官方代码，别忘了 npm install insert-css
insertCss(`
  .antv-s2-tooltip-operator {
    display: flex
  }
  .antv-s2-tooltip-action {
    width: 50%;
    text-align: center;
  }
  .antv-s2-breadcrumb {
    position: absolute;
    left: 0px;
    top: 48px;
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
`);
