import {
  reduce,
  map,
  max,
  min,
  isNil,
  compact,
  sum,
  assign,
  size,
  set,
  includes,
  get,
  isEmpty,
  flattenDeep,
  flattenDepth,
  isNumber,
  last,
  intersection,
  every,
  each,
  find,
  has,
  difference,
  indexOf,
  filter,
  isNull,
  isUndefined,
  isArray,
} from 'lodash';
import { Aggregation, SortParams, Total, Totals } from '../common/interface';
import { DEBUG_TRANSFORM_DATA, DebuggerUtil } from '../common/debug';
import { EXTRA_FIELD } from '../common/constant';
import { SpreadSheet } from 'src/sheet-type';

interface Config {
  rows: string[];
  cols: string[];
  values: string[];
  data: DataType[];
  sortParams: SortParams;
  spreadsheet: SpreadSheet;
}

// use for single data raw or query params
type DataType = Record<string, any>;

type PivotMetaValue = {
  level: number;
  children: PivotMeta;
};

type PivotMeta = Map<string, PivotMetaValue>;

export class Pivot {
  public static CalcFunc: Record<Aggregation, (arr: number[]) => number> = {
    SUM: sum,
    MIN: min,
    MAX: max,
    AVG: (arr: number[]) => sum(arr) / arr.length,
  };

  public config: Config;

  /** 总计、小计配置 */
  public totals: Totals;

  public totalsCacheGift: Map<string, number>;

  protected data: DataType[];

  private readonly rowMeta: PivotMeta;

  private readonly colMeta: PivotMeta;

  private valRange: Map<string, [number, number]>;

  /** 排好序的维值 */
  private sortedDimValue: Map<string, Set<string>>;

  /** 未排序的维值map中间态 */
  private unSortedDimValue: Map<string, Set<string>>;

  /** 小计的缓存 */
  private totalsCache: Map<string, number>;
  /** 外部传入的totalCache */

  constructor(cfg: Partial<Config>) {
    this.config = assign(
      {
        rows: [],
        cols: [],
        data: [],
      } as Config,
      cfg,
    );
    this.rowMeta = new Map();
    this.colMeta = new Map();
    this.valRange = new Map();
    this.sortedDimValue = new Map();
    this.totalsCache = new Map();
    this.totalsCacheGift = new Map();
    DebuggerUtil.getInstance().debugCallback(DEBUG_TRANSFORM_DATA, () => {
      this.training();
      DebuggerUtil.getInstance().logger(
        `Data Size :${this.config.data?.length}`,
      );
    });
  }

  public updateTotals(totals: Totals = {}) {
    this.totals = totals;
  }

  /**
   * 获取字段排序配置
   * @param field 字段id
   */
  public getTotalsConfig(
    field: string,
  ): Pick<
    Totals['row'],
    | 'showSubTotals'
    | 'showGrandTotals'
    | 'reverseLayout'
    | 'reverseSubLayout'
    | 'label'
    | 'subLabel'
  > {
    const config = (get(
      this.totals,
      includes(this.config.rows, field) ? 'row' : 'col',
    ) || {}) as Total;
    // 设置全部增加小计 or 指定具体维度
    // subo: showSubTotals控制开关，subTotalsDimensions控制显示内容。
    const showSubTotals = config.showSubTotals
      ? includes(config.subTotalsDimensions, field)
      : false;
    return {
      showSubTotals,
      showGrandTotals: config.showGrandTotals,
      reverseLayout: config.reverseLayout,
      reverseSubLayout: config.reverseSubLayout,
      label: config.label || '总计',
      subLabel: config.subLabel || '小计',
    };
  }

  /**
   * 根据查询条件返回明细数据
   * @param query 查询条件
   */
  public getRecords(query: DataType): DataType[] {
    const { rows, cols } = this.config;
    const rowDimensionValues = this.getQueryPath(rows, query);
    const colDimensionValues = this.getQueryPath(
      cols.filter((v) => v !== EXTRA_FIELD),
      query,
    );
    const path = this.getDataPath(
      rowDimensionValues,
      colDimensionValues,
      false,
    );
    let data = size(path) ? get(this.data, path) : this.data;
    if (!isArray(data)) {
      data = [data];
    }
    // 如果存在attrs，此时record是一个数组，不需要再进行嵌套
    return compact(flattenDeep(data));
  }

  /**
   * 根据id查询字段范围
   * @param field 字段id
   */
  public getMeasureRange(field: string): [number, number] {
    return this.valRange.get(field);
  }

