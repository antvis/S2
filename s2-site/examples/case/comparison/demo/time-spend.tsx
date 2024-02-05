/* eslint-disable max-classes-per-file */
import { Circle, Line } from '@antv/g';
import { DataCell, Frame, ResizeType, ThemeCfg } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import insertCSS from 'insert-css';
import React from 'react';

const paletteLegendMap = [
  {
    text: '睡觉',
    color: '#6974EF',
  },
  {
    text: '工作',
    color: '#18E7CF',
  },
  {
    text: '上学',
    color: '#89E48A',
  },
  {
    text: '吃饭',
    color: '#FAE232',
  },
  {
    text: '学习',
    color: '#FAA140',
  },
  {
    text: '娱乐',
    color: '#E491BA',
  },
  {
    text: '运动',
    color: '#61AEFE',
  },
  {
    text: '其他',
    color: '#FAD5BB',
  },
];

// 自定义单元格
class CustomDataCell extends DataCell {
  initCell() {
    this.drawInteractiveBgShape();
    this.drawCircle();
    this.drawBorders();

    if (JSON.stringify(this.meta.colQuery).includes('合计')) {
      this.drawTextShape();
    }

    this.update();
  }

  drawCircle() {
    const radius = 12;
    const { x, y, height, width, fieldValue, colQuery } = this.meta;
    const positionX = x + width / 2;
    const positionY = y + height / 2;

    let fill;
    let opacity = 1;

    if (!isNaN(fieldValue)) {
      fill =
        paletteLegendMap.find((v) => v.text === colQuery?.['时刻'])?.color ??
        '#FAD5BB';
      opacity = 0.5;
    } else {
      fill =
        paletteLegendMap.find((v) => v.text === fieldValue)?.color ?? '#FAD5BB';
    }

    this.appendChild(
      new Circle({
        style: {
          cx: positionX,
          cy: positionY,
          fill,
          fillOpacity: opacity,
          r: radius,
        },
      }),
    );
  }
}

// 自定义分割线
class CustomFrame extends Frame {
  layout() {
    super.layout();
    // 水平二级分割线
    this.addHorizontalSplitLine();
    // 垂直二级分割线
    this.addVerticalSplitLine();
  }

  addHorizontalSplitLine() {
    const cfg = this.cfg;
    const {
      cornerWidth,
      cornerHeight,
      viewportWidth,
      position,
      scrollX = 0,
      spreadsheet,
    } = cfg;
    const scrollContainsRowHeader = !spreadsheet.isFrozenRowHeader();
    const splitLine = spreadsheet.theme?.splitLine;
    const { rowsHierarchy } = spreadsheet.facet.getLayoutResult();
    const rootNodes = rowsHierarchy.getNodesLessThanLevel(0);

    rootNodes.forEach((node, key) => {
      if (key < rootNodes.length - 1) {
        const { children } = node;
        const lastChild = children[children.length - 1];
        const x1 = position.x;
        const x2 =
          x1 +
          cornerWidth +
          viewportWidth +
          (scrollContainsRowHeader ? scrollX : 0);
        const y = position.y + cornerHeight + lastChild.y + lastChild.height;

        const line = new Line({
          style: {
            x1,
            y1: y,
            x2,
            y2: y,
            stroke: splitLine?.verticalBorderColor,
            lineWidth: 1,
            opacity: splitLine?.verticalBorderColorOpacity,
          },
        });

        this.appendChild(line);
      }
    });
  }

  addVerticalSplitLine() {
    const cfg = this.cfg;
    const { cornerWidth, viewportHeight, position, cornerHeight, spreadsheet } =
      cfg;
    const splitLine = spreadsheet.theme?.splitLine;
    const { colsHierarchy } = spreadsheet.facet.getLayoutResult();
    const rootNodes = colsHierarchy.getNodesLessThanLevel(0);

    rootNodes.forEach((node, key) => {
      if (key < rootNodes.length - 1) {
        const { children } = node;
        const lastChild = children[children.length - 1];
        const x = lastChild.x + lastChild.width + cornerWidth;
        const y1 = position.y;
        const y2 = position.y + cornerHeight + viewportHeight;

        const line = new Line({
          style: {
            x1: x,
            y1,
            x2: x,
            y2,
            stroke: splitLine?.verticalBorderColor,
            lineWidth: 1,
            opacity: splitLine?.verticalBorderColorOpacity,
          },
        });

        this.appendChild(line);
      }
    });
  }
}

