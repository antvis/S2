import { message, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { S2Event, SpreadSheet } from '../../src';
import { getContainer } from '../util/helpers';
import { SheetEntry } from '../util/sheet-entry';

function MainLayout() {
  const [linkFields, setLinkFields] = useState<string[]>([]);
  const sheetRef = useRef<SpreadSheet>();

  const onLinkFieldsChanged = (ids: string[]) => {
    setLinkFields(ids);
  };

  useEffect(() => {
    sheetRef.current.on(S2Event.CELL_TEXT_CLICK, ({ key, record }) => {
      message.info(`key: ${key}, name: ${record[key]}`);
    });
  }, []);

  return (
    <SheetEntry
      dataCfg={{}}
      options={{ linkFields: linkFields }}
      ref={sheetRef}
      header={
        <Space size="middle" style={{ marginBottom: 20 }}>
          <Select
            mode="multiple"
            placeholder="请选择 Link Field"
            value={linkFields}
            onChange={onLinkFieldsChanged}
            style={{ width: '200px' }}
          >
            <Select.Option value={'area'}>地区</Select.Option>
            <Select.Option value={'province'}>省份</Select.Option>
            <Select.Option value={'city'}>城市</Select.Option>
          </Select>
        </Space>
      }
    />
  );
}

describe('spreadsheet normal spec', () => {
  act(() => {
    ReactDOM.render(<MainLayout />, getContainer());
  });
  test('should pass test', () => {
    // just for placeholder when run test:live
    expect(1).toBe(1);
  });
});
