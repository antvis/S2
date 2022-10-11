import type { S2DataConfig } from '@antv/s2';
import {
  customColGridFields,
  customRowGridFields,
} from '@antv/s2/__tests__/data/custom-grid-fields';
import {
  customRowGridSimpleFields,
  customColGridSimpleFields,
} from '@antv/s2/__tests__/data/custom-grid-simple-fields';
import { CustomGridData } from '@antv/s2/__tests__/data/data-custom-grid';
import { Radio, Space, Switch } from 'antd';
import React from 'react';
import { SheetComponent, type SheetComponentOptions } from '../../src';
import { meta } from '../../__tests__/data/mock-dataset.json';

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
  ],
  fields: customRowGridSimpleFields,
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
      name: '层级1',
    },
    {
      field: 'a-1-1',
      name: '层级2',
    },
  ],
  fields: customColGridSimpleFields,
};

enum CustomType {
  Row,
  Col,
  All,
}

export const CustomGrid = () => {
  const [customType, setCustomType] = React.useState<CustomType>(
    CustomType.Col,
  );
  const [hierarchyType, setHierarchyType] =
    React.useState<SheetComponentOptions['hierarchyType']>('grid');

  const dataCfg =
    customType === CustomType.Row
      ? pivotSheetCustomRowGridDataCfg
      : pivotSheetCustomColGridDataCfg;

  const options: SheetComponentOptions = {
    ...customRowGridOptions,
    hierarchyType,
  };

  return (
    <>
      <Space style={{ marginBottom: 20 }}>
        <Radio.Group
          value={customType}
          onChange={(e) => {
            setCustomType(e.target.value);
          }}
        >
          <Radio.Button value={CustomType.Row}>自定义行头</Radio.Button>
          <Radio.Button value={CustomType.Col}>自定义列头</Radio.Button>
          <Radio.Button value={CustomType.All}>自定义行头和列头</Radio.Button>
        </Radio.Group>
        <Switch
          checkedChildren="树状模式"
          unCheckedChildren="平铺模式"
          checked={hierarchyType === 'tree'}
          onChange={(checked) => {
            setHierarchyType(checked ? 'tree' : 'grid');
          }}
        />
      </Space>

      <SheetComponent dataCfg={dataCfg} options={options} />
    </>
  );
};
