import type { HierarchyType, S2DataConfig, SpreadSheet } from '@antv/s2';
import { Export } from '@antv/s2-react-components';
import { Space, Switch } from 'antd';
import React from 'react';
import { customTreeFields } from '../../__tests__/data/custom-tree-fields';
import { customTreeData } from '../../__tests__/data/data-custom-trees';
import { meta } from '../../__tests__/data/mock-dataset.json';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentProps,
} from '../../src';
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
  style: {
    rowCell: {
      // expandDepth: 0,
      // collapseAll: true,
    },
  },
  // cornerText: '指标',
};

type CustomTreeProps = Partial<SheetComponentProps>;

export const CustomTree = React.forwardRef<SpreadSheet, CustomTreeProps>(
  (props, ref) => {
    const context = usePlaygroundContext();
    const [hierarchyType, setHierarchyType] = React.useState<HierarchyType>(
      CustomTreeOptions.hierarchyType!,
    );
    const { logHandler } = context;

    return (
      <>
        <Space
          style={{
            display: 'flex',
            marginBottom: 8,
          }}
        >
          <Switch
            checked={hierarchyType === 'tree'}
            checkedChildren="树状"
            unCheckedChildren="平铺"
            onChange={(checked) => {
              setHierarchyType(checked ? 'tree' : 'grid');
            }}
          />
          <Export sheetInstance={context.ref!.current!} />
        </Space>
        <SheetComponent
          {...props}
          {...context}
          dataCfg={CustomTreeDataCfg}
          options={{ ...CustomTreeOptions, hierarchyType }}
          ref={ref}
          onCopied={logHandler('onCopied')}
        />
      </>
    );
  },
);