fetch('https://assets.antv.antgroup.com/s2/time-spend.json')
  .then((res) => res.json())
  .then((s2DataConfig) => {
    const s2Palette: ThemeCfg['palette'] = {
      basicColors: [
        '#FFFFFF',
        '#020138',
        'rgba(255,255,255,0.18)',
        '#020138',
        'rgba(255,255,255,0.18)',
        '#7232CF',
        '#7232CF',
        '#AB76F7',
        '#020138',
        'rgba(255,255,255,0)',
        'rgba(255,255,255,0)',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF',
      ],
      // ---------- semantic colors ----------
      semanticColors: {
        red: '#FF4D4F',
        green: '#29A294',
      },
    };

    const s2Theme: ThemeCfg['theme'] = {
      colCell: {
        bolderText: {
          fontSize: 12,
          textAlign: 'center',
          fontWeight: 'normal',
        },

        cell: {
          horizontalBorderColorOpacity: 0.3,
          verticalBorderColorOpacity: 0.3,
        },
      },
      rowCell: {
        text: {
          textAlign: 'right',
        },
        cell: {
          horizontalBorderColorOpacity: 0.3,
          verticalBorderColorOpacity: 0.3,
        },
      },
      dataCell: {
        text: {
          textAlign: 'center',
        },
        cell: {
          horizontalBorderColorOpacity: 0.3,
          verticalBorderColorOpacity: 0.3,
        },
      },
      cornerCell: {
        bolderText: {
          textAlign: 'right',
        },
        cell: {
          horizontalBorderColorOpacity: 0.3,
          verticalBorderColorOpacity: 0.3,
        },
      },
      splitLine: {
        horizontalBorderColorOpacity: 0.3,
        horizontalBorderWidth: 2,
        shadowColors: {
          left: 'rgba(255,255,255, 0.3)',
          right: 'rgba(255,255,255, 0.01)',
        },
      },
    };

    const s2Options: SheetComponentOptions = {
      width: 1150,
      height: 420,
      showDefaultHeaderActionIcon: false,
      dataCell: (viewMeta) => {
        return new CustomDataCell(viewMeta, viewMeta?.spreadsheet);
      },
      frame: (cfg) => {
        return new CustomFrame(cfg);
      },
      interaction: {
        resize: {
          colResizeType: ResizeType.ALL,
          rowResizeType: ResizeType.ALL,
        },
      },
      style: {
        layoutWidthType: 'compact',
        colCell: {
          hideValue: true,
        },
        rowCell: {
          widthByField: {
            成员: 42,
          },
        },
        dataCell: {
          width: 40,
          height: 40,
        },
      },
    };

    const PaletteLegend = () => (
      <div className="palette">
        {paletteLegendMap.map((value, key) => (
          <div key={key} className="palette-group">
            <span
              className="palette-color"
              style={{ background: value.color }}
            />
            <span className="palette-text">{value.text}</span>
          </div>
        ))}
      </div>
    );

    reactDOMClient.createRoot(document.getElementById('container')).render(
      <div className="sheet-wrapper">
        <PaletteLegend />
        <SheetComponent
          dataCfg={s2DataConfig}
          options={s2Options}
          sheetType="pivot"
          themeCfg={{ theme: s2Theme, palette: s2Palette }}
        />
      </div>,
    );
  });

insertCSS(`
  .sheet-wrapper {
    background: #010138;
    padding: 16px;
  }
  .palette {
    display: flex;
    width: 100%;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .palette-group {
    display: flex;
  }
  .palette-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;

  }
  .palette-text {
    color: #FFF;
    width: 50px;
    font-size: 12px;
    padding-left: 8px;
  }
`);
