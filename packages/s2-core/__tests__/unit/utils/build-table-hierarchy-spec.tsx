import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import { assembleDataCfg } from 'tests/util/sheet-entry';
import { getContainer } from '../../util/helpers';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
  TableSheet,
  Node,
  Hierarchy,
} from '@/index';
import { buildTableHierarchy } from '@/facet/layout/build-table-hierarchy';

let spreadsheetIns: SpreadSheet;

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  spreadsheetIns = new TableSheet(dom, dataCfg, options);
  return spreadsheetIns;
};

const tableDataFields = {
  fields: {
    columns: ['province', 'city', 'type', 'sub_type', 'number'],
    valueInCols: true,
  },
};

const getDataCfg = () => {
  return assembleDataCfg(tableDataFields);
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

function MainLayout(props) {
  return (
    <div>
      <div style={{ display: 'inline-block' }}></div>
      <SheetComponent
        sheetType={'table'}
        dataCfg={props.dataCfg}
        adaptive={false}
        options={props.options}
        spreadsheet={getSpreadSheet}
      />
    </div>
  );
}

describe('buildTableHierarchy', () => {
  test('should generate nodes and hierarchy correctly', () => {
    act(() => {
      ReactDOM.render(
        <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
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

    expect(rootNode).toMatchSnapshot();
    expect(hierarchy).toMatchSnapshot();
  });
});
