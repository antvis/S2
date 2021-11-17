import { Radio, Switch } from 'antd';
import 'antd/dist/antd.min.css';
import { cloneDeep, merge } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  S2DataConfig,
  S2Options,
  SpreadSheet,
  PivotSheet,
  Node,
} from '@antv/s2';
import {
  multipleDataWithBottom,
  multipleDataWithCombine,
  multipleDataWithNormal,
} from '../data/multiple-values-cell-mock-data';
import { getContainer } from '../util/helpers';
import { SheetComponent } from '@/components';

let sheet: SpreadSheet;
const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  sheet = new PivotSheet(dom, dataCfg, options);
  (window as any).sheet = sheet;
  return sheet;
};

const getDataCfg = (): S2DataConfig => {
  return {
    fields: {
      rows: ['province', 'city'],
      columns: ['type'],
      values: ['price', 'rc', 'ac', 'count'],
      valueInCols: true,
    },
    meta: [
      {
        field: 'rc',
        name: '同比',
        formatter: (v: string) => v,
      },
      {
        field: 'ac',
        name: '环比',
        formatter: (v: string) => v,
      },
      {
        field: 'price',
        name: '售价',
        formatter: (v: string) => v,
      },
      {
        field: 'price-ac',
        name: '售价(同比)',
        formatter: (v: string) => v,
      },
      {
        field: 'price-rc',
        name: '售价(环比)',
        formatter: (v: string) => v,
      },
      {
        field: 'count',
        name: '销售个数',
        formatter: (v: string) => v,
      },
    ],
    data: multipleDataWithNormal,
    sortParams: [
      // { sortFieldId: 'price', sortMethod: 'DESC' }
    ],
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
    frozenRowHeader: false,
    conditions: {
      text: [],
      interval: [
        {
          field: 'price',
          mapping() {
            return {
              fill: 'yellow',
              maxValue: 3000,
              minValue: 0,
            };
          },
        },
      ],
      background: [
        {
          field: 'price',
          mapping() {
            return { fill: 'rgb(218, 251, 225)' };
          },
        },
      ],
      icon: [
        {
          field: 'price',
          mapping() {
            return { fill: 'black', icon: 'Trend' };
          },
        },
      ],
    },
    headerActionIcons: [
      {
        iconNames: ['SortDown', 'SortUp'],
        belongsCell: 'colCell',
        displayCondition: (meta: Node) => meta.level >= 0,
        action() {},
      },
    ],
    selectedCellsSpotlight: true,
    hoverHighlight: true,
    tooltip: {
      showTooltip: true,
    },
    style: {
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
      },
      cellCfg: {
        height: 32,
      },
      device: 'pc',
    },
  } as S2Options;
};

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);

  const [mode, setMode] = React.useState('grid');
  const [valueInCols, setValueInCols] = React.useState(true);
  const [arrangement, setArrangement] = React.useState('normal');

  const onValueInColsChange = (checked) => {
    setValueInCols(checked);

    setDataCfg(
      merge({}, dataCfg, {
        fields: {
          valueInCols: checked,
        },
      }),
    );
  };

  const onModeChange = (checked) => {
    setMode(checked ? 'tree' : 'grid');
    setOptions(
      merge({}, options, {
        hierarchyType: checked ? 'tree' : 'grid',
      }),
    );
  };

  const onArrangementChange = (value: string) => {
    setArrangement(value);
    const newData = cloneDeep(dataCfg);
    switch (value) {
      case 'normal':
        newData.data = multipleDataWithNormal;
        break;
      case 'bottom':
        newData.data = multipleDataWithBottom;

        break;
      case 'combine':
        newData.data = multipleDataWithCombine;
        break;
      default:
        break;
    }
    setDataCfg(newData);
  };

  return (
    <div>
      <div style={{ display: 'inline-block', marginBottom: 20 }}>
        <Switch
          checkedChildren="挂列头"
          unCheckedChildren="挂行头"
          defaultChecked={valueInCols}
          onChange={onValueInColsChange}
          style={{ marginRight: 10 }}
        />
        <Switch
          checkedChildren="树形"
          unCheckedChildren="平铺"
          checked={mode === 'tree'}
          onChange={onModeChange}
          style={{ marginRight: 10 }}
        />
        <Radio.Group
          onChange={(e) => onArrangementChange(e.target.value)}
          value={arrangement}
        >
          <Radio value={'normal'}>默认</Radio>
          <Radio value={'bottom'}>下方</Radio>
          <Radio value={'combine'}>合并</Radio>
        </Radio.Group>
      </div>
      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        spreadsheet={getSpreadSheet}
      />
    </div>
  );
}

describe('spreadsheet multiple values cell spec', () => {
  act(() => {
    ReactDOM.render(
      <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
      getContainer(),
    );
  });

  test('should generate default conditions', () => {
    const { icon, text } = sheet.options.conditions;

    expect(icon).toHaveLength(1);
    expect(text).toHaveLength(0);

    expect(icon).toEqual([
      {
        field: 'price',
        mapping: expect.any(Function),
      },
    ]);

    expect(text).toEqual([]);
  });
});
