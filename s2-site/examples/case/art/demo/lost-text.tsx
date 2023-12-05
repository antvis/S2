/* eslint-disable max-classes-per-file */
import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';
import { Tag } from 'antd';
import {
  BaseEvent,
  CellTypes,
  getTheme,
  InterceptType,
  S2Event,
  CornerCell,
} from '@antv/s2';

import '@antv/s2-react/dist/style.min.css';

const Theme = {
  rowCell: {
    text: {
      opacity: 0,
    },
    bolderText: {
      opacity: 0,
    },
    measureText: {
      opacity: 0,
    },
  },
  colCell: {
    text: {
      opacity: 0,
    },
    bolderText: {
      opacity: 0,
    },
    measureText: {
      opacity: 0,
    },
  },
  dataCell: {
    text: {
      opacity: 0,
    },
  },
};

class CustomCornerCell extends CornerCell {
  drawBackgroundShape() {
    this.addShape('rect', {
      attrs: {
        ...this.getCellArea(),
        fill: '#E0E9FD',
      },
    });
  }

  getCornerText() {
    return '👍🏻';
  }
}

class CustomInteraction extends BaseEvent {
  timer = null;

  count = 0;

  changeCell(cellType: CellTypes) {
    this.count++;

    const defaultTheme = getTheme(null)?.[cellType];
    this.spreadsheet.setTheme({
      [cellType]: defaultTheme,
    });
    this.spreadsheet.render(false);

    if (this.count >= 3) {
      clearInterval(this.timer);
      this.showSuccessTips();
    }
  }

  resetCell() {
    this.count = 0;
    this.spreadsheet.setTheme(Theme);
    this.spreadsheet.render(false);
  }

  showSuccessTips() {
    const rect = this.spreadsheet.getCanvasElement().getBoundingClientRect();

    this.spreadsheet.showTooltip({
      position: {
        x: rect.width / 2 + rect.left,
        y: rect.height / 2 + rect.top,
      },
      content: (
        <div
          style={{
            padding: 20,
            textAlign: 'center',
          }}
        >
          <h3>💐 通关啦 💐</h3>
          <p>
            S2
            多维交叉分析表格是多维交叉分析领域的表格解决方案，数据驱动视图，提供底层核心库、基础组件库、业务场景库，具备自由扩展的能力，让开发者既能开箱即用，也能基于自身场景自由发挥。
          </p>
          <p>
            <a href="https://s2.antv.antgroup.com" target="__blank">
              前往官网 https://s2.antv.antgroup.com/
            </a>
          </p>
        </div>
      ),
    });
    this.spreadsheet.interaction.addIntercepts([InterceptType.HOVER]);
  }

  bindEvents() {
    // 角头: 一键三连
    this.addCornerCellInteraction();
    // 行头: 多选全部偶数行
    this.addRowCellInteraction();
    // 列头: 调整列宽/刷选全部
    this.addColCellInteraction();
    // 数值: 键盘方向键移动端选中单元格到右下角
    this.addDataCellInteraction();
  }

  addCornerCellInteraction() {
    const countMap: Record<number, CellTypes> = {
      0: CellTypes.ROW_CELL,
      1: CellTypes.COL_CELL,
      2: CellTypes.DATA_CELL,
    };

    this.spreadsheet.on(S2Event.CORNER_CELL_MOUSE_DOWN, () => {
      clearInterval(this.timer);
      this.resetCell();

      this.timer = setInterval(() => {
        this.changeCell(countMap[this.count]);
      }, 1000);
    });

    this.spreadsheet.on(S2Event.CORNER_CELL_MOUSE_UP, () => {
      clearInterval(this.timer);

      if (this.count < 3) {
        this.resetCell();
      }
    });
  }

  addDataCellInteraction() {
    this.spreadsheet.on(S2Event.DATA_CELL_SELECT_MOVE, (cells) => {
      const { colIndex, rowIndex } = cells[0];

      const isLastCell = colIndex === 3 && rowIndex === 7;
      if (isLastCell) {
        this.changeCell(CellTypes.DATA_CELL);
      }
    });
  }

  addColCellInteraction() {
    this.spreadsheet.on(S2Event.LAYOUT_RESIZE_COL_WIDTH, ({ info }) => {
      const rules = [6, 66, 666];
      if (rules.includes(info.resizedWidth)) {
        this.changeCell(CellTypes.COL_CELL);
      }
    });

    this.spreadsheet.on(S2Event.COL_CELL_BRUSH_SELECTION, (colCells) => {
      const isAllSelected =
        colCells.length === this.spreadsheet.getColumnNodes().length;
      if (isAllSelected) {
        this.changeCell(CellTypes.COL_CELL);
      }
    });
  }

  addRowCellInteraction() {
    this.spreadsheet.on(S2Event.GLOBAL_SELECTED, (cells) => {
      const selectedOddRowCells = cells.filter((cell) => {
        const meta = cell.getMeta();
        return cell.cellType === CellTypes.ROW_CELL && meta.rowIndex % 2 !== 0;
      });

      const isAllOddRowCellsSelected = selectedOddRowCells.length === 4;
      if (isAllOddRowCellsSelected) {
        this.changeCell(CellTypes.ROW_CELL);
      }
    });
  }
}

export const s2Options = {
  debug: true,
  width: 600,
  height: 400,
  showSeriesNumber: false,
  showDefaultHeaderActionIcon: false,
  interaction: {
    enableCopy: true,
    // 防止 mac 触摸板横向滚动触发浏览器返回, 和移动端下拉刷新
    overscrollBehavior: 'none',
    brushSelection: {
      data: true,
      col: true,
      row: true,
    },
    hoverFocus: false,
    hoverHighlight: false,
    customInteractions: [
      {
        key: 'CustomInteraction',
        interaction: CustomInteraction,
      },
    ],
  },
  tooltip: {
    showTooltip: false,
  },
  hierarchyType: 'grid',
  style: {
    rowCfg: {
      width: 100,
    },
    cellCfg: {
      width: 50,
      height: 30,
    },
  },
  cornerCell: (...args) => new CustomCornerCell(...args),
};

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    ReactDOM.render(
      <SheetComponent
        dataCfg={dataCfg}
        options={s2Options}
        themeCfg={{ theme: Theme }}
        header={{
          description: (
            <>
              <h4>
                <span>单元格的文字都消失了, 想办法让文字全部显示出来.</span>
                <a
                  href="https://codesandbox.io/s/brave-pine-kki1xp?file=/src/index.tsx"
                  target="__blank"
                >
                  查看代码
                </a>
              </h4>
              <ul>
                <li>
                  <Tag>
                    列头可以 "调整" 成三个尺码: s (6px) M (66px) L (666px)
                  </Tag>
                </li>
                <li>
                  <Tag>列头10个单元格可以 "圈" 在一起</Tag>
                </li>
                <li>
                  <Tag>行头多选, 让它显示斑马纹</Tag>
                </li>
                <li>
                  <Tag>有一个数值单元格喜欢待在角落 ↑ ↓ ← →</Tag>
                </li>
                <li>
                  搞不定, 试试看看
                  <a
                    href="https://s2.antv.antgroup.com/manual/advanced/interaction/basic"
                    target="__blank"
                  >
                    基础交互
                  </a>
                  章节或试试 <Tag>长按一键三连</Tag>
                </li>
              </ul>
            </>
          ),
        }}
      />,
      document.getElementById('container'),
    );
  });
