import { clone, filter, get, isEmpty, set } from 'lodash';
import {
  S2Options,
  HeaderActionIconProps,
  S2Event,
  SpreadSheet,
  Node,
  PivotDataSet,
  HeaderActionIcon,
  PartDrillDownDataCache,
  GEvent,
} from '@antv/s2';
import React from 'react';
import { PartDrillDownInfo, SheetComponentsProps } from '@/components';
import { i18n } from '@/common/i18n';

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

export interface ActionIconParams {
  // 点击节点信息
  meta: Node;
  // 点击icon类型
  iconName: string;
  // 点击事件event
  event?: GEvent;
  spreadsheet: SpreadSheet;
  // 下钻维度的列表组件展示
  callback: (
    spreadsheet: SpreadSheet,
    cacheDrillFields: string[],
    disabledFields: string[],
    event?: GEvent,
  ) => void;
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
    drillDownDataCache: drillDownDataCache,
    drillDownCurrentCache: cache,
  };
};

/**
 * 点击下钻Icon的响应
 * @param params
 */
export const handleActionIconClick = (params: ActionIconParams) => {
  const { meta, spreadsheet, event, callback, iconName } = params;

  if (iconName === 'DrillDownIcon') {
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
    callback(spreadsheet, cache, disabled, event);
  }
};

export const handleDrillDownIcon = (
  props: SheetComponentsProps,
  spreadsheet: SpreadSheet,
  callback: (
    spreadsheet: SpreadSheet,
    cacheDownDrillFields: string[],
    disabledFields: string[],
    event?: GEvent,
  ) => void,
  drillDownIconRef: React.MutableRefObject<HeaderActionIcon>,
): S2Options => {
  const nextHeaderIcons =
    props.options.headerActionIcons?.filter(
      (icon) => icon !== drillDownIconRef.current,
    ) ?? [];

  if (props?.partDrillDown) {
    let displayCondition = props.partDrillDown?.displayCondition;
    if (isEmpty(displayCondition)) {
      let iconLevel = spreadsheet.store.get('drillDownActionIconLevel', -1);
      if (iconLevel < 0) {
        // 如果没有缓存，直接默认用叶子节点的层级
        iconLevel = get(props, 'dataCfg.fields.rows.length', 1) - 1;
        // 缓存配置之初的icon层级
        spreadsheet.store.set('drillDownActionIconLevel', iconLevel);
      }
      displayCondition = (meta: Node) => {
        // 只有数值置于列头且为树状分层结构时才支持下钻
        return (
          iconLevel <= meta.level &&
          spreadsheet.options.hierarchyType === 'tree' &&
          spreadsheet.dataCfg.fields.valueInCols &&
          meta.label !== i18n('总计')
        );
      };
    }

    const drillDownActionIcon = {
      belongsCell: 'rowCell',
      iconNames: ['DrillDownIcon'],
      defaultHide: true,
      displayCondition,
      action: (actionIconProps: HeaderActionIconProps) => {
        const { iconName, meta } = actionIconProps;
        if (iconName === 'DrillDownIcon') {
          spreadsheet.store.set('drillDownNode', meta);
          handleActionIconClick({
            ...actionIconProps,
            spreadsheet,
            callback,
          });
        }
      },
    };

    drillDownIconRef.current = drillDownActionIcon;
    nextHeaderIcons.push(drillDownActionIcon);
  } else if (!props?.partDrillDown && drillDownIconRef.current) {
    // clear previous icon ref
    drillDownIconRef.current = null;
  }

  set(props.options, 'headerActionIcons', nextHeaderIcons);

  return props.options;
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
