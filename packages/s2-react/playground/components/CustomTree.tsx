import type { S2DataConfig, SpreadSheet } from '@antv/s2';
import React from 'react';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentsProps,
} from '../../src';
import { customTreeFields } from '../../__tests__/data/custom-tree-fields';
import { customTreeData } from '../../__tests__/data/data-custom-trees';
import { meta } from '../../__tests__/data/mock-dataset.json';

export const customTreeDataCfg: S2DataConfig = {
  meta,
  data: customTreeData,
  fields: customTreeFields,
};

export const customTreeOptions: SheetComponentOptions = {
  width: 600,
  height: 480,
  hierarchyType: 'tree',
  // cornerText: '指标',
};

export const CustomTree: React.FC<
  Partial<SheetComponentsProps> & React.RefAttributes<SpreadSheet>
> = React.forwardRef((props, ref) => {
  return (
    <SheetComponent
      {...props}
      dataCfg={customTreeDataCfg}
      options={customTreeOptions}
      ref={ref}
    />
  );
});
