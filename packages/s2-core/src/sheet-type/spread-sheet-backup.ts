// TODO  delete this file
/*import BaseSpreadSheet from './base-spread-sheet';
import {
  S2DataConfig,
  S2Options,
  SpreadSheetFacetCfg,
} from '../common/interface';
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
  ColRowMutiSelection,
} from '../interaction';
import {
  DataCellClick,
  MergedCellsClick,
  CornerTextClick,
  RowColumnClick,
  RowTextClick,
  HoverEvent,
} from '../interaction/events';
import { DetailFacet } from '../facet/detail';
import { SpreadsheetFacet } from '../facet';
import { BaseFacet } from '../facet/base-facet';
import { InteractionConstructor } from '../interaction/base';
import { EventConstructor } from '../interaction/events/base-event';
import { detectAttrsChangeAndAction } from '../utils/attrs-action';
import { PivotDataSet } from 'src/data-set';
import { InteractionNames, EventNames } from 'src/common/constant/interatcion';

/!**
 * 目前交叉表和明细的表类入口(后续会分拆出两个表)
 *!/*/
// export default class SpreadSheet extends BaseSpreadSheet {
//   public constructor(
//     dom: string | HTMLElement,
//     dataCfg: S2DataConfig,
//     options: S2Options,
//   ) {
//     super(dom, dataCfg, options);
//   }
//
//   public setOptions(options: S2Options) {
//     super.setOptions(options);
//     /**
//      * Update new spreadsheet configs {@see options}
//      * @param options
//      * @param needResetScroll
//      */
//     this.handleCollapseChangedInTreeMode(options);
//     this.handleDataSetChanged(options);
//     this.handleColLayoutTypeChanged(options);
//     this.handleChangeSize(options);
//
//     this.options = merge(
//       {
//         style: {}, // 默认对象，用户可不传
//       },
//       this.options,
//       options,
//     );
//   }
//
//   protected bindEvents() {
//     this.off(KEY_COLLAPSE_TREE_ROWS);
//     this.off(KEY_UPDATE_PROPS);
//     this.off(KEY_TREE_ROWS_COLLAPSE_ALL);
//     // collapse rows in tree mode of SpreadSheet
//     this.on(KEY_COLLAPSE_TREE_ROWS, (data) => {
//       const { id, isCollapsed } = data;
//       const style = this.options.style;
//       const options = merge({}, this.options, {
//         style: {
//           ...style,
//           collapsedRows: {
//             [id]: isCollapsed,
//           },
//         },
//       });
//       // post to x-report to store state
//       this.emit(KEY_COLLAPSE_ROWS, {
//         collapsedRows: options.style.collapsedRows,
//       });
//       this.setOptions(options);
//
//       this.render(false, () => {
//         this.emit(KEY_AFTER_COLLAPSE_ROWS, {
//           collapsedRows: options.style.collapsedRows,
//         });
//       });
//     });
//     // DI操作面板属性变化的时候，通知清空相关的数据
//     this.on(KEY_UPDATE_PROPS, () => {
//       // 清除明细表保存的排序操作信息
//       this.store.set('currentSortKey', {});
//     });
//     // 收起、展开按钮
//     this.on(KEY_TREE_ROWS_COLLAPSE_ALL, (isCollapse) => {
//       this.setOptions({
//         ...this.options,
//         hierarchyCollapse: !isCollapse,
//         style: {
//           ...this.options?.style,
//           collapsedRows: {},
//         },
//       });
//       this.render(false);
//     });
//   }
//
//   protected initFacet(facetCfg: SpreadSheetFacetCfg): BaseFacet {
//     const { mode } = this.options;
//     if (mode === 'table') {
//       // ListSheet
//       return new DetailFacet(facetCfg);
//     }
//     // SpreadSheet
//     return new SpreadsheetFacet(facetCfg);
//   }
//
//   protected initDataSet(options: Partial<S2Options>): PivotDataSet {
//     const { mode, valueInCols = true } = options;
//     // TODO table data set
//     // if (mode === 'table') {
//     //   // 明细表
//     //   return new DetailDataSet({
//     //     spreadsheet: this,
//     //     valueInCols,
//     //   });
//     // }
//     // 交叉表
//     return new PivotDataSet({
//       spreadsheet: this,
//       valueInCols,
//     });
//   }
//
//   protected initTooltip(): BaseTooltip {
//     return new BaseTooltip(this);
//   }
//
//   // TODO: registerInteraction时要key到底有没有用？目前是没有的，但是代码中一直有，有key也符合规范，但是否必须？
//   protected registerInteractions(options: S2Options) {
//     this.interactions.clear();
//     if (get(options, 'registerDefaultInteractions', true) && !isMobile()) {
//       this.registerInteraction(
//         InteractionNames.BRUSH_SELECTION_INTERACTION,
//         BrushSelection,
//       );
//       this.registerInteraction(
//         InteractionNames.COL_ROW_RESIZE_INTERACTION,
//         RowColResize,
//       );
//       this.registerInteraction(
//         InteractionNames.DATACELL_MUTI_SELECTION_INTERACTION,
//         DataCellMutiSelection,
//       );
//       this.registerInteraction(
//         InteractionNames.COL_ROW_MUTI_SELECTION_INTERACTION,
//         ColRowMutiSelection,
//       );
//     }
//   }
//
//   protected registerEvents() {
//     this.events.clear();
//     this.registerEvent(EventNames.DATACELL_CLICK_EVENT, DataCellClick);
//     this.registerEvent(EventNames.CORNER_TEXT_CLICK_EVENT, CornerTextClick);
//     this.registerEvent(EventNames.ROW_COLUMN_CLICK_EVENT, RowColumnClick);
//     this.registerEvent(EventNames.ROW_TEXT_CLICK_EVENT, RowTextClick);
//     this.registerEvent(EventNames.MERGEDCELLS_CLICK_EVENT, MergedCellsClick);
//     this.registerEvent(EventNames.HOVER_EVENT, HoverEvent);
//   }
//
//   protected registerEvent(key: string, ctc: EventConstructor) {
//     // eslint-disable-next-line new-cap
//     this.events.set(key, new ctc(this));
//   }
//
//   protected registerInteraction(key: string, ctc: InteractionConstructor) {
//     // eslint-disable-next-line new-cap
//     this.interactions.set(key, new ctc(this));
//   }
//
//   protected handleCollapseChangedInTreeMode(options: Partial<S2Options>) {
//     detectAttrsChangeAndAction(
//       options,
//       this.options,
//       'hierarchyCollapse',
//       () => {
//         if (isBoolean(options.hierarchyCollapse)) {
//           // 如果选择了默认折叠/展开，需要清除之前的折叠状态。
//           set(this, 'options.style.collapsedRows', {});
//         }
//       },
//     );
//   }
//
//   /**
//    * When spreadsheet type changed, we need re-build dataSet (ListSheet & SpreadSheet
//    * has different dataSet)
//    * @param options outside passed new options
//    * @private
//    */
//   protected handleDataSetChanged(options: Partial<S2Options>) {
//     detectAttrsChangeAndAction(
//       options,
//       this.options,
//       ['mode', 'valueInCols'],
//       () => {
//         this.dataSet = this.initDataSet(options);
//       },
//     );
//   }
//
//   /**
//    * col type changed, remove all saved rowCfg.widthByField
//    * @param options outside saved options
//    * @private
//    */
//   protected handleColLayoutTypeChanged(options: Partial<S2Options>) {
//     detectAttrsChangeAndAction(
//       options,
//       this.options,
//       'style.colCfg.colWidthType',
//       () => {
//         set(this, 'options.style.rowCfg.widthByField', {});
//         set(options, 'style.rowCfg.widthByField', {});
//       },
//     );
//   }
//
//   protected handleChangeSize(options: Partial<S2Options>) {
//     detectAttrsChangeAndAction(
//       options,
//       this.options,
//       ['width', 'height'],
//       () => {
//         this.changeSize(options.width, options.height);
//       },
//     );
//   }
// }
