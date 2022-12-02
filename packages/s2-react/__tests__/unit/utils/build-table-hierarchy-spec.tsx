import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import {
  type S2DataConfig,
  type S2Options,
  SpreadSheet,
  Node,
  Hierarchy,
  buildTableHierarchy,
  TableSheet,
  DeviceType,
  type S2MountContainer,
} from '@antv/s2';
import { getContainer } from '../../util/helpers';
import { data, totalData, meta } from '../../data/mock-dataset.json';
import { SheetComponent, type SheetComponentsProps } from '@/components';

let spreadsheetIns: SpreadSheet;

const onMounted = (
  dom: S2MountContainer,
  dataCfg: S2DataConfig,
  options: SheetComponentsProps['options'],
) => {
  spreadsheetIns = new TableSheet(dom, dataCfg, options as S2Options);
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

const getOptions = (): SheetComponentsProps['options'] => {
  return {
    width: 800,
    height: 600,
    showSeriesNumber: true,
    style: {
      cellCfg: {
        height: 32,
      },
      device: DeviceType.PC,
    },
  };
};

function MainLayout(props: SheetComponentsProps) {
  return (
    <div>
      <div style={{ display: 'inline-block' }}></div>
      <SheetComponent
        sheetType={'table'}
        dataCfg={props.dataCfg}
        adaptive={false}
        options={props.options}
        spreadsheet={onMounted}
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
