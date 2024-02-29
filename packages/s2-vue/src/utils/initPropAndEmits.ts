import type { S2DataConfig, ThemeCfg } from '@antv/s2';
import { i18n } from '@antv/s2';
import type { Adaptive, BaseDataSet, SheetType } from '@antv/s2-shared';
import type { ExtractPropTypes, PropType } from 'vue';
import type {
  BaseDrillDownEmitKeys,
  BaseDrillDownEmits,
  BaseSheetInitEmitKeys,
  BaseSheetInitEmits,
  SheetComponentProps,
} from '../interface';

export const initBaseSheetProps = () => {
  return {
    sheetType: String as PropType<SheetType>,
    dataCfg: Object as PropType<S2DataConfig>,
    themeCfg: Object as PropType<ThemeCfg>,
    showPagination: {
      type: [Object, Boolean] as PropType<
        SheetComponentProps['showPagination']
      >,
      default: false as SheetComponentProps['showPagination'],
    },
    loading: Boolean,
    partDrillDown: Object,
    header: Object,
    options: {
      type: Object as PropType<SheetComponentProps['options']>,
      default: {} as SheetComponentProps['options'],
    },
    adaptive: {
      type: [Object, Boolean] as PropType<Adaptive>,
      default: false as Adaptive,
    },
    spreadsheet: Function as PropType<SheetComponentProps['spreadsheet']>,
    onMounted: Function as PropType<SheetComponentProps['onMounted']>,
  };
};

export const initDrillDownProps = () => {
  return {
    className: String,
    titleText: {
      type: String,
      default: i18n('选择下钻维度'),
    },
    searchText: {
      type: String,
      default: i18n('搜索字段'),
    },
    clearButtonText: {
      type: String,
      default: i18n('恢复默认'),
    },
    extra: Node,
    dataSet: {
      type: Array as PropType<BaseDataSet[]>,
      default: [],
    },
    drillFields: Array as PropType<string[]>,
    disabledFields: Array as PropType<string[]>,
    getDrillFields: Function as PropType<(drillFields: string[]) => void>,
    setDrillFields: Function as PropType<(drillFields: string[]) => void>,
  };
};

export const initDrillDownEmits = (): BaseDrillDownEmits => {
  const keys: BaseDrillDownEmitKeys[] = ['getDrillFields', 'setDrillFields'];

  return keys as unknown as BaseDrillDownEmits;
};

export type BaseSheetProps = ExtractPropTypes<
  ReturnType<typeof initBaseSheetProps>
>;

export const initBaseSheetEmits = () => {
  /** base sheet all emits */
  const keys: Array<BaseSheetInitEmitKeys> = [
    'spreadsheet',
    // ============== Row Cell ====================
    'rowCellHover',
    'rowCellClick',
    'rowCellDoubleClick',
    'rowCellContextMenu',
    'rowCellMouseDown',
    'rowCellMouseUp',
    'rowCellMouseMove',
    'rowCellCollapsed',
    'rowCellAllCollapsed',
    'rowCellScroll',

    // ============== Col Cell ====================
    'colCellHover',
    'colCellClick',
    'colCellDoubleClick',
    'colCellContextMenu',
    'colCellMouseDown',
    'colCellMouseUp',
    'colCellMouseMove',
    'colCellExpanded',
    'colCellHidden',

    // ============== Data Cell ====================
    'dataCellHover',
    'dataCellClick',
    'dataCellDoubleClick',
    'dataCellContextMenu',
    'dataCellMouseDown',
    'dataCellMouseUp',
    'dataCellMouseMove',
    'dataCellBrushSelection',
    'dataCellSelectMove',

    // ============== Corner Cell ====================
    'cornerCellHover',
    'cornerCellClick',
    'cornerCellDoubleClick',
    'cornerCellContextMenu',
    'cornerCellMouseDown',
    'cornerCellMouseUp',
    'cornerCellMouseMove',

    // ============== Merged Cells ====================
    'mergedCellsHover',
    'mergedCellsClick',
    'mergedCellsDoubleClick',
    'mergedCellsContextMenu',
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
    'beforeRender',
    'afterRender',
    'mounted',
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
    'actionIconClick',
    'contextMenu',
    'mouseHover',
    'mouseUp',
    'mouseMove',
    'mouseDown',
    'selected',
    'reset',
    'linkFieldJump',
    'click',
    'doubleClick',
    'scroll',
    'hover',
    // ============== Auto 自动生成的 ================
    'layoutAfterRealDataCellRender',
    'rowCellBrushSelection',
    'colCellBrushSelection',
  ];

  return keys as unknown as BaseSheetInitEmits;
};
