import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { GuiIcon, Node, RowCell, S2Options, SpreadSheet } from '@antv/s2';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { get, noop } from 'lodash';
import { BaseSheetComponentProps, SheetComponent } from '../../src';
import { getContainer } from '../util/helpers';

const s2Options: S2Options = {
  width: 600,
  height: 600,
  hierarchyType: 'tree',
};

/** 下钻展示数量 */
const EXPECT_DRILL_ITEMS_NUM = 3;

const partDrillDownParams: BaseSheetComponentProps['partDrillDown'] = {
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
    (instance.facet.rowHeader.getChildren() as RowCell[]).find(
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
          getSpreadSheet={(instance) => {
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
          getSpreadSheet={(instance) => {
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
});
