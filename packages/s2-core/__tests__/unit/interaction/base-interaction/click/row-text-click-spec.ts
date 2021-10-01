import { Event as GEvent } from '@antv/g-canvas';
import EE from '@antv/event-emitter';
import { RowTextClick } from '@/interaction/base-interaction/click';
import { Data, S2DataConfig, S2Options } from '@/common/interface';
import { Store } from '@/common/store';
import { SpreadSheet } from '@/sheet-type';
import { RootInteraction } from '@/interaction/root';
import { S2Event } from '@/common/constant';

jest.mock('@/interaction/event-controller');
jest.mock('@/interaction/base-interaction/click/row-column-click');

class FakeSpreadSheet extends EE {}

describe('Interaction Row Text Click Tests', () => {
  let rowTextClick: RowTextClick;
  let s2: SpreadSheet;
  let interaction: RootInteraction;

  const data: Data[] = [
    {
      'key-0': 'value1',
      'key-1': 'value2',
      'key-2': 'value3',
    },
    {
      'key-0': 'value4',
      'key-1': 'value5',
      'key-2': 'value6',
    },
  ];

  beforeEach(() => {
    s2 = new FakeSpreadSheet() as unknown as SpreadSheet;
    s2.store = new Store();
    interaction = new RootInteraction(s2 as unknown as SpreadSheet);
    rowTextClick = new RowTextClick(s2 as unknown as SpreadSheet, interaction);
    s2.interaction = interaction;
    s2.options = {
      hierarchyType: 'grid',
    } as S2Options;
    s2.isHierarchyTreeType = () => false;
    s2.dataCfg = {
      data,
    } as S2DataConfig;
  });

  test('should bind events', () => {
    expect(rowTextClick.bindEvents).toBeDefined();
  });

  test('should emit link field jump event when row cell text click', () => {
    const cellData = {
      key: 'key-1',
      value: 'value5',
      rowIndex: 1,
      y: 20,
      height: 10,
    };
    const linkFieldJump = jest.fn();
    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, linkFieldJump);
    s2.emit(S2Event.ROW_CELL_CLICK, {
      target: {
        attrs: {
          appendInfo: {
            isRowHeaderText: true,
            cellData,
          },
        },
      },
    } as unknown as GEvent);

    // get second original row data,
    expect(linkFieldJump).toHaveBeenCalledWith({
      key: cellData.key,
      record: {
        'key-0': 'value4',
        'key-1': 'value5',
        'key-2': 'value6',
        rowIndex: cellData.rowIndex,
      },
    });
  });

  test('should emit link field jump event when row cell text click and show grand / sub totals', () => {
    Object.defineProperty(s2.options, 'totals', {
      get() {
        return {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            reverseLayout: true,
            reverseSubLayout: true,
          },
        };
      },
    });
    const cellData = {
      key: 'key-1',
      value: 'value5',
      rowIndex: 3,
    };
    const linkFieldJump = jest.fn();
    s2.on(S2Event.GLOBAL_LINK_FIELD_JUMP, linkFieldJump);
    s2.emit(S2Event.ROW_CELL_CLICK, {
      target: {
        attrs: {
          appendInfo: {
            isRowHeaderText: true,
            cellData,
          },
        },
      },
    } as unknown as GEvent);

    // get second row data, skip grand totals and sub totals
    expect(linkFieldJump).toHaveBeenCalledWith({
      key: cellData.key,
      record: {
        'key-0': 'value4',
        'key-1': 'value5',
        'key-2': 'value6',
        rowIndex: cellData.rowIndex,
      },
    });
  });
});
