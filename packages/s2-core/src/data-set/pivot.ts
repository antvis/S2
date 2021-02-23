import * as _ from 'lodash';
import {
  Aggregation,
  KeepOnlyIds,
  SortParams,
  Total,
  Totals,
} from '../common/interface';
import BaseSpreadsheet from '../sheet-type/base-spread-sheet';
import { DEBUG_TRAINING_DATA, DebuggerUtil } from '../common/debug';
import { EXTRA_FIELD } from '../common/constant';

interface Config {
  rows: string[];
  cols: string[];
  values: string[];
  data: DataType[];
  sortParams: SortParams;
  spreadsheet: BaseSpreadsheet;
}

// use for single data raw or query params
type DataType = Record<string, any>;

type PivotMeta = Map<
  string,
  {
    id: number;
    children: PivotMeta;
  }
>;

export class Pivot {
  public static CalcFunc: Record<Aggregation, (arr: number[]) => number> = {
    SUM: _.sum,
    MIN: _.min,
    MAX: _.max,
    AVG: (arr: number[]) => _.sum(arr) / arr.length,
  };

  public config: Config;

  /** 总计、小计配置 */
  public totals: Totals;

  public hideNodesIds: string[];

  public keepOnlyNodesIds: KeepOnlyIds;

  public totalsCacheGift: Map<string, number>;

  protected data: DataType[];

  private readonly rowMeta: PivotMeta;

  private readonly colMeta: PivotMeta;

  private valRange: Map<string, [number, number]>;

  /** 排好序的维值 */
  private sortedDimValue: Map<string, Set<string>>;

  /** 未排序的维值map中间态 */
  private unSortedDimValue: Map<string, Map<string, number | string>>;

  /** 小计的缓存 */
  private totalsCache: Map<string, number>;
  /** 外部传入的totalCache */

