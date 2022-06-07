import type { S2DataConfig, S2Options, ThemeCfg } from '@antv/s2';
import type {
  Adaptive,
  BaseSheetComponentProps,
  SheetType,
} from '@antv/s2-shared';
import type { ExtractPropTypes, PropType } from 'vue';
import type { BaseSheetInitEmitKeys, BaseSheetInitEmits } from './../interface';

export const initBaseSheetProps = () => ({
  sheetType: String as PropType<SheetType>,
  dataCfg: Object as PropType<S2DataConfig>,
  themeCfg: Object as PropType<ThemeCfg>,
  showPagination: {
    type: Object as PropType<BaseSheetComponentProps['showPagination']>,
    default: false as BaseSheetComponentProps['showPagination'],
  },
  loading: Boolean,
  // TODO: 待后续完善
  partDrillDown: Object,
  header: Object,

  options: {
    type: Object as PropType<S2Options>,
    default: {} as S2Options,
  },
  adaptive: {
    type: Object as PropType<Adaptive>,
    default: false as Adaptive,
  },
  onSpreadsheet: Function as PropType<BaseSheetComponentProps['spreadsheet']>,
  onGetSpreadSheet: Function as PropType<
    BaseSheetComponentProps['getSpreadSheet']
  >,
});

export type BaseSheetProps = ExtractPropTypes<
  ReturnType<typeof initBaseSheetProps>
>;

export const initBaseSheetEmits = () => {
  /** base sheet all emits */
  const keys: Array<BaseSheetInitEmitKeys> = [
    'spreadsheet',
    'getSpreadSheet',
    // ============== Row Cell ====================
    'rowCellHover',
    'rowCellClick',
    'rowCellDoubleClick',
    'rowCellMouseDown',
    'rowCellMouseUp',
    'rowCellMouseMove',
    'rowCellCollapseTreeRows',
    // ============== Col Cell ====================
    'colCellHover',
    'colCellClick',
    'colCellDoubleClick',
    'colCellMouseDown',
    'colCellMouseUp',
    'colCellMouseMove',

    // ============== Data Cell ====================
    'dataCellHover',
    'dataCellClick',
    'dataCellDoubleClick',
    'dataCellMouseDown',
    'dataCellMouseUp',
    'dataCellMouseMove',
    'dataCellTrendIconClick',
    'dataCellBrushSelection',

    // ============== Corner Cell ====================
    'cornerCellHover',
    'cornerCellClick',
    'cornerCellDoubleClick',
    'cornerCellMouseDown',
    'cornerCellMouseUp',
    'cornerCellMouseMove',

    // ============== Merged Cells ====================
    'mergedCellsHover',
    'mergedCellsClick',
    'mergedCellsDoubleClick',
    'mergedCellsMouseDown',
    'mergedCellsMouseUp',
    'mergedCellsMouseMove',

    // ============== Sort ====================
    'rangeSort',
    'rangeSorted',

    // ============== Filter ====================
    'rangeFilter',
    'rangeFiltered',

    // ============== Layout ====================
    'layoutAfterHeaderLayout',
    'layoutPagination',
    'layoutCellScroll',
    'layoutAfterCollapseRows',
    'collapseRowsAll',
    'layoutColsExpanded',
    'layoutColsHidden',
    'beforeRender',
    'afterRender',
    'destroy',

    // ============== Resize ====================
    'layoutResize',
    'layoutResizeSeriesWidth',
    'layoutResizeRowWidth',
    'layoutResizeRowHeight',
    'layoutResizeColWidth',
    'layoutResizeColHeight',
    'layoutResizeTreeWidth',
    'layoutResizeMouseDown',
    'layoutResizeMouseUp',
    'layoutResizeMouseMove',

    // ============== Global ====================
    'keyBoardDown',
    'keyBoardUp',
    'copied',
    'actionIconHover',
    'contextMenu',
    'actionIconClick',
    'mouseHover',
    'mouseUp',
    'selected',
    'reset',
    'linkFieldJump',
  ];
  return keys as unknown as BaseSheetInitEmits;
};
