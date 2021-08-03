import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import {
  S2DataConfig,
  S2Options,
  SheetComponent,
  SpreadSheet,
} from '../../src';
import { getContainer } from '../util/helpers';
import ReactDOM from 'react-dom';
import React from 'react';
import { transformCustomTreeItems } from '@/facet/layout/util/transform-custom-tree-items';
import { customTreeItems } from '../data/custom-tree-items';
import { dataCustomTrees } from '../data/data-custom-trees';

const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  return new SpreadSheet(dom, dataCfg, options);
};

const getDataCfg = () => {
  return {
    fields: {
      rows: [],
      columns: ['category', 'subCategory'],
      values: [
        'measure-a',
        'measure-b',
        'measure-c',
        'measure-d',
        'measure-e',
        'measure-f',
      ],
      customTreeItems: transformCustomTreeItems(customTreeItems),
      valueInCols: false,
    },
    meta: [],
    data: dataCustomTrees,
  } as S2DataConfig;
};

const getOptions = () => {
  return {
    debug: true,
    width: 800,
    height: 600,
    hierarchyType: 'customTree',
    hierarchyCollapse: false,
    freezeRowHeader: false,
    mode: 'pivot',
    style: {
      treeRowsWidth: 120,
      collapsedRows: {},
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
        colWidthType: 'adaptive',
      },
      cellCfg: {
        height: 32,
      },
    },
    tooltip: {
      showTooltip: true,
    },
  };
};

function MainLayout({ options, dataCfg }) {
  return (
    <div>
      <SheetComponent
        dataCfg={dataCfg}
        adaptive={false}
        options={options}
        spreadsheet={getSpreadSheet}
      />
    </div>
  );
}

describe('custom tree header spec', () => {
  test('demo', () => {
    expect(1).toBe(1);
  });

  act(() => {
    ReactDOM.render(
      <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
      getContainer(),
    );
  });
});
