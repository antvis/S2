/* eslint-disable no-console */
import {
  Aggregation,
  type S2DataConfig,
  type SpreadSheet,
  type ThemeCfg,
} from '@antv/s2';
import {
  customColGridFields,
  customRowGridFields,
} from '@antv/s2/__tests__/data/custom-grid-fields';
import { CustomGridData } from '@antv/s2/__tests__/data/data-custom-grid';
import { Radio, Space, Switch } from 'antd';
import React from 'react';
import { meta } from '../../__tests__/data/mock-dataset.json';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentProps,
} from '../../src';
import { usePlaygroundContext } from '../context/playground.context';
import { onSheetMounted } from '../utils';
import { ResizeConfig } from './ResizeConfig';

export const customRowGridOptions: SheetComponentOptions = {
  width: 1000,
  height: 480,
  hierarchyType: 'grid',
  cornerText: '自定义角头标题',
};

/**
 * 平铺模式-自定义行头
 */
export const pivotSheetCustomRowGridDataCfg: S2DataConfig = {
  data: CustomGridData,
  meta: [
    ...meta,
    {
      field: 'a-1',
      name: '层级1',
    },
    {
      field: 'a-1-1',
      name: '层级2',
    },
    {
      field: 'measure-1',
      name: '层级3',
    },
    {
      field: 'measure-1',
      formatter: (value) => `#-${value}`,
    },
  ],
  fields: customRowGridFields,
};

/**
 * 平铺模式-自定义列头
 */
export const pivotSheetCustomColGridDataCfg: S2DataConfig = {
  data: CustomGridData,
  meta: [
    ...meta,
    {
      field: 'a-1',
      name: '指标1',
      formatter: (value) => `#-${value}`,
    },
    {
      field: 'a-1-1',
      name: '层级2',
    },
    {
      field: 'measure-1',
      formatter: (value) => `#-${value}`,
    },
  ],
  fields: customColGridFields,
};

enum CustomType {
  Row = 'row',
  Col = 'col',
}

type CustomGridProps = Partial<SheetComponentProps>;

export const CustomGrid = React.forwardRef<SpreadSheet, CustomGridProps>(
  (props, ref) => {
    const context = usePlaygroundContext();
    const { logHandler } = context;
    const [customType, setCustomType] = React.useState<CustomType>(
      (localStorage.getItem('debugCustomType') as unknown as CustomType) ||
        CustomType.Row,
    );
    const [options, setOptions] = React.useState<SheetComponentOptions>({
      ...customRowGridOptions,
      hierarchyType: 'grid',
      interaction: {
        overscrollBehavior: 'none',
      },
    });
    const [themeCfg, setThemeCfg] = React.useState<ThemeCfg>({
      name: 'default',
      ...context.themeCfg,
    });
    const [sheetType, setSheetType] =
      React.useState<SheetComponentProps['sheetType']>('pivot');

    const dataCfg =
      customType === CustomType.Row
        ? pivotSheetCustomRowGridDataCfg
        : pivotSheetCustomColGridDataCfg;

    return (
      <>
        <Space style={{ marginBottom: 20 }}>
          <Radio.Group
            value={customType}
            onChange={(e) => {
              setSheetType('pivot');
              setCustomType(e.target.value);
            }}
          >
            <Radio.Button value={CustomType.Row}>自定义行头</Radio.Button>
            <Radio.Button value={CustomType.Col}>自定义列头</Radio.Button>
          </Radio.Group>
          <Switch
            checkedChildren="树状模式"
            unCheckedChildren="平铺模式"
            checked={options.hierarchyType === 'tree'}
            disabled={sheetType === 'table'}
            onChange={(checked) => {
              setOptions({
                hierarchyType: checked ? 'tree' : 'grid',
              });
            }}
          />
          <Switch
            checkedChildren="序号开"
            unCheckedChildren="序号关"
            checked={options.seriesNumber?.enable}
            onChange={(checked) => {
              setOptions({
                seriesNumber: {
                  enable: checked,
                },
              });
            }}
          />
          <Switch
            checkedChildren="透视表"
            unCheckedChildren="明细表"
            checked={sheetType === 'pivot'}
            disabled={customType !== CustomType.Col}
            onChange={(checked) => {
              setSheetType(checked ? 'pivot' : 'table');
            }}
          />

          <Switch
            checkedChildren="显示行小计/总计"
            unCheckedChildren="隐藏行小计/总计"
            disabled={customType === CustomType.Row}
            defaultChecked={options.totals?.row?.showSubTotals as boolean}
            onChange={(checked) => {
              setOptions({
                totals: {
                  row: {
                    showGrandTotals: checked,
                    showSubTotals: checked,
                    reverseGrandTotalsLayout: true,
                    reverseSubTotalsLayout: true,
                    subTotalsDimensions: ['type'],
                    calcGrandTotals: {
                      aggregation: Aggregation.SUM,
                    },
                    calcSubTotals: {
                      aggregation: Aggregation.SUM,
                    },
                  },
                },
              });
            }}
          />
          <Switch
            checkedChildren="显示列小计/总计"
            unCheckedChildren="隐藏列小计/总计"
            disabled={customType === CustomType.Col}
            defaultChecked={options.totals?.col?.showSubTotals as boolean}
            onChange={(checked) => {
              setOptions({
                totals: {
                  col: {
                    showGrandTotals: checked,
                    showSubTotals: checked,
                    reverseGrandTotalsLayout: true,
                    reverseSubTotalsLayout: true,
                    subTotalsDimensions: ['type'],
                    calcGrandTotals: {
                      aggregation: Aggregation.SUM,
                    },
                    calcSubTotals: {
                      aggregation: Aggregation.SUM,
                    },
                  },
                },
              });
            }}
          />
        </Space>
        <Space style={{ marginBottom: 20, display: 'flex' }}>
          <ResizeConfig
            options={options}
            setOptions={setOptions}
            setThemeCfg={setThemeCfg}
          />
        </Space>

        <SheetComponent
          {...props}
          {...context}
          sheetType={sheetType}
          dataCfg={dataCfg}
          options={options}
          themeCfg={themeCfg}
          ref={ref}
          onMounted={onSheetMounted}
          onLayoutResize={logHandler('onLayoutResize')}
        />
      </>
    );
  },
);
