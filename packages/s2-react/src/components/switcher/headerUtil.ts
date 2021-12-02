import {
  PivotSheet,
  S2DataConfig,
  SpreadSheet,
  TableSheet,
  Fields,
  Meta,
} from '@antv/s2';
import { filter, find, isEmpty, map, reduce } from 'lodash';
import { FieldType, SWITCHER_FIELDS } from './constant';
import { SwitcherField, SwitcherFields, SwitcherResult } from './interface';

const getSwitcherFieldCfg = (
  sheet: SpreadSheet,
  fieldKey,
): Pick<SwitcherField, 'expandable' | 'selectable'> => {
  // 内置 header 只对交叉表和明细表做处理：
  // 交叉表只有 values 可被隐藏和展开（因为它包含可衍生值）
  // 明细表只有 cols 数据，且可被隐藏
  const selectable =
    (sheet instanceof PivotSheet && fieldKey === FieldType.Values) ||
    (sheet instanceof TableSheet && fieldKey === FieldType.Cols);

  const expandable =
    sheet instanceof PivotSheet && fieldKey === FieldType.Values;
  return { selectable, expandable };
};

export const generateSwitcherFields = (
  sheet: SpreadSheet,
  { fields = {}, meta = [] } = {} as Pick<S2DataConfig, 'fields' | 'meta'>,
  hiddenColumnFields: string[] = [],
) => {
  return SWITCHER_FIELDS.reduce((config, fieldKey) => {
    const values = fields[fieldKey];
    if (isEmpty(values)) {
      return config;
    }
    const items = map(values, (id) => {
      const target = find(meta, ['field', id]);
      return {
        id,
        displayName: target?.name,
        checked: !hiddenColumnFields.includes(id),
      };
    });

    config[fieldKey] = { items, ...getSwitcherFieldCfg(sheet, fieldKey) };
    return config;
  }, {} as SwitcherFields);
};

export const generateSheetConfig = (
  sheet: SpreadSheet,
  result: SwitcherResult,
) => {
  // 交叉表需要过滤掉被隐藏的字段，而明细表不需要，明细表需要将隐藏的字段通过hiddenColumnFields返回给options
  const isTableSheet = sheet instanceof TableSheet;

  const fields = SWITCHER_FIELDS.reduce((fields, fieldKey) => {
    const items = result[fieldKey]?.items ?? [];
    const hideItems = result[fieldKey]?.hideItems ?? [];

    fields[fieldKey] = filter(
      items,
      (item) => !hideItems.find((hide) => !isTableSheet && hide.id === item.id),
    ).map((i) => i.id);

    return fields;
  }, {} as Fields);

  const hiddenColumnFields = isTableSheet
    ? result[FieldType.Cols].hideItems.map((i) => i.id)
    : undefined;

  return { fields, hiddenColumnFields };
};

export const getSwitcherFields = (result: SwitcherResult) => {
  return reduce(
    result,
    (cfg, value, field) => {
      cfg.fields[field] = map(value.items, 'id');
      cfg.hiddenFields.push(...map(value.hideItems, 'id'));
      return cfg;
    },
    {
      fields: {},
      hiddenFields: [],
    } as { fields: Fields; hiddenFields: string[] },
  );
};

export const generateSwitcherFieldsCfgFromResult = (
  sheet: SpreadSheet,
  result: SwitcherResult,
  meta: Meta[] = [],
  hiddenColumnFields: string[] = [],
) => {
  const { fields, hiddenFields } = getSwitcherFields(result);
  return generateSwitcherFields(
    sheet,
    { fields, meta },
    hiddenFields.concat(hiddenColumnFields),
  );
};
