import type { S2Options, S2DataConfig, ThemeCfg } from '@antv/s2';
import type { BaseSheetComponentProps, SheetType } from '@antv/s2-shared';
import type { ExtractPropTypes, PropType } from 'vue';
import type { BaseSheetInitEmitKeys, BaseSheetInitEmits } from './../interface';

export const initBaseSheetProps = () => ({
  sheetType: String as PropType<SheetType>,
  dataCfg: Object as PropType<S2DataConfig>,
  themeCfg: Object as PropType<ThemeCfg>,
  loading: Boolean,

  partDrillDown: Object,
  header: Object,

  options: {
    type: Object as PropType<S2Options>,
    default: {} as S2Options,
  },
  adaptive: {
    type: Boolean,
    default: false,
  },
  showPagination: {
    type: Boolean,
    default: false,
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
  /** base sheet extra emits */
  type ExtraEmits = {
    pageChange: (current: number) => void;
    pageShowSizeChange: (pageSize: number) => void;
  };
  type ExtraEmitKeys = keyof ExtraEmits;

  /** base sheet all emits */
  const keys: Array<BaseSheetInitEmitKeys | ExtraEmitKeys[number]> = [
    'spreadsheet',
    'getSpreadSheet',
    'pageChange',
    'pageShowSizeChange',
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
  return keys as unknown as BaseSheetInitEmits & ExtraEmits;
};
