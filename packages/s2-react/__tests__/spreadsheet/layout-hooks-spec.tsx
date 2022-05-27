import { act } from 'react-dom/test-utils';
import 'antd/dist/antd.min.css';
import ReactDOM from 'react-dom';
import React from 'react';
import {
  GetCellMeta,
  Node,
  S2DataConfig,
  S2Options,
  SpreadSheet,
  PivotSheet,
  SpreadSheetFacetCfg,
  ViewMeta,
  LayoutHierarchyReturnType,
  generateId,
} from '@antv/s2';
import { getContainer, getMockData } from '../util/helpers';
import { SheetComponent } from '@/components';
const data = getMockData('../data/tableau-supermarket.csv');

let innerSS: SpreadSheet;
const getSpreadSheet = (
  dom: string | HTMLElement,
  dataCfg: S2DataConfig,
  options: S2Options,
) => {
  innerSS = new PivotSheet(dom, dataCfg, options);
  return innerSS;
};

const getDataCfg = () => {
  return {
    fields: {
      rows: ['area', 'province', 'city'],
      columns: ['type', 'sub_type'],
      values: ['profit', 'count'],
      valueInCols: true,
    },
    meta: [
      {
        field: 'count',
        name: '销售个数',
        formatter: (v) => v,
      },
      {
        field: 'profit',
        name: '利润',
        formatter: (v) => v,
      },
    ],
    data,
  } as S2DataConfig;
};

const CustomLayoutArrange = (
  spreadsheet: SpreadSheet,
  parent: Node,
  field: string,
  fieldValues: string[],
): string[] => {
  // 针对city进行顺序的调整. 比如如下是将「 广东 」下[珠海，海门，东莞]进行顺序的调整为
  // [东莞，珠海，海门]
  if (field === 'city' && parent.label === '广东') {
    const index1 = fieldValues.indexOf('珠海');
    const index2 = fieldValues.indexOf('海门');
    const index3 = fieldValues.indexOf('东莞');
    fieldValues[index1] = '东莞';
    fieldValues[index2] = '珠海';
    fieldValues[index3] = '海门';
  }
  return fieldValues;
};

const CustomLayoutHierarchy = (
  spreadsheet: SpreadSheet,
  node: Node,
): LayoutHierarchyReturnType => {
  // 删除「广州」节点，并且在「广州」节点前添加「前序节点A」，
  // 节点后添加「后续节点B」
  const { field, label } = node;
  if (field === 'city' && label === '广州') {
    const preValue = '前序节点A';
    const nextValue = '后序节点A';
    const parentNode = node.parent;
    const preUniqueId = generateId(parentNode.id, preValue);
    const nextUniqueId = generateId(parentNode.id, nextValue);
    const preNode = new Node({
      ...node.config,
      id: preUniqueId,
      key: node.key,
      label: preValue,
      value: preValue,
      isTotals: node.isTotals,
      isLeaf: node.isLeaf,
      query: { ...parentNode.query, [node.key]: preValue },
    });

    const nextNode = new Node({
      ...node.config,
      id: nextUniqueId,
      key: node.key,
      label: nextValue,
      value: nextValue,
      isTotals: node.isTotals,
      isLeaf: node.isLeaf,
      query: { ...parentNode.query, [node.key]: nextValue },
    });

    return {
      push: [nextNode],
      unshift: [preNode],
      delete: false,
    };
  }
  return null; // 默认直接返回null即可
};

const CustomLayoutCoordinate = (
  facetCfg: SpreadSheetFacetCfg,
  rowNode: Node,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colNode: Node,
) => {
  // 东莞 这行高度调整为70
  if (rowNode?.label === '东莞') {
    rowNode.height = 70;
  }
};

const CustomLayoutDataPosition = (
  spreadsheet: SpreadSheet,
  getCellData: GetCellMeta,
): GetCellMeta => {
  const getCellMeta = (rowIndex: number, colIndex: number): ViewMeta => {
    const viewMeta = getCellData(rowIndex, colIndex);
    // 更改0，0 坐标的值为 999
    if (rowIndex === 0 && colIndex === 0) {
      return {
        ...viewMeta,
        data: [
          {
            $$extra$$: 'profit',
            $$value$$: 999,
            area: '中南',
            sub_type: '系固件',
            type: '办公用品',
          },
        ],
        fieldValue: 999,
      };
    }
    return viewMeta;
  };
  return getCellMeta;
};

const getOptions = () => {
  return {
    debug: true,
    width: 800,
    height: 600,
    hierarchyType: 'grid',
    hierarchyCollapse: false,
    frozenRowHeader: true,
    style: {
      treeRowsWidth: 120,
      collapsedRows: {},
      colCfg: {
        widthByFieldValue: {},
        heightByField: {},
      },
      cellCfg: {
        height: 32,
      },
    },
    tooltip: {
      showTooltip: true,
    },
    // layout hooks
    layoutArrange: CustomLayoutArrange,
    layoutHierarchy: CustomLayoutHierarchy,
    layoutCoordinate: CustomLayoutCoordinate,
    layoutDataPosition: CustomLayoutDataPosition,
  };
};

const MainLayout = ({ options, dataCfg }) => {
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
};

describe('layout hooks spec', () => {
  test('layout arrange hook', () => {
    const { rowLeafNodes } = innerSS.facet.layoutResult;
    let arrangeValues;
    if (innerSS.options.hierarchyType === 'tree') {
      arrangeValues = rowLeafNodes.slice(2, 5).map((v) => v.label);
    } else {
      arrangeValues = rowLeafNodes.slice(0, 3).map((v) => v.label);
    }
    expect(arrangeValues).toEqual(['东莞', '珠海', '海门']);
  });

  test('layout hierarchy hook', () => {
    const { rowLeafNodes } = innerSS.facet.layoutResult;
    let addValues;
    if (innerSS.options.hierarchyType === 'tree') {
      addValues = rowLeafNodes.slice(5, 8).map((v) => v.label);
    } else {
      addValues = rowLeafNodes.slice(3, 6).map((v) => v.label);
    }
    expect(addValues).toEqual(['前序节点A', '广州', '后序节点A']);
  });

  test('layout coordinate hook', () => {
    const { rowLeafNodes } = innerSS.facet.layoutResult;
    const item = rowLeafNodes.find((rn) => rn.label === '东莞');
    expect(item?.height).toEqual(70);
  });

  test('layout data position hook', () => {
    const { getCellMeta } = innerSS.facet.layoutResult;
    const { fieldValue } = getCellMeta(0, 0);
    expect(fieldValue).toEqual(999);
  });

  act(() => {
    ReactDOM.render(
      <MainLayout dataCfg={getDataCfg()} options={getOptions()} />,
      getContainer(),
    );
  });
});
