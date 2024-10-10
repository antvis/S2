// organize-imports-ignore
import React from 'react';
import { Image as GImage } from '@antv/g';
import { DataCell, ThemeCfg } from '@antv/s2';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';
import insertCSS from 'insert-css';

const paletteLegendMap = [
  {
    text: '睡觉',
    src: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*zGyiSa2A8ZMAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '工作',
    src: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*RdyWRpg3hRAAAAAAAAAAAAAAARQnAQ',
  },

  {
    text: '上学',
    src: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*1p5iTYDCkKEAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '吃饭',
    src: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*XHHcSZxmR7gAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '学习',
    src: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*1p5iTYDCkKEAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '娱乐',
    src: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ZRaUT55QCaoAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '运动',
    src: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*xpO5Sawk8YIAAAAAAAAAAAAAARQnAQ',
  },
  {
    text: '其他',
    src: 'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*e5A3SKifw1EAAAAAAAAAAAAAARQnAQ',
  },
];

const ImageCache = new Map<string, HTMLImageElement>();

/**
 * 自定义 DataCell, 给单元格添加图表
 * 查看更多方法 https://github.com/antvis/S2/blob/next/packages/s2-core/src/cell/data-cell.ts
 */
class CustomDataCell extends DataCell {
  drawTextShape() {}

  renderImage(img: HTMLImageElement) {
    const { x, y, width, height } = this.meta;

    this.backgroundShape = this.appendChild(
      new GImage({
        style: {
          x: x + (width - img?.width) / 2,
          y: y + (height - img?.height) / 2,
          width: img?.width ?? width,
          height: img?.height ?? height,
          src: img,
        },
      }),
    );
  }

  drawBackgroundShape() {
    const { fieldValue } = this.meta;
    const url =
      paletteLegendMap.find((legend) => legend.text === fieldValue)?.src ??
      'https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*e5A3SKifw1EAAAAAAAAAAAAAARQnAQ';

    if (ImageCache.get(url)) {
      this.renderImage(ImageCache.get(url));

      return;
    }

    const img = new Image();

    img.src = url;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      this.renderImage(img);
      ImageCache.set(url, img);
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
      dataCell: (viewMeta, spreadsheet) => {
        return new CustomDataCell(viewMeta, spreadsheet);
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
        {paletteLegendMap.map((legend, key) => (
          <div key={key} className="palette-group">
            <img className="palette-img" src={legend.src} />
            <span className="palette-text">{legend.text}</span>
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