  /**
   * 根据条件查询字段维值
   * @param field 字段id
   * @param query 查询条件
   */
  public getDimValues(field: string, query?: DataType): string[] {
    const filterNull = (values: string[]) => {
      // '' 空label 需要保留，值去除 undefined/null
      return filter(values, (t) => !isNull(t) && !isUndefined(t));
    };
    // first row/column
    if (isEmpty(query)) {
      const values = this.sortedDimValue.get(field);
      // no field's values exist
      if (!values) {
        return [];
      }
      return this.sort(filterNull(Array.from(values)), field);
    }
    // 特殊值的处理：getDimValues("type", { type: "A" })
    if (has(query, field)) {
      return [query[field]];
    }
    const metaMap = this.getChildMeta(field, query);
    if (!metaMap) {
      return [];
    }
    return this.sort(filterNull(Array.from(metaMap.keys())), field, query);
  }

  /**
   * totalCacheGift 是外部传入的总计小计计算
   * @param cache Map<string, number>
   */
  public updateTotalCacheGift(cache: Map<string, number>): void {
    if (cache && cache.size) {
      this.totalsCacheGift = cache;
    } else {
      this.totalsCacheGift = new Map();
    }
  }

  /**
   * 重新训练
   */
  public change(cfg: Config) {
    this.constructor(assign({} as Config, this.config, cfg));
  }

  /**
   * Transform a single data to path
   * {
   * $$VALUE$$: 15
   * $$EXTRA$$: 'price'
   * "price": 15,
   * "province": "辽宁省",
   * "city": "达州市",
   * "category": "家具",
   * "subCategory": "椅子"
   * }
   * rows: [province, city]
   * columns: [category, subCategory, $$EXTRA$$]
   *
   * =>
   * rowDimensionValues = [辽宁省, 达州市]
   * colDimensionValues = [家具, 椅子, price]
   *
   * @param rowDimensionValues data's row dimension values
   * @param colDimensionValues data's column dimension values
   * @param firstCreate first create meta info
   */
  getDataPath = (
    rowDimensionValues: string[],
    colDimensionValues: string[],
    firstCreate = true,
  ): number[] => {
    const getPath = (
      firstCreate: boolean,
      dimensionValues: string[],
      isRow = true,
    ): number[] => {
      let currentMeta = isRow ? this.rowMeta : this.colMeta;
      const path = [];
      each(dimensionValues, (value) => {
        if (!currentMeta.has(value)) {
          if (firstCreate) {
            currentMeta.set(value, {
              level: currentMeta.size,
              children: new Map(),
            });
          } else {
            return path;
          }
        }
        const meta = currentMeta.get(value);
        path.push(meta.level);
        currentMeta = meta.children;
      });
      return path;
    };
    const rowPath = getPath(firstCreate, rowDimensionValues);
    const colPath = getPath(firstCreate, colDimensionValues, false);
    const result = rowPath.concat(...colPath);
    return result;
  };

  protected training() {
    const originData = this.config.data || [];
    const { rows, cols, sortParams, values } = this.config;
    this.data = [];
    this.unSortedDimValue = new Map();

    for (const line of originData) {
      const rowDimensions = this.trainingDimensions(line, rows);
      const colDimensions = this.trainingDimensions(line, cols);
      // this.trainingDimensions(line, values);
      const path = this.getDataPath(rowDimensions, colDimensions);
      if (size(path) === 0) {
        // 没有row，没有col
        path.push(0);
      }
      set(this.data, path, line);
    }
    // 对维值map进行排序处理
    each(rows.concat(cols).concat(values), (dim) => {
      const sortParam = find(sortParams, ['sortFieldId', dim]);
      const sortMap = this.unSortedDimValue.get(dim);
      // 无数据时，只有维度配置，但没有具体维值，需要容错
      if (sortParam && sortMap) {
        const sortAction = (arr: string[], defaultMultiple = 1) => {
          arr?.sort((a: string, b: string) => {
            if (isNumber(a[1]) && isNumber(b[1])) {
              // 数值比较，解决 '2' > '11' 场景
              return (a[1] - b[1]) * defaultMultiple;
            }
            if (a[1] && b[1]) {
              // 数据健全兼容，用户数据不全时，能够展示.
              return (
                a[1].toString().localeCompare(b[1].toString(), 'zh') *
                defaultMultiple
              );
            }
            return defaultMultiple;
          });
        };
        const sorted = Array.from(sortMap.keys());
        if (sortParam.sortBy && sortParam?.sortFieldId === EXTRA_FIELD) {
          sortAction(sorted);
        } else if (sortParam.sortMethod) {
          const multiple = sortParam.sortMethod === 'ASC' ? 1 : -1;
          sortAction(sorted, multiple);
        }
        this.sortedDimValue.set(dim, new Set(sorted));
      } else if (sortMap) {
        // 去掉默认升序(不排序 为了性能)
        this.sortedDimValue.set(dim, sortMap);
      }
    });
    this.unSortedDimValue.clear();
  }

