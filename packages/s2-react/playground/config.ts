import { isUpDataValue } from '@antv/s2';
import type { S2DataConfig } from '@antv/s2';
import { getBaseSheetComponentOptions } from '@antv/s2-shared';
import type { SliderSingleProps } from 'antd';
import { data, totalData, meta } from '../__tests__/data/mock-dataset.json';
import type { SheetComponentOptions } from '../src/components';
import { customGridFields } from '../__tests__/data/custom-grid-fields';
import { customGridData } from '../__tests__/data/data-custom-grid';

export const tableSheetDataCfg: S2DataConfig = {
  data,
  totalData,
  meta,
  fields: {
    columns: ['province', 'city', 'type', 'sub_type', 'number'],
  },
};

export const pivotSheetDataCfg: S2DataConfig = {
  data: customGridData,
  totalData,
  meta: [
    {
      field: 'a-1',
      name: '层级1',
    },
    {
      field: 'a-2',
      name: '层级2',
    },
    {
      field: 'a-3',
      name: '层级3',
    },
    {
      field: 'measure-4',
      name: '指标4自定义名字',
    },
  ],
  fields: {
    ...customGridFields,
    // columns: [
    //   {
    //     key: 'b-1',
    //     title: '自定义列节点1',
    //     description: '自定义列节点1描述',
    //     children: [
    //       {
    //         key: 'b-1-1',
    //         title: '自定义列节点2',
    //         description: '自定义列节点2描述',
    //         children: [],
    //       },
    //       {
    //         key: 'b-1-2',
    //         title: '自定义列节点3',
    //         description: '自定义列节点3描述',
    //       },
    //     ],
    //   },
    //   {
    //     key: 'b-2',
    //     title: '自定义列节点2',
    //     description: '自定义列节点2描述',
    //     children: [
    //       {
    //         key: 'b-2-1',
    //         title: '自定义列节点2-1',
    //         description: '自定义列节点2-1描述',
    //         children: [],
    //       },
    //       {
    //         key: 'b-2-2',
    //         title: '自定义列节点2-2',
    //         description: '自定义列节点2-2描述',
    //       },
    //     ],
    //   },
    // ],
  },
};

export const s2Options: SheetComponentOptions = {
  debug: true,
  width: 600,
  height: 400,
  showSeriesNumber: false,
  cornerText: '测试',
  interaction: {
    enableCopy: true,
    // 防止 mac 触摸板横向滚动触发浏览器返回, 和移动端下拉刷新
    overscrollBehavior: 'none',
  },
  tooltip: {
    operation: {
      trend: true,
    },
  },
  hierarchyType: 'grid',
};

export const sliderOptions: SliderSingleProps = {
  min: 0,
  max: 10,
  step: 0.1,
  marks: {
    0.2: '0.2',
    1: '1 (默认)',
    2: '2',
    10: '10',
  },
};

export const mockGridAnalysisOptions: SheetComponentOptions = {
  width: 1600,
  height: 600,
  style: {
    layoutWidthType: 'colAdaptive',
    cellCfg: {
      width: 400,
      height: 100,
      valuesCfg: {
        widthPercent: [40, 0.2, 0.2, 0.2],
      },
    },
  },
  conditions: {
    text: [
      {
        mapping: (value, cellInfo) => {
          const { colIndex } = cellInfo;
          if (colIndex <= 1) {
            return {
              fill: '#000',
            };
          }
          return {
            fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
          };
        },
      },
    ],
  },
};

export const defaultOptions =
  getBaseSheetComponentOptions<SheetComponentOptions>(s2Options);
