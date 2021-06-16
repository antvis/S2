import {
  DrillDownDataCache,
  DrillDownFieldInLevel,
  SortParam,
} from '../interface';
import { Node } from '@/facet/layout/node';

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
  // list-sheet's field sort type(up or down)
  currentSortKey: Record<string, 'up' | 'down'>;
  // last reached border node id
  lastReachedBorderId: ReachedBorderId;
  // 行。列选中单元的id
  rowColSelectedId: string[];
  // drill-down node id's data path map
  drillDownIdPathMap: Map<string, number[][]>;
  // drill-down node self
  drillDownNode: Node;
  // display drill-down data count
  drillItemsNum: number;

  [key: string]: any;
}

/**
 * Store something in {@link SpreadSheet} temporary along with it's lifecycle
 * All the keys need be declare in {@see StoreKey} first
 */
export class Store {
  private store: Partial<StoreKey> = {};

  public set<T extends keyof StoreKey>(key: T, val: StoreKey[T]) {
    this.store[key] = val;
  }

  public get<T extends keyof StoreKey>(
    key: T,
    defaultValue?: StoreKey[T],
  ): StoreKey[T] {
    const v = this.store[key];
    return (v as StoreKey[T]) ?? defaultValue;
  }

  public clear() {
    this.store = {};
  }
}
