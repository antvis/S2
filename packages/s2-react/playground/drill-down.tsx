import { ORIGIN_FIELD, type PivotDataSet, type RawData } from '@antv/s2';
import type { PartDrillDownInfo } from '@antv/s2-shared';
import { forEach, random } from 'lodash';
import React from 'react';
import type { PartDrillDown } from '../src/components/sheets/interface';

const DrillDownFieldMap: Record<string, string[]> = {
  channel: ['物美', '华联'],
  sex: ['男', '女'],
};

export const partDrillDown: PartDrillDown = {
  drillConfig: {
    dataSet: [
      {
        name: '销售渠道',
        value: 'channel',
        type: 'text',
      },
      {
        name: '客户性别',
        value: 'sex',
        type: 'text',
      },
    ],
    extra: <div>test</div>,
  },
  // drillItemsNum: 1,
  fetchData: (meta, drillFields) =>
    new Promise<PartDrillDownInfo>((resolve) => {
      // 弹窗 -> 选择 -> 请求数据
      const dataSet = meta.spreadsheet.dataSet as PivotDataSet;
      const field = drillFields[0];

      const rowData = dataSet
        .getCellMultiData({
          query: meta.query!,
        })
        .filter(
          (item) =>
            item.getValueByField('type') && item.getValueByField('sub_type'),
        );

      const drillDownData: RawData[] = [];

      forEach(rowData, (data) => {
        const { number, sub_type: subType, type } = data[ORIGIN_FIELD];
        const number0 = random(50, number as number);
        const number1 = (number as number) - number0;
        const dataItem0: RawData = {
          ...meta.query,
          number: number0,
          sub_type: subType,
          type,
          [field]: DrillDownFieldMap[field][0],
        };

        drillDownData.push(dataItem0);
        const dataItem1: RawData = {
          ...meta.query,
          number: number1,
          sub_type: subType,
          type,
          [field]: DrillDownFieldMap[field][1],
        };

        drillDownData.push(dataItem1);
      });

      resolve({
        drillField: field,
        drillData: drillDownData,
      });
    }),
};