  /**
   * 训练维值集合
   * @param record 聚合的明细数据
   * @param dimensions 维度id
   */
  private trainingDimensions(record: DataType, dimensions: string[]): string[] {
    return map(dimensions, (dim) => {
      const dimValue = record[dim];
      if (!this.unSortedDimValue.has(dim)) {
        this.unSortedDimValue.set(dim, new Set());
      }
      const values = this.unSortedDimValue.get(dim);
      values.add(this.getSortIndex(dim, record));
      return dimValue;
    });
  }

  private getQueryPath(dims: string[], query: DataType): string[] {
    return reduce(
      dims,
      (res: string[], id: string) => {
        res.push(query[id]);
        return res;
      },
      [],
    );
  }

  /**
   * 根据排序规则对维值进行排序
   * @param arr 所有维值
   * @param field 字段
   * @param query 查询条件
   */
  private sort(arr: string[], field: string, query?: any) {
    // todo：由于上层存在$$column$$逻辑，目前横向的按度量排序暂未实现
    const { sortParams, rows, cols, values } = this.config;
    const sortParam = find(sortParams, { sortFieldId: field });
    // 1. 查找第一个度量排序，优先按照度量排序
    const measureSort = find(sortParams, (o) =>
      includes(values, o.sortFieldId),
    );
    if (measureSort && last(rows) === field) {
      // 2.1 分组度量排序
      // 特征：字段为最内层子节点，含行维度筛选条件
      // 2.2 全局度量排序
      // 特征：字段为最内层子节点，无行维度查询条件
      // Q: 为什么是最内层
      // A: 如果是外层，最好情况下是比该类目中的最高值 or 总和？
      // Q: measureSort的合法情况
      // A: 无列维度，无列维度筛选；存在列维度，且一定包含列维度筛选
      // Q: 为什么列维度存在下，不包含筛选无法排序？
      // A: 不同列维度条件下可能导致相反的行维度排序
      // todo: 这里有不应该感知的外层逻辑，因为columns强制会是1，$$columns$$
      const isExtraValid =
        cols.length <= 1 ||
        (cols.length > 1 && every(cols, (d) => has(measureSort.query, d)));
      if (isExtraValid) {
        const { sortFieldId, sortMethod, query: extra } = measureSort;
        const j = sortMethod === 'ASC' ? 1 : -1;
        const q = assign({}, query, extra);
        // 3. 获取排好序的数据
        const records = this.getRecords(q).sort(
          (a, b) => (a[sortFieldId] - b[sortFieldId]) * j,
        );
        // 4. 得到排好序的维值数组
        const vs = map(records, field);
        const dataSet: Set<string> = new Set(vs);
        dataSet.delete(undefined);
        const sortedDims = Array.from(dataSet);
        // 由于某些维值下无数据，需要补充入最终结果
        const otherDims = difference(arr, sortedDims);

        return sortedDims.concat(otherDims);
      }
      console.warn('sort failed');
    }
    // 2.3 根据维度排序规则进行排序
    // dimValue已经是排好序的
    if (sortParam) {
      const sorted = Array.from(this.sortedDimValue.get(field));
      return intersection(sorted, arr);
    }

    return arr;
  }

  /**
   * 拼装空数据
   * @param query 查数据
   * @param insert 插入维度条件
   */
  private getBlankRecord(query: any, insert?: any) {
    const { values } = this.config;
    const t = reduce(
      values,
      (res, next) => {
        res[next] = null;
        return res;
      },
      {},
    );

    return assign({}, query, t, insert);
  }

  /**
   * 获取该字段id对应的维值的“排序值”，自定义排序的序号or维值文本
   * @param key 字段id
   * @param record 一条数据对象
   */
  private getSortIndex(key: string, record: DataType): string {
    const { sortParams } = this.config;
    const sortParam = find(sortParams, ['sortFieldId', key]);
    if (sortParam) {
      if (!isEmpty(sortParam.sortBy)) {
        // TODO sortBy need be reconstructed!!!
        // return indexOf(sortParam.sortBy, record[key]);
        return record[key];
      }
      if (sortParam.sortByField) {
        // 数值也转为文本，便于后续统一排序
        return `${record[sortParam.sortByField]}`;
      }
    }
    return record[key];
  }

  /** 获取叶子节点的meta */
  private getChildMeta(field: string, query?: DataType): PivotMeta {
    let meta;
    let dims;
    if (includes(this.config.rows, field)) {
      // field in rows
      meta = this.rowMeta;
      dims = this.config.rows;
    } else {
      // field in cols
      meta = this.colMeta;
      dims = this.config.cols;
    }
    if (meta === undefined) {
      return undefined;
    }

    const level = indexOf(dims, field);
    // eslint-disable-next-line no-restricted-syntax
    for (const dim of dims.slice(0, level)) {
      if (has(query, dim)) {
        const value = get(query, dim);
        if (meta.has(value)) {
          meta = meta.get(value).children;
          // eslint-disable-next-line no-continue
          continue;
        } else {
          return undefined;
        }
      }
    }
    return meta;
  }
}
