/**
 * @description spec for issue #594
 * https://github.com/antvis/S2/issues/594
 * Wrong ref when sheet type changed
 *
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { TableSheet, SpreadSheet, S2Event } from '@antv/s2';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { getContainer } from 'tests/util/helpers';
import type {
  SheetType,
  SheetComponentsProps,
} from '@/components/sheets/interface';
import { SheetComponent } from '@/components/sheets';

let s2: SpreadSheet;

const mockRef = {
  current: null,
};

function MainLayout(
  props: Partial<SheetComponentsProps> & { toggleSheetType?: boolean },
) {
  const s2Ref = React.useRef<SpreadSheet>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [sheetType, setSheetType] = React.useState<SheetType>(props.sheetType);

  React.useEffect(() => {
    mockRef.current = s2Ref.current;
  }, [sheetType]);

  React.useEffect(() => {
    buttonRef.current?.addEventListener('click', () => {
      setSheetType(sheetType === 'pivot' ? 'table' : 'pivot');
    });
  }, [sheetType]);

  React.useEffect(() => {
    s2Ref.current.on(S2Event.DATA_CELL_TREND_ICON_CLICK, () => {});
    s2.on(S2Event.DATA_CELL_TREND_ICON_CLICK, () => {});
  }, [sheetType]);

  return (
    <>
      {props.toggleSheetType && (
        <button className="btn" ref={buttonRef}>
          切换表形态
        </button>
      )}
      <SheetComponent
        sheetType={sheetType}
        dataCfg={mockDataConfig}
        options={{ width: 200, height: 200 }}
        themeCfg={{ name: 'default' }}
        getSpreadSheet={(instance) => {
          s2 = instance;
        }}
        ref={s2Ref}
      />
    </>
  );
}

describe('SheetComponent Ref Tests', () => {
  beforeEach(() => {
    s2 = null;
    mockRef.current = null;
  });

  test('should get spreadsheet instance by', () => {
    act(() => {
      ReactDOM.render(<MainLayout sheetType="pivot" />, getContainer());
    });
    expect(s2).toBeInstanceOf(SpreadSheet);
    expect(mockRef.current).toBeInstanceOf(SpreadSheet);
  });

  test('should get table spreadsheet instance', () => {
    act(() => {
      ReactDOM.render(<MainLayout sheetType="table" />, getContainer());
    });
    expect(s2).toBeInstanceOf(TableSheet);
    expect(mockRef.current).toBeInstanceOf(TableSheet);
  });

  test('should register events when sheet type updated', () => {
    act(() => {
      ReactDOM.render(
        <MainLayout sheetType="pivot" toggleSheetType />,
        getContainer(),
      );
    });

    // toggle sheet type
    act(() => {
      document.querySelector('.btn').dispatchEvent(new Event('click'));
    });

    // should don't miss events
    expect(s2.getEvents()[S2Event.DATA_CELL_TREND_ICON_CLICK]).toBeDefined();
    expect(mockRef.current.getEvents()[S2Event.COL_CELL_CLICK]).toBeDefined();
  });
});
