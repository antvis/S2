/**
 * @description spec for issue #594
 * https://github.com/antvis/S2/issues/594
 * Wrong ref when sheet type changed
 */
import { S2Event, SpreadSheet, TableSheet } from '@antv/s2';
import type { SheetType } from '@antv/s2-shared';
import { waitFor } from '@testing-library/react';
import React, { type MutableRefObject } from 'react';
import { act } from 'react-dom/test-utils';
import * as mockDataConfig from 'tests/data/simple-data.json';
import { renderComponent } from 'tests/util/helpers';
import type { SheetComponentsProps } from '@/components/sheets/interface';
import { SheetComponent } from '@/components/sheets';

let s2: SpreadSheet | null;

let mockRef = {
  current: null,
} as unknown as MutableRefObject<SpreadSheet | null>;

function MainLayout(
  props: Partial<SheetComponentsProps> & { toggleSheetType?: boolean },
) {
  const s2Ref = React.useRef<SpreadSheet>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [sheetType, setSheetType] = React.useState<SheetType>(props.sheetType!);

  React.useEffect(() => {
    mockRef = s2Ref;
  }, [sheetType, s2Ref]);

  React.useEffect(() => {
    buttonRef.current?.addEventListener('click', () => {
      setSheetType(sheetType === 'pivot' ? 'table' : 'pivot');
    });
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
        onMounted={(instance) => {
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

  test('should get spreadsheet instance by', async () => {
    renderComponent(<MainLayout sheetType="pivot" />);

    await waitFor(() => {
      expect(s2).toBeInstanceOf(SpreadSheet);
      expect(mockRef.current).toBeInstanceOf(SpreadSheet);
    });
  });

  test('should get table spreadsheet instance', async () => {
    renderComponent(<MainLayout sheetType="table" />);

    await waitFor(() => {
      expect(s2).toBeInstanceOf(TableSheet);
      expect(mockRef.current).toBeInstanceOf(TableSheet);
    });
  });

  test('should register events when sheet type updated', async () => {
    renderComponent(<MainLayout sheetType="pivot" toggleSheetType />);

    // toggle sheet type
    act(() => {
      document.querySelector('.btn')!.dispatchEvent(new Event('click'));
    });

    await waitFor(() => {
      // should don't miss events
      expect(
        mockRef.current?.getEvents()[S2Event.COL_CELL_CLICK],
      ).toBeDefined();
    });
  });
});
