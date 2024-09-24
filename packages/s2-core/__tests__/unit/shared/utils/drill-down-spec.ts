import {
  S2Event,
  Store,
  type GEvent,
  type Node,
  type PivotDataSet,
  type SpreadSheet,
} from '../../../../src';
import type { PartDrillDown } from '../../../../src/shared';
import {
  buildDrillDownOptions,
  defaultPartDrillDownDisplayCondition,
  getDrillDownCache,
  handleActionIconClick,
  handleDrillDown,
} from '../../../../src/shared';
import { sleep } from '../../../util/helpers';

describe('drill-down test', () => {
  let s2: SpreadSheet;

  beforeEach(() => {
    s2 = {
      store: new Store(),
      dataCfg: {
        fields: {
          rows: [],
        },
      },
      interaction: {},
    } as unknown as SpreadSheet;
  });

  test('#getDrillDownCache()', () => {
    const node = {
      id: 'test',
    } as Node;

    expect(getDrillDownCache(s2, node)).toMatchSnapshot();

    s2.store.set('drillDownDataCache', [{ rowId: node.id }]);

    expect(getDrillDownCache(s2, node)).toMatchSnapshot();
  });

  test('#handleActionIconClick()', () => {
    const callback = jest.fn();
    const emit = jest.fn();

    s2.emit = emit;
    const node = {
      id: 'test',
      spreadsheet: s2,
    } as Node;
    const event = {} as GEvent;

    handleActionIconClick({
      meta: node,
      event,
      callback,
    });

    expect(s2.store.get('drillDownNode')).toEqual(node);
    expect(callback).toHaveBeenCalledWith({
      cacheDrillFields: [],
      disabledFields: [],
      event,
      sheetInstance: s2,
    });
    expect(emit).toHaveBeenCalledWith(S2Event.GLOBAL_ACTION_ICON_CLICK, event);
  });

  test('#defaultPartDrillDownDisplayCondition()', () => {
    const node = {
      id: 'test',
      spreadsheet: s2,
    } as Node;

    expect(defaultPartDrillDownDisplayCondition(node)).toEqual(false);
  });

  test('#buildDrillDownOptions()', () => {
    const partDrillDown: PartDrillDown = {
      fetchData: jest.fn(),
      drillItemsNum: 1,
      drillConfig: {
        dataSet: [],
      },
    };

    const callback = jest.fn();

    expect(
      buildDrillDownOptions(
        {
          headerActionIcons: [],
        },
        {} as PartDrillDown,
        callback,
      ),
    ).toMatchSnapshot();

    expect(
      buildDrillDownOptions(
        {
          headerActionIcons: [],
        },
        partDrillDown,
        callback,
      ),
    ).toMatchSnapshot();
  });

  test('#handleDrillDown()', async () => {
    const render = jest.fn();
    const reset = jest.fn();

    s2.dataSet = {
      transformDrillDownData: jest.fn(),
    } as unknown as PivotDataSet;
    s2.interaction.reset = reset;
    s2.render = render;

    const fetchData = () =>
      Promise.resolve({
        drillField: 'area',
        drillData: [],
      });

    handleDrillDown({
      fetchData,
      spreadsheet: s2,
      drillFields: [],
      rows: [],
    });

    await sleep(200);

    expect(
      (s2.dataSet as PivotDataSet).transformDrillDownData,
    ).toHaveBeenCalledTimes(1);
    expect(reset).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledTimes(1);
  });
});
