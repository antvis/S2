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

export const CustomTreeDataCfg: S2DataConfig = {
  meta,
  data: customTreeData,
  fields: customTreeFields,
};

export const CustomTreeOptions: SheetComponentOptions = {
  debug: true,
  width: 600,
  height: 480,
  hierarchyType: 'tree',
  showDefaultHeaderActionIcon: false,
  interaction: {
    copy: {
      enable: true,
      withHeader: true,
      withFormat: true,
    },
  },
  // cornerText: '指标',
};

type CustomTreeProps = Partial<SheetComponentsProps>;

export const CustomTree = React.forwardRef<SpreadSheet, CustomTreeProps>(
  (props, ref) => {
    const context = usePlaygroundContext();
    const { logHandler } = context;

    return (
      <SheetComponent
        dataCfg={CustomTreeDataCfg}
        options={CustomTreeOptions}
        ref={ref}
        onCopied={logHandler('onCopied')}
        header={{
          title: '自定义目录树',
          export: {
            open: true,
          },
        }}
        {...props}
        {...context}
      />
    );
  },
);
