import type { S2DataConfig, SpreadSheet } from '@antv/s2';
import React from 'react';
import { Switch } from 'antd';
import type { HierarchyType } from '@antv/s2';
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
  meta: [
    ...meta,
    // { field: 'a-1', name: '自定义 A' },
    // { field: 'measure-a', name: '自定义 B' },
    // { field: 'measure-b', name: '自定义 C' },
  ],
  data: customTreeData,
  fields: customTreeFields,
};

export const CustomTreeOptions: SheetComponentOptions = {
  debug: true,
  width: 600,
  height: 480,
  hierarchyType: 'tree',
  transformCanvasConfig() {
    return {
      supportsCSSTransform: true,
    };
  },
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
    const [hierarchyType, setHierarchyType] = React.useState<HierarchyType>(
      CustomTreeOptions.hierarchyType!,
    );
    const { logHandler } = context;

    return (
      <SheetComponent
        dataCfg={CustomTreeDataCfg}
        options={{ ...CustomTreeOptions, hierarchyType }}
        ref={ref}
        onCopied={logHandler('onCopied')}
        header={{
          title: '自定义目录树',
          export: {
            open: true,
          },
          extra: (
            <Switch
              checked={hierarchyType === 'tree'}
              checkedChildren="树状"
              unCheckedChildren="平铺"
              onChange={(checked) => {
                setHierarchyType(checked ? 'tree' : 'grid');
              }}
            />
          ),
        }}
        {...props}
        {...context}
      />
    );
  },
);
