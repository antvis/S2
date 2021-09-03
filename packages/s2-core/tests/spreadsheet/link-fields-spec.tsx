import { Checkbox, message, Select, Space, Switch } from 'antd';
import 'antd/dist/antd.min.css';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { find, isArray, map, mergeWith } from 'lodash';
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  S2DataConfig,
  S2Event,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer, getMockData } from '../util/helpers';

const data = getMockData('../data/tableau-supermarket.csv');

const getDataCfg = () => {
  return {
    fields: {
      rows: ['area', 'province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['profit', 'count'],
    },
    meta: [
      {
        field: 'count',
        name: '销售个数',
      },
      {
        field: 'profit',
        name: '利润',
      },
      {
        field: 'area',
        name: '地区',
      },
      {
        field: 'province',
        name: '省份',
      },
      {
        field: 'city',
        name: '城市',
      },
    ],
    data,
  };
};

const getOptions = (): S2Options => {
  return {
    debug: true,
    width: 800,
    height: 600,
    hierarchyType: 'tree',
    hierarchyCollapse: false,
    showSeriesNumber: true,
    freezeRowHeader: false,
    mode: 'pivot',
    valueInCols: true,
    conditions: {
      text: [],
      interval: [],
      background: [],
      icon: [],
    },
    style: {
      treeRowsWidth: 100,
      collapsedRows: {},
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
        colWidthType: 'compact',
      },
      rowCfg: {
        width: 200,
      },
      cellCfg: {
        height: 32,
      },
      device: 'pc',
    },
    tooltip: {
      showTooltip: false,
    },
    selectedCellsSpotlight: true,
    hoverHighlight: true,
  };
};

function MainLayout(props) {
  const [options, setOptions] = useState<S2Options>(props.options);
  const [dataCfg, setDataCfg] = useState<S2DataConfig>(props.dataCfg);

  const [valueInCols, setValueInCols] = useState(true);

  const [freezeRowHeader, setFreezeRowHeader] = useState(
    props.options.freezeRowHeader,
  );

  const [linkFields, setLinkFields] = useState<string[]>([]);
  const sheetRef = useRef<SpreadSheet>();

  const updateOptions = (updatedOptions: Partial<S2Options>) => {
    setOptions(
      mergeWith({}, options, updatedOptions, (origin, updated) => {
        if (isArray(origin) && isArray(updated)) {
          return updated;
        }
      }),
    );
  };

  const onValueInColsCheckChanged = (checked: boolean) => {
    setValueInCols(checked);
    updateOptions({ valueInCols: checked });
  };

  const onHierarchyTypeCheckChanged = (checked: boolean) => {
    updateOptions({ hierarchyType: checked ? 'tree' : 'grid' });
  };

  const onFreezeRowHeaderCheckChanged = (e: CheckboxChangeEvent) => {
    updateOptions({ freezeRowHeader: e.target.checked });
    setFreezeRowHeader(e.target.checked);
  };

  const onLinkFieldsChanged = (ids: string[]) => {
    setLinkFields(ids);
    updateOptions({ linkFieldIds: ids });
  };

  const getSpreadSheet = (sheet: SpreadSheet) => {
    sheetRef.current = sheet;
    sheetRef.current.on(S2Event.ROW_CELL_TEXT_CLICK, ({ key, record }) => {
      message.info(`key: ${key}, name: ${record[key]}`);
    });
  };

  return (
    <div>
      <Space size="middle" style={{ marginBottom: 20 }}>
        <Switch
          checkedChildren="挂列头"
          unCheckedChildren="挂行头"
          defaultChecked={valueInCols}
          onChange={onValueInColsCheckChanged}
          style={{ marginRight: 10 }}
        />
        <Switch
          checkedChildren="树形"
          unCheckedChildren="平铺"
          defaultChecked={false}
          onChange={onHierarchyTypeCheckChanged}
        />

        <Checkbox
          onChange={onFreezeRowHeaderCheckChanged}
          defaultChecked={freezeRowHeader}
        >
          冻结行头
        </Checkbox>

        <Select
          mode="multiple"
          placeholder="请选择 Link Field"
          value={linkFields}
          onChange={onLinkFieldsChanged}
          style={{ width: '200px' }}
        >
          {map(dataCfg.fields.rows, (row) => (
            <Select.Option key={row} value={row}>
              {find(dataCfg.meta, ['field', row])?.name ?? row}
            </Select.Option>
          ))}
        </Select>
      </Space>

      <SheetComponent
        dataCfg={dataCfg}
        options={options}
        getSpreadsheet={getSpreadSheet}
      />
    </div>
  );
}

describe('spreadsheet normal spec', () => {
  act(() => {
    ReactDOM.render(
      <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
      getContainer(),
    );
  });
});
