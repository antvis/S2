import { customMerge, Node, SpreadSheet } from '@antv/s2';
import { waitFor } from '@testing-library/react';
import { get, noop } from 'lodash';
import React from 'react';
import type { Root } from 'react-dom/client';
import { SheetComponent, type SheetComponentsProps } from '../../src';
import * as mockDataConfig from '../data/simple-data.json';
import { getContainer, renderComponent } from '../util/helpers';

const s2Options: SheetComponentsProps['options'] = {
  width: 600,
  height: 300,
  hierarchyType: 'tree',
};

/** 下钻展示数量 */
const EXPECT_DRILL_ITEMS_NUM = 3;

const partDrillDownParams: SheetComponentsProps['partDrillDown'] = {
  drillConfig: {
    dataSet: [
      {
        name: '地区',
        value: 'area',
      },
    ],
  },
  fetchData: () =>
    Promise.resolve({
      drillField: 'area',
      drillData: [],
    }),
};

const findDrillDownIcon = (s2: SpreadSheet) => {
  const rowHeaderActionIcons = s2.facet
    ?.getRowCells()
    ?.find((cell) => cell.getActualText() === '杭州')
    ?.getActionIcons();

  return rowHeaderActionIcons?.find((icon) => icon.name === 'DrillDownIcon');
};

describe('Spread Sheet Drill Down Tests', () => {
  let container: HTMLDivElement;
  let unmount: Root['unmount'];

  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    unmount?.();
  });

  test('should render drill down icon', async () => {
    let s2Instance: SpreadSheet | null = null;

    // 首次 render

    unmount = renderComponent(
      <SheetComponent
        options={s2Options}
        dataCfg={mockDataConfig}
        onMounted={(instance) => {
          s2Instance = instance;
        }}
        partDrillDown={partDrillDownParams}
      />,
      container,
    );

    await waitFor(() => {
      expect(findDrillDownIcon(s2Instance!)).toBeDefined();
    });

    // mock drill down
    s2Instance!.store.set('drillDownIdPathMap', new Map());
    s2Instance!.store.set('drillItemsNum', EXPECT_DRILL_ITEMS_NUM);

    // update options.headerActionIcons

    unmount = renderComponent(
      <SheetComponent
        options={{
          ...s2Options,
          headerActionIcons: [
            {
              icons: ['SortDown'],
              belongsCell: 'colCell',
              displayCondition: (meta: Node) => meta.isLeaf,
              onClick: noop,
            },
          ],
        }}
        dataCfg={mockDataConfig}
        onMounted={(instance) => {
          s2Instance = instance;
        }}
        partDrillDown={partDrillDownParams}
      />,
      container,
    );

    await waitFor(() => {
      expect(findDrillDownIcon(s2Instance!)).toBeDefined();

      // render new headerActionIcons should not clear data
      expect(s2Instance!.store.get('drillItemsNum')).toEqual(
        EXPECT_DRILL_ITEMS_NUM,
      );
    });
  });

  // https://github.com/antvis/S2/issues/1514
  test('should render drill down icon and not show sort icon if value is empty', async () => {
    let s2: SpreadSheet;

    unmount = renderComponent(
      <SheetComponent
        options={s2Options}
        dataCfg={customMerge(mockDataConfig, {
          fields: {
            values: [],
          },
        })}
        onMounted={(instance) => {
          s2 = instance;
        }}
        partDrillDown={partDrillDownParams}
      />,
    );

    await waitFor(() => {
      const rowNodes = s2!.facet
        .getRowNodes()
        .filter((node) => node.rowIndex >= 1);

      rowNodes.forEach((node) => {
        expect(get(node.belongsCell, 'actionIcons.0.cfg.name')).toEqual(
          'DrillDownIcon',
        );
      });
    });
  });

  test('should not render drill down icon is displayCondition return false', async () => {
    let s2: SpreadSheet;

    unmount = renderComponent(
      <SheetComponent
        options={s2Options}
        dataCfg={mockDataConfig}
        onMounted={(instance) => {
          s2 = instance;
        }}
        partDrillDown={{
          ...partDrillDownParams,
          displayCondition: () => false,
        }}
      />,
    );

    await waitFor(() => {
      const rowNodes = s2!.facet.getRowNodes();

      rowNodes.forEach((node) => {
        expect(get(node.belongsCell, 'actionIcons')).toHaveLength(0);
      });
    });
  });
});
