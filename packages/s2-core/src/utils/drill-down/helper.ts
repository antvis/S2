import { S2Options } from '@/common/interface';
import { PartDrillDownInfo, SpreadsheetProps } from '@/components/index';
import { SpreadSheet } from '@/sheet-type';
import { merge, set } from 'lodash';

import { Node } from '@/facet/layout/node';
import { PivotDataSet } from '@/data-set';

export interface ActionIconParams {
  // 点击节点信息
  meta: Node;
  // 点击icon类型
  iconType: string;
  // 点击事件event
  event: Event;
  spreadsheet: SpreadSheet;
  // 下钻维度的列表组件展示
  callback: (event: Event, sheetInstance: SpreadSheet) => void;
}

export interface DrillDownParams {
  // 行维度id
  rows: string[];
  // 下钻维度
  drillFields: string[];
  spreadsheet: SpreadSheet;
  // 下钻维值显示个数
  drillItemsNum?: number | string;
  // 下钻维度后获取数据
  fetchData?: (meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>;
}

export const HandleDrillDownIcon = (
  props: SpreadsheetProps,
  spreadsheet: SpreadSheet,
  callback: (event: MouseEvent, sheetInstance: SpreadSheet) => void,
): S2Options => {
  if (props?.partDrillDown) {
    const { customDisplayByRowName } = props.partDrillDown;
    return merge({}, props.options, {
      rowActionIcons: {
        iconTypes: ['DrillDownIcon'],
        customDisplayByRowName,
        action: (iconType: string, meta: Node, event: MouseEvent) => {
          if (iconType === 'DrillDownIcon') {
            spreadsheet.store.set('drillDownNode', meta);
            callback(event, spreadsheet);
          }
        },
      },
    });
  }
  set(props.options, 'rowActionIcons', null);
  return props.options;
};

export const HandleDrillDown = (params: DrillDownParams) => {
  const { fetchData, spreadsheet, drillFields, drillItemsNum } = params;
  const meta = spreadsheet.store.get('drillDownNode');
  fetchData(meta, drillFields).then((info) => {
    const { drillData, drillField } = info;
    (spreadsheet.dataSet as PivotDataSet).transformDrillDownData(
      drillField,
      drillData,
      meta,
    );
    spreadsheet.render(false);
  });
};
