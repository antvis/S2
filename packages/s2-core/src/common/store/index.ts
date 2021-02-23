import {
  DrillDownDataCache,
  DrillDownFieldInLevel,
  SortParam,
} from '../interface';

export interface Selected {
  type:
    | 'cell'
    | 'row'
    | 'brush'
    | 'col'
    | 'column'
    | 'row&col'
    | 'column-multiple';
  // [ 10, 5 ], [ [ 2, 5 ], [ 4, 8 ] ];
  indexes: [number | number[], number | number[]];
}

interface ReachedBorderId {
  rowId?: string;
  colId?: string;
}

/**
 * All stored keys need type define here
 */
interface StoreKey {
  // row, column, brush, cell selected
  selected: Selected;
  // horizontal scroll bar scroll x offset
  scrollX: number;
  // horizontal scroll bar scroll y offset
  scrollY: number;
  // row header scroll bar scroll x offset
  hRowScrollX: number;
  // column cell click sort params
  sortParam: SortParam;
  // corner text expand info
  cornerExpand: Record<string, number>;
  // record field values max label length
  fieldLevelMaxLabel: Record<string, number>;
  // list-sheet's field sort type(up or down)
  currentSortKey: Record<string, 'up' | 'down'>;
  // last reached border node id
  lastReachedBorderId: ReachedBorderId;
  // maker first render logic
  isInitCollapseState: boolean;
  // 行。列选中单元的id
  rowColSelectedId: string[];
  // 初次下钻icon 需要显示的 行level，用于控制哪些节点需要显示icon
  drillDownActionIconLevel: number;
  // 下钻row id 对应的数据缓存，便于清空；以及 平铺到树形切换
  drillDownDataCache: DrillDownDataCache[];
  // 每个层级下钻的维度缓存
  drillDownFieldInLevel: DrillDownFieldInLevel[];
  [key: string]: any;
}

/**
 * Store something in {@link Spreadsheet} temporary along with it's lifecycle
 * All the keys need be declare in {@see StoreKey} first
 */
export class Store {
  private store: Record<string, any> = {};

  public set<T extends keyof StoreKey>(key: string, val: StoreKey[T]) {
    this.store[key] = val;
  }

  public get<T extends keyof StoreKey>(
    key: string,
    defaultValue?: StoreKey[T],
  ): StoreKey[T] {
    const v = this.store[key];
    return v === undefined ? defaultValue : v;
  }

  public clear() {
    this.store = {};
  }
}
