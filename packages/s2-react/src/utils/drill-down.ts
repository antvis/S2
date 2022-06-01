import {
  GEvent,
  HeaderActionIconProps,
  i18n,
  Node,
  PartDrillDownDataCache,
  PivotDataSet,
  S2Event,
  S2Options,
  SpreadSheet,
} from '@antv/s2';
import { clone, filter, isEmpty } from 'lodash';
import type { PartDrillDown, PartDrillDownInfo } from '../components';

export interface DrillDownParams {
  // 行维度id
  rows: string[];
  // 下钻维度
  drillFields: string[];
  spreadsheet: SpreadSheet;
  // 下钻维值显示个数
  drillItemsNum?: number;
  // 下钻维度后获取数据
  fetchData?: (meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>;
}

/** 下钻 icon 点击回调 */
export type ActionIconCallback = (params: {
  sheetInstance: SpreadSheet;
  cacheDrillFields?: string[];
  disabledFields?: string[];
  event?: GEvent;
}) => void;

export interface ActionIconParams {
  // 点击节点信息
  meta: Node;
  // 点击事件event
  event?: GEvent;
  // 下钻维度的列表组件展示
  callback: ActionIconCallback;
}

/**
 * 获取下钻缓存
 * @param spreadsheet
 * @param meta
 */
export const getDrillDownCache = (spreadsheet: SpreadSheet, meta: Node) => {
  const drillDownDataCache = spreadsheet.store.get(
    'drillDownDataCache',
    [],
  ) as PartDrillDownDataCache[];
  const cache = drillDownDataCache.find((dc) => dc.rowId === meta.id);
  return {
    drillDownDataCache,
    drillDownCurrentCache: cache,
  };
};

/**
 * 点击下钻Icon的响应
 * @param params
 */
export const handleActionIconClick = (params: ActionIconParams) => {
  const { meta, event, callback } = params;
  const { spreadsheet } = meta;

  spreadsheet.store.set('drillDownNode', meta);
  const { drillDownDataCache, drillDownCurrentCache } = getDrillDownCache(
    spreadsheet,
    meta,
  );
  const cache = drillDownCurrentCache?.drillField
    ? [drillDownCurrentCache?.drillField]
    : [];
  const disabled = [];
  // 父节点已经下钻过的维度不应该再下钻
  drillDownDataCache.forEach((val) => {
    if (meta.id.includes(val.rowId) && meta.id !== val.rowId) {
      disabled.push(val.drillField);
    }
  });
  spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_CLICK, event);
  callback({
    sheetInstance: spreadsheet,
    cacheDrillFields: cache,
    disabledFields: disabled,
    event,
  });
};

/**
 * 下钻 icon 默认展示规则
 * @param meta 节点
 * @returns
 */
const defaultDisplayCondition = (meta: Node) => {
  const iconLevel = meta.spreadsheet.dataCfg.fields.rows.length - 1;

  // 只有数值置于列头且为树状分层结构时才支持下钻
  return (
    iconLevel <= meta.level &&
    meta.spreadsheet.options.hierarchyType === 'tree' &&
    meta.spreadsheet.isValueInCols() &&
    meta.label !== i18n('总计')
  );
};

/**
 * 构造下钻功能的 s2 options
 * @param options 原始 options
 * @param partDrillDown 下钻参数
 * @param callback 下钻点击事件
 * @returns 新 options
 */
export const buildDrillDownOptions = (
  options: S2Options,
  partDrillDown: PartDrillDown,
  callback: ActionIconCallback,
): S2Options => {
  const nextHeaderIcons = options.headerActionIcons?.length
    ? [...options.headerActionIcons]
    : [];

  if (!isEmpty(partDrillDown)) {
    const drillDownActionIcon = {
      belongsCell: 'rowCell',
      iconNames: ['DrillDownIcon'],
      defaultHide: true,
      displayCondition:
        partDrillDown.displayCondition || defaultDisplayCondition,
      action: (actionIconProps: HeaderActionIconProps) => {
        const { iconName, meta, event } = actionIconProps;
        if (iconName === 'DrillDownIcon') {
          meta.spreadsheet.store.set('drillDownNode', meta);
          handleActionIconClick({
            meta,
            event,
            callback,
          });
        }
      },
    };

    nextHeaderIcons.push(drillDownActionIcon);
  }

  return {
    ...options,
    headerActionIcons: nextHeaderIcons,
  };
};

export const handleDrillDown = (params: DrillDownParams) => {
  const { fetchData, spreadsheet, drillFields, drillItemsNum } = params;
  spreadsheet.store.set('drillItemsNum', drillItemsNum);
  const meta = spreadsheet.store.get('drillDownNode');
  const { drillDownDataCache, drillDownCurrentCache } = getDrillDownCache(
    spreadsheet,
    meta,
  );
  let newDrillDownDataCache = clone(drillDownDataCache);
  // 如果当前节点已有下钻缓存，需要清除
  if (drillDownCurrentCache) {
    newDrillDownDataCache = filter(
      drillDownDataCache,
      (cache) => cache.rowId !== meta.id,
    );
  }
  fetchData(meta, drillFields).then((info) => {
    const { drillData, drillField } = info;
    (spreadsheet.dataSet as PivotDataSet).transformDrillDownData(
      drillField,
      drillData,
      meta,
    );

    if (!isEmpty(drillData)) {
      // 缓存到表实例中
      const drillLevel = meta.level + 1;
      const newDrillDownData = {
        rowId: meta.id,
        drillLevel,
        drillData,
        drillField,
      };
      newDrillDownDataCache.push(newDrillDownData);
      spreadsheet.store.set('drillDownDataCache', newDrillDownDataCache);
    }

    // 重置当前交互
    spreadsheet.interaction.reset();
    spreadsheet.render(false);
  });
};
