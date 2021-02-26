/**
 * Create By Bruce Too
 * On 2020-06-17
 */
import BaseSpreadSheet from './base-spread-sheet';
import {
  DataCfg,
  SpreadsheetFacetCfg,
  SpreadsheetOptions,
  ViewMeta,
} from '../common/interface';
import { BaseDataSet, SpreadDataSet, DetailDataSet } from '../data-set';
import { BaseTooltip } from '../tooltip';
import * as _ from 'lodash';
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
  CellSelection,
  CornerHeaderTextClick,
  HeaderHover,
  RowColResize,
  RowColumnSelection,
  RowHeaderTextClick,
} from '../interaction';
import { ClickEvent } from '../interaction/click-event';
import { DetailFacet } from '../facet/detail';
import { SpreadsheetFacet } from '../facet';
import { SpreadParams } from '../data-set/spread-data-set';
import { BaseFacet } from '../facet/base-facet';
import { InteractionConstructor } from '../interaction/base';

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

    this.options = _.merge(
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
      const options = _.merge({}, this.options, {
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
    if (_.get(options, 'registerDefaultInteractions', true) && !isMobile()) {
      this.registerInteraction(
        'spreadsheet:row-col-selection',
        RowColumnSelection,
      );
      this.registerInteraction('spreadsheet:brush-selection', BrushSelection);
      this.registerInteraction('spreadsheet:cell-click', CellSelection);
      this.registerInteraction('spreadsheet:row-col-resize', RowColResize);
      this.registerInteraction('spreadsheet:header-hover', HeaderHover);
      this.registerInteraction(
        'spreadsheet:corner-header-text-click',
        CornerHeaderTextClick,
      );
    }
    this.registerInteraction('spreadsheet:click-event', ClickEvent);
    this.registerInteraction(
      'spreadsheet:row-header-text-click',
      RowHeaderTextClick,
    );
  }

  protected registerInteraction(key: string, ctc: InteractionConstructor) {
    // eslint-disable-next-line new-cap
    this.interactions.set(key, new ctc(this));
  }

  protected handleCollapseChangedInTreeMode(
    options: Partial<SpreadsheetOptions>,
  ) {
    if (
      options.hierarchyCollapse !==
        _.get(this, 'options.hierarchyCollapse', {}) &&
      _.isBoolean(options.hierarchyCollapse)
    ) {
      // 如果选择了默认折叠/展开，需要清除之前的折叠状态。
      _.set(this, 'options.style.collapsedRows', {});
    }
  }

  /**
   * When spreadsheet type changed, we need re-build dataSet (ListSheet & SpreadSheet
   * has different dataSet)
   * @param options outside passed new options
   * @private
   */
  protected handleDataSetChanged(options: Partial<SpreadsheetOptions>) {
    if (
      _.get(options, 'spreadsheetType') !==
        _.get(this, 'options.spreadsheetType') ||
      _.get(options, 'valueInCols') !== _.get(this, 'options.valueInCols')
    ) {
      this.dataSet = this.initDataSet(options);
    }
  }

  /**
   * col type changed, remove all saved rowCfg.widthByField
   * @param options outside saved options
   * @private
   */
  protected handleColLayoutTypeChanged(options: Partial<SpreadsheetOptions>) {
    if (
      _.get(options, 'style.colCfg.colWidthType') !==
      _.get(this, 'options.style.colCfg.colWidthType')
    ) {
      _.set(this, 'options.style.rowCfg.widthByField', {});
      _.set(options, 'style.rowCfg.widthByField', {});
    }
  }
}
