import { get, merge, set } from 'lodash';
import { Event } from '@antv/g-canvas';
import { S2Options, HeaderActionIconProps } from '@/common/interface';
import { PartDrillDownInfo, SpreadsheetProps } from '@/components/index';
import { SpreadSheet } from '@/sheet-type';
import { Node } from '@/facet/layout/node';
import { PivotDataSet } from '@/data-set';

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

export const HandleDrillDownIcon = (
  props: SpreadsheetProps,
  spreadsheet: SpreadSheet,
  callback: (event: Event, sheetInstance: SpreadSheet) => void,
): S2Options => {
  if (props?.partDrillDown) {
    const { customDisplayByLabelName } = props.partDrillDown;
    let iconLevel = spreadsheet.store.get('drillDownActionIconLevel', -1);
    if (iconLevel < 0) {
      // 如果没有缓存，直接默认用叶子节点的层级
      iconLevel = get(props, 'dataCfg.fields.rows.length', 1) - 1;
      // 缓存配置之初的icon层级
      spreadsheet.store.set('drillDownActionIconLevel', iconLevel);
    }
    return merge({}, props.options, {
      headerActionIcons: [
        {
          belongsCell: 'rowCell',
          iconNames: ['DrillDownIcon'],
          customDisplayByLabelName,
          defaultHide: true,
          display: {
            level: iconLevel,
            operator: '>=',
          },
          action: (actionIconProps: HeaderActionIconProps) => {
            const { iconName, meta, event } = actionIconProps;
            if (iconName === 'DrillDownIcon') {
              spreadsheet.store.set('drillDownNode', meta);
              callback(event, spreadsheet);
            }
          },
        },
      ],
    });
  }
  set(props.options, 'headerActionIcons', null);
  return props.options;
};

export const HandleDrillDown = (params: DrillDownParams) => {
  const { fetchData, spreadsheet, drillFields, drillItemsNum } = params;
  spreadsheet.store.set('drillItemsNum', drillItemsNum);
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
