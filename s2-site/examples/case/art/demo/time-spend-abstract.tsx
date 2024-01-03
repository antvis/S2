import React from 'react';

import insertCSS from 'insert-css';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import { Image as GImage } from '@antv/g';
import { DataCell, ThemeCfg } from '@antv/s2';
import '@antv/s2-react/dist/style.min.css';

const paletteLegendMap = [
  {
    text: '睡觉',
    img: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*zGyiSa2A8ZMAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '工作',
    img: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*RdyWRpg3hRAAAAAAAAAAAAAAARQnAQ',
  },

  {
    text: '上学',
    img: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*1p5iTYDCkKEAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '吃饭',
    img: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*XHHcSZxmR7gAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '学习',
    img: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*1p5iTYDCkKEAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '娱乐',
    img: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ZRaUT55QCaoAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '运动',
    img: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*xpO5Sawk8YIAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '其他',
    img: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*e5A3SKifw1EAAAAAAAAAAAAAARQnAQ',
  },
];

/**
 * 自定义 DataCell, 给单元格添加图表
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/data-cell.ts
 */
class CustomDataCell extends DataCell {
  drawTextShape() {
    const { fieldValue } = this.meta;
    const url =
      paletteLegendMap.find((v) => v.text === fieldValue)?.img ??
      'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*e5A3SKifw1EAAAAAAAAAAAAAARQnAQ';
    const img = new Image();

    img.src = url;
    const { x, y, width, height } = this.meta;

    img.onload = () => {
      this.textShape = this.appendChild(
        new GImage({
          style: {
            x: x + (width - img?.width) / 2,
            y: y + (height - img?.height) / 2,
            width: img?.width ?? width,
            height: img?.height ?? height,
            img: url,
          },
        }),
      );
    };
  }
}

fetch('https://assets.antv.antgroup.com/s2/time-spend.json')
  .then((res) => res.json())
  .then((s2DataConfig) => {
    const s2Theme: ThemeCfg['theme'] = {
      colCell: {
        text: {
          opacity: 0,
        },
        bolderText: {
          opacity: 0,
        },
        cell: {
          backgroundColor: '#020138',
        },
      },
      rowCell: {
        text: {
          opacity: 0,
        },
        bolderText: {
          opacity: 0,
        },
        cell: {
          horizontalBorderColorOpacity: 0,
          verticalBorderColorOpacity: 0,
          backgroundColor: '#020138',
          interactionState: {
            // -------------- hover -------------------
            hover: {
              backgroundColor: 'rgba(255,255,255,0.18)',
            },
            // -------------- selected -------------------
            selected: {
              backgroundColor: 'rgba(255,255,255,0.18)',
            },
          },
        },
      },
      dataCell: {
        cell: {
          horizontalBorderColorOpacity: 0,
          verticalBorderColorOpacity: 0,
          crossBackgroundColor: '#020138',
          backgroundColor: '#020138',
          interactionState: {
            // -------------- hover -------------------
            hover: {
              backgroundColor: 'rgba(255,255,255,0.18)',
            },
            // -------------- keep hover -------------------
            hoverFocus: {
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              borderOpacity: 0,
            },
            // -------------- selected -------------------
            selected: {
              backgroundColor: 'rgba(255,255,255,0.18)',
            },
          },
        },
      },
      cornerCell: {
        bolderText: {
          opacity: 0,
        },
        cell: {
          horizontalBorderColorOpacity: 0,
          verticalBorderColorOpacity: 0,
          backgroundColor: '#020138',
        },
      },
      splitLine: {
        horizontalBorderColorOpacity: 0,
        verticalBorderColorOpacity: 0,
      },
      background: {
        color: '#020138',
      },
    };

    const s2Options: SheetComponentOptions = {
      width: 1150,
      height: 720,
      showDefaultHeaderActionIcon: false,
      dataCell: (viewMeta) => {
        return new CustomDataCell(viewMeta, viewMeta?.spreadsheet);
      },
      interaction: {
        hoverHighlight: false,
      },
      style: {
        layoutWidthType: 'compact',
        colCell: {
          hideValue: true,
          height: 0,
        },
        dataCell: {
          height: 80,
        },
      },
    };

    const PaletteLegend = () => (
      <div className="palette">
        {paletteLegendMap.map((value, key) => (
          <div key={key} className="palette-group">
            <img className="palette-img" src={value.img} />
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
          themeCfg={{ theme: s2Theme }}
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
    margin-left: 88px;
  }
  .palette-group {
    display: flex;
  }
  .palette-img {
    width: auto;
    height: 20px;
  }
  .palette-text {
    color: #FFF;
    width: 50px;
    font-size: 12px;
    padding-left: 8px;
  }
`);
