import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  customMerge,
  GuiIcon,
  Node,
  RowCell,
  S2Options,
  SpreadSheet,
} from '@antv/s2';
import { get, noop } from 'lodash';
import * as mockDataConfig from '../data/simple-data.json';
import { type SheetComponentsProps, SheetComponent } from '../../src';
import { getContainer } from '../util/helpers';

const s2Options: S2Options = {
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

const findDrillDownIcon = (instance: SpreadSheet) => {
  const rowHeaderActionIcons = get(
    (instance.facet.rowHeader.getChildren()[0].getChildren() as RowCell[]).find(
      (item) => item.getActualText() === '杭州',
    ),
    'actionIcons',
    [],
  );

  return rowHeaderActionIcons.find(
    (icon: GuiIcon) => icon.cfg.name === 'DrillDownIcon',
  );
};

describe('Spread Sheet Drill Down Tests', () => {
  let container: HTMLDivElement;
  beforeEach(() => {
    container = getContainer();
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container?.remove();
  });

  test('should render drill down icon', () => {
    let s2Instance: SpreadSheet = null;

    // 首次 render
    act(() => {
      ReactDOM.render(
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
    });
    expect(findDrillDownIcon(s2Instance)).toBeDefined();

    // mock drill down
    s2Instance.store.set('drillDownIdPathMap', new Map());
    s2Instance.store.set('drillItemsNum', EXPECT_DRILL_ITEMS_NUM);

    // update options.headerActionIcons
    act(() => {
      ReactDOM.render(
        <SheetComponent
          options={{
            ...s2Options,
            headerActionIcons: [
              {
                iconNames: ['SortDown'],
                belongsCell: 'colCell',
                displayCondition: (meta: Node) => {
                  return meta.isLeaf;
                },
                action: noop,
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
    });
    expect(findDrillDownIcon(s2Instance)).toBeDefined();

    // render new headerActionIcons should not clear data
    expect(s2Instance.store.get('drillItemsNum')).toEqual(
      EXPECT_DRILL_ITEMS_NUM,
    );
  });

  // https://github.com/antvis/S2/issues/1514
  test('should render drill down icon and not show sort icon if value is empty', () => {
    let s2: SpreadSheet;

    act(() => {
      ReactDOM.render(
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
        container,
      );
    });

    const rowNodes = s2.getRowNodes().filter((node) => node.rowIndex >= 1);

    rowNodes.forEach((node) => {
      expect(get(node.belongsCell, 'actionIcons.0.cfg.name')).toEqual(
        'DrillDownIcon',
      );
    });
  });

  test('should not render drill down icon is displayCondition return false', () => {
    let s2: SpreadSheet;

    act(() => {
      ReactDOM.render(
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
        container,
      );
    });

    const rowNodes = s2.getRowNodes();

    rowNodes.forEach((node) => {
      expect(get(node.belongsCell, 'actionIcons')).toHaveLength(0);
    });
  });
});
