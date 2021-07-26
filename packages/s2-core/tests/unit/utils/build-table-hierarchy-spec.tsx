import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
  Node,
  Hierarchy,
} from '../../../src';
import { buildTableHierarchy } from '../../../src/facet/layout/build-table-hierarchy';
import { getContainer, getMockData } from '../../util/helpers';
import ReactDOM from 'react-dom';
import React from 'react';

const data = getMockData('../data/tableau-supermarket.csv');

let spreadsheetIns: SpreadSheet;

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  spreadsheetIns = new SpreadSheet(dom, dataCfg, options);
  return spreadsheetIns;
};

const getDataCfg = () => {
  return {
    fields: {
      columns: [
        'area',
        'province',
        'city',
        'type',
        'sub_type',
        'profit',
        'count',
      ],
    },
    data,
  };
};

const getOptions = () => {
  return {
    width: 800,
    height: 600,
    showSeriesNumber: true,
    mode: 'table',
    style: {
      colCfg: {
        colWidthType: 'compact',
      },
      cellCfg: {
        height: 32,
      },
      device: 'pc',
    },
  };
};

const getTheme = () => {
  return {};
};

function MainLayout(props) {
  const [options, setOptions] = React.useState(props.options);
  const [dataCfg, setDataCfg] = React.useState(props.dataCfg);

  return (
    <div>
      <div style={{ display: 'inline-block' }}></div>
      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        theme={props.theme}
        spreadsheet={getSpreadSheet}
      />
    </div>
  );
}

describe('buildTableHierarchy', () => {
  test('sort action with number arr', () => {
    act(() => {
      ReactDOM.render(
        <MainLayout
          dataCfg={getDataCfg()}
          options={getOptions()}
          theme={getTheme()}
        />,
        getContainer(),
      );
    });

    const rootNode = Node.rootNode();
    const hierarchy = new Hierarchy();

    buildTableHierarchy({
      parentNode: rootNode,
      facetCfg: spreadsheetIns.facet.cfg,
      hierarchy,
    });

    expect(JSON.stringify(rootNode)).toMatchSnapshot();
    expect(JSON.stringify(hierarchy)).toMatchSnapshot();
  });
});
