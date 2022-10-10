import { Radio, Space } from 'antd';
import React from 'react';
import { SheetComponent, type SheetComponentOptions } from '../../src';
import {
  pivotSheetCustomColGridDataCfg,
  pivotSheetCustomRowGridDataCfg,
} from '../config';

export const customRowGridOptions: SheetComponentOptions = {
  width: 1000,
  height: 480,
  hierarchyType: 'grid',
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
            setCustomType(e.target.value);
          }}
        >
          <Radio.Button value={CustomType.Row}>自定义行头</Radio.Button>
          <Radio.Button value={CustomType.Col}>自定义列头</Radio.Button>
          <Radio.Button value={CustomType.All}>自定义行头和列头</Radio.Button>
        </Radio.Group>
      </Space>

      <SheetComponent dataCfg={dataCfg} options={customRowGridOptions} />
    </>
  );
};
