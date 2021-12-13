import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import {
  S2DataConfig,
  S2Options,
  SpreadSheet,
  Node,
  Hierarchy,
  buildTableHierarchy,
  TableSheet,
} from '@antv/s2';
import { getContainer } from '../../util/helpers';
import { data, totalData, meta } from '../../data/mock-dataset.json';
import { SheetComponent } from '@/components';

let spreadsheetIns: SpreadSheet;

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  spreadsheetIns = new TableSheet(dom, dataCfg, options);
  return spreadsheetIns;
};

const getDataCfg = () => {
  return {
    data,
    totalData,
    meta,
    fields: {
      columns: ['province', 'city', 'type', 'sub_type', 'number'],
      valueInCols: true,
    },
  };
};

const getOptions = () => {
  return {
    width: 800,
    height: 600,
    showSeriesNumber: true,
    style: {
      cellCfg: {
        height: 32,
      },
      device: 'pc',
    },
  } as S2Options;
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
