import { isArray, isEmpty, each, get, uniq, identity, find } from 'lodash';
import { BaseDataSet, BaseParams } from './base-data-set';
import { i18n } from '../common/i18n';
import {
  S2DataConfig,
  DerivedValue,
  Formatter,
  Meta,
} from '../common/interface';
import { auto } from '../index';
import { processIrregularData } from '../utils/get-irregular-data';
import { EXTRA_FIELD, TOTAL_VALUE, VALUE_FIELD } from '../common/constant';
import { DebuggerUtil } from 'src/common/debug';
export interface SpreadParams extends BaseParams {
  valueInCols: boolean;
}
/**
 * DataSet
 * 交叉表的数据集处理
 */
export class SpreadDataSet extends BaseDataSet<SpreadParams> {
  protected valueInCols: boolean;

  constructor(params: SpreadParams) {
    super(params);
    this.valueInCols = params.valueInCols;
  }

  /**
   * 获得字段名称
   * @param field
   */
  public getFieldFormatter(field: string): Formatter {
    // 兼容总计小计场景
    if (field === TOTAL_VALUE) {
      let valueField;
      if (isArray(this.fields.values)) {
        valueField = get(this, 'fields.values.0');
      } else {
        valueField = get(this, 'fields.values.valueField');
      }
      return get(this.getFieldMeta(valueField), 'formatter', identity);
    }
    return get(this.getFieldMeta(field), 'formatter', identity);
  }

  handleValues = (values: string[], derivedValues: DerivedValue[]) => {
    const tempValue = [];
    each(values, (v) => {
      const findOne = find(derivedValues, (dv) => dv.valueField === v);
      if (findOne) {
        // 值存在衍生值，添加值和所有衍生值,或者第一个衍生值
        tempValue.push(v);
        // 全部展示衍生值 -- 跟进需要展示的衍生指标来决定添加多少列
        // 优先展示部分衍生值（如果有） -- 优先值
        const dvs = findOne.displayDerivedValueField;
        tempValue.push(...dvs);
      } else {
        // 值不存在衍生值，只需要添加值
        tempValue.push(v);
      }
    });
    return tempValue;
  };

  /**
   * Determine where values placed in, and how to layout row header
   * by @link valueInCols
   * 1、value in cols(default) -- valueInCols = false
   * 2、value in rows -- valueInCols = true
   * 3、value replace all rows(strategy status) -- fields.rows is empty
   * @param dataCfg
   */
  protected preProcess(dataCfg: S2DataConfig): S2DataConfig {
    const newDataCfg = processIrregularData(dataCfg);

    const { data, meta = [], fields, sortParams = [] } = newDataCfg;
    const { columns, rows, values, derivedValues } = fields;

    let newColumns = columns;
    let newRows = rows;
    let newSortParams: S2DataConfig['sortParams'] = sortParams;
    let newValues = values;
    if (this.valueInCols) {
      // value in cols
      // 总计存在时可能导致数据重复
      newColumns = uniq([...columns, EXTRA_FIELD]);
      /*
       * 普通模式下，值挂在列时，需要将衍生指标作为新的列来渲染
       * 分两个情况
       * 1、全部平铺，就所有衍生指标展开显示
       * [主指标1，衍生指标11，衍生指标12 - 主指标2，衍生指标21，衍生指标22]
       * 2、仅展示部分衍生指标（displayDerivedValueField），其他的以...显示
       */
      if (isArray(values)) {
        newValues = this.handleValues(values, derivedValues);
      }
    } else {
      // value in rows
      // TODO 值挂在行头时，衍生指标是按决策显示的方式显示在单元格中
      newRows = [...rows, EXTRA_FIELD];
    }
    // 新增的字段按照值域字段顺序排序
    if (isArray(newValues)) {
      newSortParams = sortParams.concat({
        sortFieldId: EXTRA_FIELD,
        sortBy: newValues,
      });
    }

    // 3、meta 中添加新的字段信息（度量别名设置）
    const enumAlias = new Map<string, string>();

    each(newValues, (value: string) => {
      // tslint:disable-next-line:no-shadowed-variable
      const m = find(meta, (mt: Meta) => mt.field === value);
      enumAlias.set(value, get(m, 'name', value));
    });

    const newMeta = [
      ...meta,
      // 虚拟列字段，为文本分类字段，格式化为字段值的别名
      {
        field: EXTRA_FIELD,
        name: i18n('数值'),
        formatter: (v) => enumAlias.get(v), // 格式化
      } as Meta,
      // 小计字段，为数值连续字段，格式化为自动数值格式化
      {
        field: TOTAL_VALUE,
        name: i18n('小计'),
        formatter: (v) => auto(v),
      } as Meta,
    ];

    // 4. 数据按照 newValues 字段扩展成 newColumnName 字段
    // 将原一条数据，转化成 newValues.length 条数据
    const newData = [];
    console.log(`pre data -> ${JSON.stringify(data)}`);
    // eslint-disable-next-line no-restricted-syntax
    for (const datum of data) {
      if (!isEmpty(newValues)) {
        each(newValues, (value: string) => {
          newData.push({
            ...datum,
            [EXTRA_FIELD]: value, // getFieldName(row, meta), // 替换为字段名称
            [VALUE_FIELD]: datum[value],
          });
        });
      } else {
        newData.push({
          ...datum,
        });
      }
    }
    console.log(`after data -> ${JSON.stringify(newData)}`);
    // 返回新的结构
    return {
      data: newData,
      meta: newMeta,
      fields: {
        ...fields,
        rows: newRows,
        columns: newColumns,
        values: newValues,
      },
      sortParams: newSortParams,
    };
  }
}
