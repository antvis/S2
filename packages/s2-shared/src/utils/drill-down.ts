import type {
  GEvent,
  Node,
  PartDrillDownDataCache,
  PivotDataSet,
  S2Options,
  SpreadSheet,
} from '@antv/s2';
import { S2Event, type HeaderActionIcon } from '@antv/s2';
import { clone, filter, isEmpty, size } from 'lodash';
import type { PartDrillDown, PartDrillDownInfo } from '../interface';

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

export type ActionIconCallbackParams = {
  sheetInstance: SpreadSheet;
  cacheDrillFields?: string[];
  disabledFields?: string[];
  event?: GEvent;
};

/** 下钻 icon 点击回调 */
export type ActionIconCallback = (params: ActionIconCallbackParams) => void;

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
  const disabled: string[] = [];

  // 父节点已经下钻过的维度不应该再下钻
  drillDownDataCache.forEach((val) => {
    if (meta.id.includes(val.rowId) && meta.id !== val.rowId) {
      disabled.push(val.drillField);
    }
  });
  if (event) {
    spreadsheet.emit(S2Event.GLOBAL_ACTION_ICON_CLICK, event);
  }

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
const defaultPartDrillDownDisplayCondition = (meta: Node) => {
  const s2 = meta.spreadsheet;
  const { fields } = s2.dataCfg;
  const iconLevel = size(fields.rows) - 1;

  /*
   * 当 values 为空时, 会将 dataCfg.fields.valueInCols 强制置为 false, 导致下钻 icon 不显示
   * 兼容初始 values 为空, 默认需要显示下钻 icon, 通过下钻动态改变 values 的场景  https://github.com/antvis/S2/issues/1514
   */
  const isValueInCols = !isEmpty(fields.values) ? s2.isValueInCols() : true;

  // 只有数值置于列头且为树状分层结构时才支持下钻
  return (
    iconLevel <= meta.level &&
    s2.isHierarchyTreeType() &&
    isValueInCols &&
    !meta.isGrandTotals
  );
};

/**
 * 构造下钻功能的 s2 options
 * @param options 原始 options
 * @param partDrillDown 下钻参数
 * @param callback 下钻点击事件
 * @returns 新 options
 */
export const buildDrillDownOptions = <T extends Omit<S2Options, 'tooltip'>>(
  options: T,
  partDrillDown: PartDrillDown,
  callback: ActionIconCallback,
): T => {
  const nextHeaderIcons = options?.headerActionIcons?.length
    ? [...options.headerActionIcons]
    : [];

  if (!isEmpty(partDrillDown)) {
    const drillDownActionIcon: HeaderActionIcon = {
      icons: [
        {
          name: 'DrillDownIcon',
          position: 'right',
          onClick: ({ meta, event }) => {
            meta.spreadsheet.store.set('drillDownNode', meta);
            handleActionIconClick({
              meta,
              event,
              callback,
            });
          },
        },
      ],
      belongsCell: 'rowCell',
      defaultHide: false,
      displayCondition:
        partDrillDown?.displayCondition || defaultPartDrillDownDisplayCondition,
    };

    nextHeaderIcons.push(drillDownActionIcon);
  }

  return {
    ...options,
    headerActionIcons: nextHeaderIcons,
  };
};

export const handleDrillDown = (params: DrillDownParams) => {
  const { fetchData, spreadsheet, drillFields, drillItemsNum = -1 } = params;

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

  if (!fetchData) {
    return;
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
      const newDrillDownData: PartDrillDownDataCache = {
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