  constructor(cfg: Partial<Config>) {
    this.config = _.assign(
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
    DebuggerUtil.getInstance().debugCallback(DEBUG_TRAINING_DATA, () => {
      this.training();
      DebuggerUtil.getInstance().logger(
        `数据长度(小计):${(this.config.data || []).length}`,
      );
    });
  }

  public updateTotals(totals: Totals = {}) {
    this.totals = totals;
  }

  public updateHideNodesIds(hideNodesIds: string[]) {
    this.hideNodesIds = hideNodesIds;
  }

  public updateKeepOnlyNodesIds(keepOnlyNodesIds: KeepOnlyIds) {
    this.keepOnlyNodesIds = keepOnlyNodesIds;
  }

  public getHideNodesIds(): string[] {
    return this.hideNodesIds;
  }

  public getKeepOnlyNodesIds(): KeepOnlyIds {
    return this.keepOnlyNodesIds;
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
    const config = (_.get(
      this.totals,
      _.includes(this.config.rows, field) ? 'row' : 'col',
    ) || {}) as Total;
    // 设置全部增加小计 or 指定具体维度
    // subo: showSubTotals控制开关，subTotalsDimensions控制显示内容。
    const showSubTotals = config.showSubTotals
      ? _.includes(config.subTotalsDimensions, field)
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
  public getRecords(query?: DataType): DataType[] {
    const { rows, cols } = this.config;
    if (_.isEmpty(query)) {
      // 返回全部数据
      return _.compact(_.flattenDeep(this.data));
    }
    const getRowPath = this.getPath(this.rowMeta, false);
    const rowPath = getRowPath(this.getQueryPath(rows, query));
    const getColPath = this.getPath(this.colMeta, false);
    const colPath = getColPath(this.getQueryPath(cols, query));

    if (_.isEmpty(colPath) && _.isEmpty(rowPath)) {
      return [];
    }

    // 如果查询条件错误，则返回无结果
    if (_.includes(colPath, undefined) || _.includes(rowPath, undefined)) {
      return [];
    }

    const data = this.getDataByPath(this.data, rowPath);

    // 交叉图（离散 x 连续）场景，需要补充空值
    // 1. 行维度为类目轴
    if (rowPath.length === rows.length - 1 && colPath.length === cols.length) {
      const last = _.last(rows);
      const meta = this.getChildMeta(last, query);
      const dimValues = meta ? meta.keys() : [];
      const records = _.map(data, (o, i) => {
        const r = this.getDataByPath(o, colPath);
        if (_.isNil(r)) {
          return this.getBlankRecord(query, { [last]: dimValues[i] });
        }
        return r;
      });
      return records;
    }
    // 2. 列维度为类目轴
    if (rowPath.length === rows.length && colPath.length === cols.length - 1) {
      const last = _.last(cols);
      const meta = this.getChildMeta(last, query);
      const dimValues = meta ? meta.keys() : [];
      const arr = this.getDataByPath(data, colPath);
      const records = _.map(arr, (o, i) => {
        if (_.isNil(o)) {
          return this.getBlankRecord(query, { [last]: dimValues[i] });
        }
        return o;
      });
      return records;
    }
    // 3. 交叉表，只会有一条数据
    if (rowPath.length === rows.length && colPath.length === cols.length) {
      const record =
        this.getDataByPath(data, colPath) || this.getBlankRecord(query);
      // 如果存在attrs，此时record是一个数组，不需要再进行嵌套
      return [].concat(record);
    }
    // 4. 不需要补空值时，小计、排序场景
    const dataByRow =
      rowPath.length < rows.length
        ? _.flattenDepth(data, rows.length - rowPath.length - 1)
        : [data];
    const dataArr = _.map(dataByRow, (o) => this.getDataByPath(o, colPath));
    const depth = cols.length - colPath.length;
    return _.compact(_.flattenDepth(dataArr, depth));
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
    // first row/column
    if (_.isEmpty(query)) {
      const values = this.sortedDimValue.get(field);
      // no field's values exist
      if (!values) {
        return [];
      }
      return this.sort(Array.from(values), field);
    }
    // 特殊值的处理：getDimValues("type", { type: "A" })
    if (_.has(query, field)) {
      return [query[field]];
    }
    const map = this.getChildMeta(field, query);
    if (!map) {
      return [];
    }
    return this.sort(Array.from(map.keys()), field, query);
  }

  public getAttr(attr) {
    return this[attr];
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
   * 根据条件查询字段小计
   * @param field 获取小计的字段
   * @param query 查询条件
   * @param calc
   */
  public getTotals(
    field: string,
    query?: DataType,
    calc: Aggregation = 'SUM',
  ): number {
    const { rows, cols } = this.config;
    const getRowPath = this.getPath(this.rowMeta, false);
    const rowPath = getRowPath(this.getQueryPath(rows, query));
    const getColPath = this.getPath(this.colMeta, false);
    const colPath = getColPath(this.getQueryPath(cols, query));
    const cacheKey = `${rowPath.join('.')}-${colPath.join(
      '.',
    )}.${field}.${calc}`;

    let s: number;
    if (
      this.totalsCacheGift &&
      this.totalsCacheGift.size &&
      this.totalsCacheGift.has(cacheKey)
    ) {
      // 后端计算总计小计总出问题，用户投诉了，所以如果后端计算失败，前端保底。
      return this.totalsCacheGift.get(cacheKey);
    }
    if (this.totalsCache.has(cacheKey)) {
      s = this.totalsCache.get(cacheKey);
    } else {
      const records = this.getRecords(query);
      if (records) {
        s = (Pivot.CalcFunc[calc] || Pivot.CalcFunc.SUM).call(
          null,
          // 修复小计总计平均值计算包含空数值场景。
          _.compact(
            _.map(records, (record) => {
              const v = record[field];
              return _.isNil(v) ? null : Number.parseFloat(v);
            }),
          ),
        );
        /**
         * 简单处理小数精度误差，最好由业务层formatter统一处理
         * 技术细节：https://juejin.im/post/5ce373d651882532e409ea96
         */
        s = Number.parseFloat((s || 0).toPrecision(16));
      } else {
        s = NaN;
      }
      this.totalsCache.set(cacheKey, s);
    }
    return s;
  }

  /**
   * 重新训练
   */
  public change(cfg: Config) {
    this.constructor(_.assign({} as Config, this.config, cfg));
  }

  /**
   * 详细设计参考：https://yuque.antfin-inc.com/eva-engine/specs/smkh2g
   */
  protected training() {
    const data = this.config.data || [];
    const { rows, cols, sortParams, values } = this.config;
    this.data = [];
    const getRowPath = this.getPath(this.rowMeta);
    const getColPath = this.getPath(this.colMeta);
    this.unSortedDimValue = new Map();

    // eslint-disable-next-line no-restricted-syntax
    for (const line of data) {
      const rowArr = this.trainingDim(line, rows);
      const colArr = this.trainingDim(line, cols);
      this.trainingDim(line, values);
      const rowPath = getRowPath(rowArr);
      const colPath = getColPath(colArr);
      const path = rowPath.concat(colPath);
      if (_.size(path) === 0) {
        // 没有row，没有col
        path.push(0);
      }
      _.set(this.data, path, line);
    }
    // 对维值map进行排序处理
    _.each(rows.concat(cols).concat(values), (dim) => {
      const sortParam = _.find(sortParams, ['sortFieldId', dim]);
      const map = this.unSortedDimValue.get(dim);
      // 无数据时，只有维度配置，但没有具体维值，需要容错
      if (sortParam && map) {
        const sorted = Array.from(map.entries());
        if (sortParam.sortBy && sortParam?.sortFieldId === EXTRA_FIELD) {
          // 目前用在values的排序显示中(字段域的排序)
          sorted.sort(
            (a: [string, number], b: [string, number]) => a[1] - b[1],
          );
        } else if (sortParam.sortMethod) {
          const j = sortParam.sortMethod === 'ASC' ? 1 : -1;
          sorted.sort((a: [string, string], b: [string, string]) => {
            if (_.isNumber(a[1]) && _.isNumber(b[1])) {
              // 数值比较，解决 '2' > '11' 场景
              return (a[1] - b[1]) * j;
            }
            if (a[1] && b[1]) {
              // 数据健全兼容，用户数据不全时，能够展示.
              return a[1].toString().localeCompare(b[1].toString(), 'zh') * j;
            }
            return j;
          });
        }
        this.sortedDimValue.set(dim, new Set(_.map(sorted, 0)));
      } else if (map) {
        // 去掉默认升序(不排序 为了性能)
        this.sortedDimValue.set(dim, new Set(map.keys()));
      }
    });
    this.unSortedDimValue.clear();
  }

  /**
   * 训练维值集合
   * @param record 聚合的明细数据
   * @param dims 维度id
   */
  private trainingDim(record: DataType, dims: string[]): string[] {
    return _.map(dims, (dim) => {
      const dimValue = record[dim];
      if (!this.unSortedDimValue.has(dim)) {
        this.unSortedDimValue.set(dim, new Map());
      }
      const m = this.unSortedDimValue.get(dim);
      if (!m.has(dimValue)) {
        m.set(dimValue, this.getSortIndex(dim, record));
      }
      return dimValue;
    });
  }

  /** 获取树的节点路径，如果不存在该节点则初始化 */
  private getPath(map: PivotMeta, upsert = true) {
    return function (dimValues: string[]): number[] {
      const res = [];
      let cursor = map;

      // eslint-disable-next-line no-restricted-syntax
      for (const key of dimValues) {
        if (!cursor.has(key)) {
          if (upsert) {
            cursor.set(key, {
              id: cursor.size,
              children: new Map(),
            });
          } else {
            res.push(undefined);
            return res;
          }
        }
        const o = cursor.get(key);
        res.push(o.id);
        cursor = o.children;
      }
      return res;
    };
  }

  private getQueryPath(dims: string[], query: DataType): string[] {
    return _.reduce(
      dims,
      (res: string[], id: string) => {
        if (query && _.has(query, id)) {
          res.push(query[id]);
        }
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
    const sortParam = _.find(sortParams, { sortFieldId: field });
    // 1. 查找第一个度量排序，优先按照度量排序
    const measureSort = _.find(sortParams, (o) =>
      _.includes(values, o.sortFieldId),
    );
    if (measureSort && _.last(rows) === field) {
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
        (cols.length > 1 && _.every(cols, (d) => _.has(measureSort.query, d)));
      if (isExtraValid) {
        const { sortFieldId, sortMethod, query: extra } = measureSort;
        const j = sortMethod === 'ASC' ? 1 : -1;
        const q = _.assign({}, query, extra);
        // 3. 获取排好序的数据
        const records = this.getRecords(q).sort(
          (a, b) => (a[sortFieldId] - b[sortFieldId]) * j,
        );
        // 4. 得到排好序的维值数组
        const vs = _.map(records, field);
        const set: Set<string> = new Set(vs);
        set.delete(undefined);
        const sortedDims = Array.from(set);
        // 由于某些维值下无数据，需要补充入最终结果
        const otherDims = _.difference(arr, sortedDims);

        return sortedDims.concat(otherDims);
      }
      console.warn('sort failed');
    }
    // 2.3 根据维度排序规则进行排序
    // dimValue已经是排好序的
    if (sortParam) {
      const sorted = Array.from(this.sortedDimValue.get(field));
      return _.intersection(sorted, arr);
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
    const t = _.reduce(
      values,
      (res, next) => {
        res[next] = null;
        return res;
      },
      {},
    );

    return _.assign({}, query, t, insert);
  }

  /**
   * 获取该字段id对应的维值的“排序值”，自定义排序的序号or维值文本
   * @param key 字段id
   * @param record 一条数据对象
   */
  private getSortIndex(key: string, record: DataType): number | string {
    const { sortParams } = this.config;
    const sortParam = _.find(sortParams, ['sortFieldId', key]);
    if (sortParam) {
      if (!_.isEmpty(sortParam.sortBy)) {
        return _.indexOf(sortParam.sortBy, record[key]);
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
    if (_.includes(this.config.rows, field)) {
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

    const level = _.indexOf(dims, field);
    // eslint-disable-next-line no-restricted-syntax
    for (const dim of dims.slice(0, level)) {
      if (_.has(query, dim)) {
        const value = _.get(query, dim);
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

  /**
   * lodash get的业务化封装，让行为与@antv/util一致
   * @antv/util, get(o, []) => o
   * lodash, get(o, []) => undefined，因为它无法区分'[]'等空值做key的场景
   */
  private getDataByPath(data: any, path: number[]) {
    return _.size(path) ? _.get(data, path) : data;
  }
}
