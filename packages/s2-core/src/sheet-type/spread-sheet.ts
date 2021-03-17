import BaseSpreadSheet from './base-spread-sheet';
import {
  DataCfg,
  SpreadsheetFacetCfg,
  SpreadsheetOptions,
} from '../common/interface';
import { BaseDataSet, SpreadDataSet, DetailDataSet } from '../data-set';
import { BaseTooltip } from '../tooltip';
import { get, set, isBoolean, merge } from 'lodash';
import {
  KEY_AFTER_COLLAPSE_ROWS,
  KEY_COLLAPSE_ROWS,
  KEY_COLLAPSE_TREE_ROWS,
  KEY_TREE_ROWS_COLLAPSE_ALL,
  KEY_UPDATE_PROPS,
} from '../common/constant';
import { isMobile } from '../utils/is-mobile';
import {
  BrushSelection,
  RowColResize,
  DataCellMutiSelection,
  ColRowMutiSelection
} from '../interaction';
import {
  DataCellClick,
  CornerTextClick,
  RowColumnClick,
  RowTextClick,
} from '../interaction/events';
import { DetailFacet } from '../facet/detail';
import { SpreadsheetFacet } from '../facet';
import { SpreadParams } from '../data-set/spread-data-set';
import { BaseFacet } from '../facet/base-facet';
import { InteractionConstructor } from '../interaction/base';
import { EventConstructor } from '../interaction/events/base-event';
import { detectAttrsChangeAndAction } from '../utils/attrs-action';

/**
 * 目前交叉表和明细的表类入口(后续会分拆出两个表)
 */
export default class SpreadSheet extends BaseSpreadSheet {
  public constructor(
    dom: string | HTMLElement,
    dataCfg: DataCfg,
    options: SpreadsheetOptions,
  ) {
    super(dom, dataCfg, options);
  }

  public setOptions(options: SpreadsheetOptions) {
    super.setOptions(options);
    /**
     * Update new spreadsheet configs {@see options}
     * @param options
     * @param needResetScroll
     */
    this.handleCollapseChangedInTreeMode(options);
    this.handleDataSetChanged(options);
    this.handleColLayoutTypeChanged(options);
    this.handleChangeSize(options);

    this.options = merge(
      {
        style: {}, // 默认对象，用户可不传
      },
      this.options,
      options,
    );
  }

  protected bindEvents() {
    this.off(KEY_COLLAPSE_TREE_ROWS);
    this.off(KEY_UPDATE_PROPS);
    this.off(KEY_TREE_ROWS_COLLAPSE_ALL);
    // collapse rows in tree mode of SpreadSheet
    this.on(KEY_COLLAPSE_TREE_ROWS, (data) => {
      const { id, isCollapsed } = data;
      const style = this.options.style;
      const options = merge({}, this.options, {
        style: {
          ...style,
          collapsedRows: {
            [id]: isCollapsed,
          },
        },
      });
      // post to x-report to store state
      this.emit(KEY_COLLAPSE_ROWS, {
        collapsedRows: options.style.collapsedRows,
      });
      this.setOptions(options);

      this.needUseCacheMeta = true;
      this.render(false, () => {
        this.emit(KEY_AFTER_COLLAPSE_ROWS, {
          collapsedRows: options.style.collapsedRows,
        });
      });
    });
    // DI操作面板属性变化的时候，通知清空相关的数据
    this.on(KEY_UPDATE_PROPS, () => {
      // 清除明细表保存的排序操作信息
      this.store.set('currentSortKey', {});
    });
    // 收起、展开按钮
    this.on(KEY_TREE_ROWS_COLLAPSE_ALL, (isCollapse) => {
      this.setOptions({
        ...this.options,
        hierarchyCollapse: !isCollapse,
        style: {
          ...this.options?.style,
          collapsedRows: {},
        },
      });
      this.needUseCacheMeta = true;
      this.render(false);
    });
  }

  protected initFacet(facetCfg: SpreadsheetFacetCfg): BaseFacet {
    const { spreadsheetType } = this.options;
    if (!spreadsheetType) {
      // ListSheet
      return new DetailFacet(facetCfg);
    }
    // SpreadSheet
    return new SpreadsheetFacet(facetCfg);
  }

  protected initDataSet(
    options: Partial<SpreadsheetOptions>,
  ): BaseDataSet<SpreadParams> {
    const { spreadsheetType, valueInCols = true } = options;
    if (!spreadsheetType) {
      // 明细表
      return new DetailDataSet({
        spreadsheet: this,
        valueInCols,
      });
    }
    // 交叉表
    return new SpreadDataSet({
      spreadsheet: this,
      valueInCols,
    });
  }

  protected initTooltip(): BaseTooltip {
    return new BaseTooltip(this);
  }

  protected registerInteractions(options: SpreadsheetOptions) {
    this.interactions.clear();
    if (get(options, 'registerDefaultInteractions', true) && !isMobile()) {
      this.registerInteraction('spreadsheet:brush-selection', BrushSelection);
      this.registerInteraction('spreadsheet:row-col-resize', RowColResize);
      this.registerInteraction(
        'spreadsheet:datacell-muti-selection',
        DataCellMutiSelection,
      );
      this.registerInteraction(
        'spreadsheet:col-row-muti-selection',
        ColRowMutiSelection,
      );
    }
  }

  protected registerEvents() {
    this.events.clear();
    this.registerEvent('spreadsheet:data-cell-click', DataCellClick);
    this.registerEvent('spreadsheet:corner-text-click', CornerTextClick);
    this.registerEvent('spreadsheet:row-column-click', RowColumnClick);
    this.registerEvent('spreadsheet:row-text-click', RowTextClick);
  }

  protected registerEvent(key: string, ctc: EventConstructor) {
    // eslint-disable-next-line new-cap
    this.events.set(key, new ctc(this));
  }

  protected registerInteraction(key: string, ctc: InteractionConstructor) {
    // eslint-disable-next-line new-cap
    this.interactions.set(key, new ctc(this));
  }

  protected handleCollapseChangedInTreeMode(
    options: Partial<SpreadsheetOptions>,
  ) {
    detectAttrsChangeAndAction(
      options,
      this.options,
      'hierarchyCollapse',
      () => {
        if (isBoolean(options.hierarchyCollapse)) {
          // 如果选择了默认折叠/展开，需要清除之前的折叠状态。
          set(this, 'options.style.collapsedRows', {});
        }
      },
    );
  }

  /**
   * When spreadsheet type changed, we need re-build dataSet (ListSheet & SpreadSheet
   * has different dataSet)
   * @param options outside passed new options
   * @private
   */
  protected handleDataSetChanged(options: Partial<SpreadsheetOptions>) {
    detectAttrsChangeAndAction(
      options,
      this.options,
      ['spreadsheetType', 'valueInCols'],
      () => {
        this.dataSet = this.initDataSet(options);
      },
    );
  }

  /**
   * col type changed, remove all saved rowCfg.widthByField
   * @param options outside saved options
   * @private
   */
  protected handleColLayoutTypeChanged(options: Partial<SpreadsheetOptions>) {
    detectAttrsChangeAndAction(
      options,
      this.options,
      'style.colCfg.colWidthType',
      () => {
        set(this, 'options.style.rowCfg.widthByField', {});
        set(options, 'style.rowCfg.widthByField', {});
      },
    );
  }

  protected handleChangeSize(options: Partial<SpreadsheetOptions>) {
    detectAttrsChangeAndAction(
      options,
      this.options,
      ['width', 'height'],
      () => {
        this.changeSize(options.width, options.height);
      },
    );
  }
}
