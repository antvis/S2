/**
 * Create By Bruce Too
 * On 2020-12-13
 */
import {
  DrillDownDataCache,
  DrillDownFieldInLevel,
  SpreadsheetOptions,
} from '../../common/interface';
import { DrillDownLayout } from './drill-down-layout';
import { PartDrillDownInfo, SpreadsheetProps } from '../../components/index';
import { BaseSpreadSheet } from '../../sheet-type';
import {
  merge,
  concat,
  isEmpty,
  clone,
  isEqual,
  includes,
  divide,
} from 'lodash';

import { Node } from '../../index';

export interface ActionIconParams {
  // 点击节点信息
  meta: Node;
  // 点击icon类型
  iconType: string;
  // 点击事件event
  event: Event;
  spreadsheet: BaseSpreadSheet;
  // 下钻维度的列表组件展示
  callback: (
    event: Event,
    spreadsheet: BaseSpreadSheet,
    cashDrillFields: string[],
  ) => void;
}

export interface DrillDownParams {
  // 行维度id
  rows: string[];
  // 下钻维度
  drillFields: string[];
  spreadsheet: BaseSpreadSheet;
  // 下钻维度后获取数据
  fetchData?: (meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>;
}

/**
 * 清空下钻的信息！
 * 按照rowId来清空
 * 1、清空此该id以及其子id可能存在的所有数据缓存 drillDownDataCache
 * 2、更新「level-维度」维度缓存的信息(只保留存在数据的level) drillDownFieldInLevel
 * @param spreadsheet
 * @param rowId 如果有rowId,按照rowId 清理，如果没有，全部清空
 */
export const ClearDrillDownInfo = (
  spreadsheet: BaseSpreadSheet,
  rowId?: string,
) => {
  if (rowId) {
    // 清空指定的下钻维度，逻辑就恶心了，处理如下
    // 1. 清空rowId对应的数据缓存(需要考虑rowId的子节点是否有下钻)
    const drillDownDataCache = spreadsheet.store.get(
      'drillDownDataCache',
      [],
    ) as DrillDownDataCache[];
    const deleteDataCache = drillDownDataCache.find((d) => d?.rowId === rowId);
    if (deleteDataCache) {
      // 存在需要被删除的数据，进一步去确定子节点是否有下钻，需要一并删除此节点下的所有自定义下钻
      const rowNode = spreadsheet.getRowNodes().find((n) => n.id === rowId);
      const allChildrenIds = Node.getAllChildrenNode(rowNode).map((n) => n.id);
      // 节点本身 & 包含在子节点中 需要被过滤
      const restDataCache = drillDownDataCache.filter(
        (d) => d?.rowId !== rowId && !includes(allChildrenIds, d?.rowId),
      );
      spreadsheet.store.set('drillDownDataCache', restDataCache);

      // 2. 从剩下缓存中找到哪些level还存在数据，去除掉不存在数据的层级 更新drillDownFieldInLevel
      const restDrillLevels = restDataCache.map((c) => c.drillLevel);
      const drillDownFieldInLevel = spreadsheet.store.get(
        'drillDownFieldInLevel',
        [],
      ) as DrillDownFieldInLevel[];
      const restFieldInLevel = drillDownFieldInLevel.filter((d) =>
        includes(restDrillLevels, d?.drillLevel),
      );
      spreadsheet.store.set('drillDownFieldInLevel', restFieldInLevel);
    } else {
      console.error(`No drill-down info exist in this ${rowId}`);
    }
  } else {
    // 清空所有的下钻信息
    spreadsheet.store.set('drillDownDataCache', []);
    spreadsheet.store.set('drillDownFieldInLevel', []);
  }
};

/**
 * 处理自定义layout(用于隐藏空节点),缓存外部的，替换为内部实现
 * @param options
 * @constructor
 */
export const UseDrillDownLayout = (options: SpreadsheetOptions) => {
  // 缓存外部的layout到options变量
  // eslint-disable-next-line no-param-reassign
  options.otterLayout = options.layout;
  // 替换下钻的layout为内部默认
  // eslint-disable-next-line no-param-reassign
  options.layout = DrillDownLayout;
};

/**
 * 获取下钻缓存
 * @param spreadsheet
 * @param meta
 */
const getDrillDownCash = (spreadsheet: BaseSpreadSheet, meta: Node) => {
  const drillDownDataCache = spreadsheet.store.get(
    'drillDownDataCache',
    [],
  ) as DrillDownDataCache[];
  const cache = drillDownDataCache.find((dc) => dc.rowId === meta.id);
  return {
    drillDownDataCache,
    drillDownCurrentCash: cache,
  };
};

/**
 * 点击下钻Icon的响应
 * @param params
 */
export const HandleActionIconClick = (params: ActionIconParams) => {
  const { meta, spreadsheet, event, callback, iconType } = params;
  if (iconType === 'DrillDownIcon') {
    spreadsheet.store.set('drillMeta', meta);
    const { drillDownCurrentCash } = getDrillDownCash(spreadsheet, meta);
    const cache = drillDownCurrentCash?.drillField
      ? [drillDownCurrentCash?.drillField]
      : [];
    callback(event, spreadsheet, cache);
  }
};

/**
 * 如果有下钻的配置，将配置映射到表内部
 * @param props
 * @param spreadsheet
 * @param callback
 * @constructor
 */
export const HandleOptions = (
  props: SpreadsheetProps,
  spreadsheet: BaseSpreadSheet,
  callback: (
    event: MouseEvent,
    spreadsheet: BaseSpreadSheet,
    cashDownDrillFields: string[],
  ) => void,
): SpreadsheetOptions => {
  if (props.partDrillDown) {
    const { open } = props.partDrillDown;
    if (open) {
      let iconLevel = spreadsheet.store.get('drillDownActionIconLevel', -1);
      if (iconLevel < 0) {
        // 如果没有缓存，直接默认用叶子节点的层级
        iconLevel = props.dataCfg.fields.rows.length - 1;
        // 缓存配置之初的icon层级
        spreadsheet.store.set('drillDownActionIconLevel', iconLevel);
      }
      return merge({}, props.options, {
        rowActionIcons: {
          iconTypes: ['DrillDownIcon'],
          display: {
            level: iconLevel,
            operator: '>=',
          },
          action: (iconType: string, meta: Node, event: Event) => {
            HandleActionIconClick({
              iconType,
              meta,
              event,
              spreadsheet,
              callback,
            });
          },
        },
      });
    }
  }
  return props.options;
};

/**
 * 选择下钻维度后的处理（以数据为标准，只有在数据不为空时，才会生效）
 * 1、同一个level点击
 *   - 已有rowId(下钻过)
 *     - 下钻维度相同 -- 直接不处理？
 *     - 下钻维度不同 -- 替换为新维度？
 *   - 没有rowId(没下钻过)
 *     - 下钻维度相同 -- 直接下钻
 *     - 下钻维度不同 -- 存在level维度冲突，清除之前的下钻？
 * 2、不同level点击
 *   - rowId肯定未点击过
 *     - 下钻维度    -- 直接下钻
 * @param params
 */
export const HandleDrillDown = (params: DrillDownParams) => {
  const { rows, fetchData, spreadsheet, drillFields } = params;
  const meta = spreadsheet.store.get('drillMeta');
  // 点击局部数据下钻(能走到这里逻辑，partDrillDown肯定不为空)
  fetchData(meta, drillFields).then((info) => {
    // 只有数据存在的时候 才执行局部下钻逻辑
    const { drillData, drillField } = info;
    if (!isEmpty(drillData)) {
      // 缓存到表实例中
      const { drillDownDataCache, drillDownCurrentCash } = getDrillDownCash(
        spreadsheet,
        meta,
      );
      const startDrillDown = () => {
        const drillLevel = meta.level + 1;
        // 先缓存数据
        drillDownDataCache.push({
          rowId: meta.id,
          drillLevel,
          drillData,
          drillField,
        });
        spreadsheet.store.set('drillDownDataCache', drillDownDataCache);
        // 开始处理下钻逻辑
        // 缓存此层级的下钻维度，以后此层级只能下钻相同维度的数据
        let drillDownFieldInLevel = spreadsheet.store.get(
          'drillDownFieldInLevel',
          [],
        ) as DrillDownFieldInLevel[];
        // 该层级存在缓存，拿到该层级的维度信息来对比，如果不同，需要提示必须一致
        const ddfl = drillDownFieldInLevel.find(
          (d) => d?.drillLevel === drillLevel,
        );
        if (ddfl) {
          if (ddfl.drillField !== drillField) {
            // 同层级存在不同维度，只能全部清空！！！再下钻（WARNING）
            ClearDrillDownInfo(spreadsheet);
            // 添加新的维度-level的映射
            drillDownFieldInLevel = [
              {
                drillField,
                drillLevel,
              },
            ];
          }
        } else {
          // 同层级不存在维度，直接保存，以便下次用于校验
          drillDownFieldInLevel.push({
            drillField,
            drillLevel,
          });
        }
        spreadsheet.store.set('drillDownFieldInLevel', drillDownFieldInLevel);
        // 开始下钻, 参数拼接
        const tempCfg = clone(spreadsheet.dataCfg);
        const restRows = drillDownFieldInLevel
          .sort((a) => a.drillLevel)
          .map((d) => d.drillField);

        tempCfg.fields.rows = concat(rows, restRows);
        tempCfg.data = concat(spreadsheet.dataCfg.data, drillData);
        spreadsheet.setDataCfg(tempCfg);
        spreadsheet.render();
      };

      if (drillDownCurrentCash) {
        // 存在cache,说明当前节点已经下钻过
        // 下钻的维度不一样，替换原有维度，且更新
        if (drillField !== drillDownCurrentCash.drillField) {
          // 删除此下钻节点相关的数据缓存（WARNING 如果同层级存在不同维度，会清空！！！）
          ClearDrillDownInfo(spreadsheet, drillDownCurrentCash.rowId);
          startDrillDown();
        } else {
          // 下钻维度一样，那就是上层逻辑有问题！！！
        }
      } else {
        // rowId上不存在cache, 新添加
        startDrillDown();
      }
    }
  });
};

/**
 * 下钻场景下的cfg处理，主要改变两个配置
 * - rows(维度的merge)
 * - data(下钻数据的merge)
 * 理论上外部配置的rows维度不变的情况，目前读取的默认的配置全都是来自外部的dataCfg配置作为基准
 * 如果外部改变了自身的rows维度怎么办？
 * - rows变化了，必须要清空所有的下钻信息！！！（否则没法处理那么多组合）
 * @param preProps
 * @param props
 * @param spreadsheet
 * @constructor
 */
export const HandleConfigWhenDrillDown = (
  props: SpreadsheetProps,
  spreadsheet: BaseSpreadSheet,
) => {
  const drillDownDataCache = spreadsheet.store.get(
    'drillDownDataCache',
    [],
  ) as DrillDownDataCache[];
  const tempCfg = clone(spreadsheet.dataCfg);
  if (!isEmpty(drillDownDataCache)) {
    // 树状模式显示下钻信息，平铺模式隐藏！！
    if (
      props.options.hierarchyType === 'tree' &&
      props.options.spreadsheetType
    ) {
      const drillDownFieldInLevel = spreadsheet.store.get(
        'drillDownFieldInLevel',
        [],
      ) as DrillDownFieldInLevel[];
      // 只有树形结构下，下钻的数据信息才会被显示
      // 添加新增的下钻维度
      tempCfg.fields.rows = concat(
        props.dataCfg.fields.rows,
        drillDownFieldInLevel
          .sort((d) => d.drillLevel)
          .map((d) => d.drillField),
      );
      // 数据merge
      tempCfg.data = concat(
        props.dataCfg.data,
        ...drillDownDataCache.map((d) => d.drillData),
      );
    } else {
      // 平铺模式下，需要把下钻的row维度&数据去掉
      // 替换为最初的行维度
      tempCfg.fields.rows = props.dataCfg.fields.rows;
      // 替换为最初的数据
      tempCfg.data = props.dataCfg.data;
    }
  } else {
    tempCfg.fields.rows = props.dataCfg.fields.rows;
    tempCfg.data = props.dataCfg.data;
  }
  spreadsheet.setDataCfg(tempCfg);
};
