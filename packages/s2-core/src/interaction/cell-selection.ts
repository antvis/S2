import { Event } from '@antv/g-canvas';
import { get, noop, includes } from 'lodash';
import { isSelected } from '../utils/selected';
import { Cell } from '../cell';
import BaseSpreadSheet from '../sheet-type/base-spread-sheet';
import { HoverInteraction } from './hover-interaction';
import { ViewMeta } from '../common/interface';
import { LineChartOutlined } from '@ant-design/icons';
import { getTooltipData } from '../utils/tooltip';

/**
 * Panel Area's Cell Click Interaction
 */
export class CellSelection extends HoverInteraction {
  private target;

  constructor(spreadsheet: BaseSpreadSheet) {
    super(spreadsheet);
  }

  protected bindEvents() {
    super.bindEvents();
    this.addEventListener(document, 'click', this.onDocumentClick.bind(this));
  }

  protected start(ev: Event) {
    this.target = ev.target;
  }

  protected end(ev: Event) {
    ev.stopPropagation();
    if (this.target !== ev.target) {
      return;
    }
    const meta = this.getMetaInCell(ev.target);

    if (meta) {
      const selected = this.spreadsheet.store.get('selected');

      if (isSelected(meta.rowIndex, meta.colIndex, selected)) {
        this.spreadsheet.store.set('selected', null);
        // this.hide();
      } else {
        this.spreadsheet.store.set('selected', {
          type: 'cell',
          indexes: [meta.rowIndex, meta.colIndex],
        });
        const position = {
          x: ev.clientX,
          y: ev.clientY,
        };
        const hoveringCellData = get(meta, 'data.0');
        const isTotals = get(meta, 'isTotals', false);
        if (isTotals) {
          // 决策模式下的总小计不tooltip
          return;
        }
        const cellOperator = this.spreadsheet.options?.cellOperator;
        let operator = this.spreadsheet.options?.showTrend
          ? {
              onClick: (params) => {
                if (params === 'showTrend') {
                  // 展示趋势点击
                  this.spreadsheet.emit('spread-trend-click', meta);
                  // 隐藏tooltip
                  this.hide();
                }
              },
              menus: [
                {
                  id: 'showTrend',
                  text: '趋势',
                  icon: LineChartOutlined,
                },
              ],
            }
          : {
              onClick: noop,
              menus: [],
            };
        if (cellOperator) {
          operator = cellOperator;
        }
        const options = {
          isTotals,
          operator,
        };
        const tooltipData = getTooltipData(
          this.spreadsheet,
          hoveringCellData,
          options,
        );
        const showOptions = {
          position,
          data: tooltipData,
          options,
        };
        this.showTooltip(showOptions);
      }
    }

    this.updateCell();
  }

  private getMetaInCell(target): ViewMeta {
    const cell = target;
    if (cell instanceof Cell) {
      return cell.getMeta();
    }
    if (cell) {
      return this.getMetaInCell(cell.get('parent'));
    }
    return null;
  }

  private onDocumentClick(ev) {
    if (
      ev.target !== this.spreadsheet.container.get('el') &&
      !includes(ev.target?.className, 'eva-facet') &&
      !includes(ev.target?.className, 'ant-menu') &&
      !includes(ev.target?.className, 'ant-input')
    ) {
      this.spreadsheet.store.set('selected', null);
      this.updateCell();
      this.hide();
    }
  }

  private updateCell() {
    this.spreadsheet.getPanelAllCells((cell) => {
      cell.update();
    });
    this.draw();
  }
}
