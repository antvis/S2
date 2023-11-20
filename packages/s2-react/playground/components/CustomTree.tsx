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
import { usePlaygroundContext } from '../context/playground.context';

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

type CustomTreeProps = Partial<SheetComponentsProps>;

export const CustomTree = React.forwardRef<SpreadSheet, CustomTreeProps>(
  (props, ref) => {
    const context = usePlaygroundContext();

    return (
      <SheetComponent
        dataCfg={customTreeDataCfg}
        options={customTreeOptions}
        ref={ref}
        {...props}
        {...context}
      />
    );
  },
);
