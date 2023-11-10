import {
  type S2DataConfig,
  type SpreadSheet,
  type LayoutHierarchyReturnType,
  generateId,
  type ViewMeta,
  type S2Options,
  PivotSheet,
  Node,
} from '../../src';
import { getContainer, getMockData } from '../util/helpers';

const data = getMockData(
  '../../../s2-react/__tests__/data/tableau-supermarket.csv',
);

const dataCfg: S2DataConfig = {
  fields: {
    rows: ['area', 'province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['profit', 'count'],
    valueInCols: true,
  },
  data,
};

const CustomLayoutArrange = (
  spreadsheet: SpreadSheet,
  parent: Node,
  field: string,
  fieldValues: string[],
): string[] => {
  /*
   * 针对city进行顺序的调整. 比如如下是将「 广东 」下[珠海，海门，东莞]进行顺序的调整为
   * [东莞，珠海，海门]
   */
  if (field === 'city' && parent.value === '广东') {
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
  /*
   * 删除「广州」节点，并且在「广州」节点前添加「前序节点A」，
   * 节点后添加「后续节点B」
   */
  const { field, value } = node;

  if (field === 'city' && value === '广州') {
    const preValue = '前序节点A';
    const nextValue = '后序节点A';
    const parentNode = node.parent;
    const preUniqueId = generateId(parentNode!.id, preValue);
    const nextUniqueId = generateId(parentNode!.id, nextValue);
    const preNode = new Node({
      id: preUniqueId,
      field: node.field,
      value: preValue,
      isTotals: node.isTotals,
      isLeaf: node.isLeaf,
      query: { ...parentNode!.query, [node.field]: preValue },
    });

    const nextNode = new Node({
      id: nextUniqueId,
      field: node.field,
      value: nextValue,
      isTotals: node.isTotals,
      isLeaf: node.isLeaf,
      query: { ...parentNode!.query, [node.field]: nextValue },
    });

    return {
      push: [nextNode],
      unshift: [preNode],
      delete: false,
    };
  }

  return {};
};

const CustomLayoutCoordinate = (
  spreadsheet: SpreadSheet,
  rowNode: Node | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colNode: Node | null,
) => {
  // 东莞 这行高度调整为70
  if (rowNode?.value === '东莞') {
    rowNode.height = 70;
  }
};

const CustomLayoutCellMeta = (cellMeta: ViewMeta) => {
  const { rowIndex, colIndex } = cellMeta;

  // 更改 0，0 坐标的值为 999
  if (rowIndex === 0 && colIndex === 0) {
    return {
      ...cellMeta,
      data: {
        $$extra$$: 'profit',
        $$value$$: 999,
        area: '中南',
        sub_type: '系固件',
        type: '办公用品',
      },
      fieldValue: 999,
    };
  }

  return cellMeta;
};

const s2Options: S2Options = {
  width: 800,
  height: 600,
  hierarchyType: 'grid',
  frozen: {
    rowHeader: true,
  },
  style: {
    rowCell: {
      collapseAll: false,
      width: 120,
    },
    dataCell: {
      height: 32,
    },
  },
  tooltip: {
    enable: true,
  },
  // layout hooks
  layoutArrange: CustomLayoutArrange,
  layoutHierarchy: CustomLayoutHierarchy,
  layoutCoordinate: CustomLayoutCoordinate,
  layoutCellMeta: CustomLayoutCellMeta,
};

describe('layout hooks spec', () => {
  let s2: SpreadSheet;

  beforeEach(async () => {
    s2 = new PivotSheet(getContainer(), dataCfg, s2Options);
    await s2.render();
  });

  test('layout arrange hook', () => {
    const rowLeafNodes = s2.facet.getRowLeafNodes();
    let arrangeValues: string[];

    if (s2.isHierarchyTreeType()) {
      arrangeValues = rowLeafNodes.slice(2, 5).map((v) => v.value);
    } else {
      arrangeValues = rowLeafNodes.slice(0, 3).map((v) => v.value);
    }

    expect(arrangeValues).toEqual(['东莞', '珠海', '海门']);
  });

  test('layout hierarchy hook', () => {
    const rowLeafNodes = s2.facet.getRowLeafNodes();
    let addValues: string[];

    if (s2.isHierarchyTreeType()) {
      addValues = rowLeafNodes.slice(5, 8).map((v) => v.value);
    } else {
      addValues = rowLeafNodes.slice(3, 6).map((v) => v.value);
    }

    expect(addValues).toEqual(['前序节点A', '广州', '后序节点A']);
  });

  test('layout coordinate hook', () => {
    const rowLeafNodes = s2.facet.getRowLeafNodes();
    const item = rowLeafNodes.find((rn) => rn.value === '东莞');

    expect(item?.height).toEqual(70);
  });

  test('layout cell meta hook', () => {
    const { fieldValue, data } = s2.facet.getCellMeta(0, 0)!;

    expect(fieldValue).toEqual(999);
    expect(data).toMatchInlineSnapshot(`
      Object {
        "$$extra$$": "profit",
        "$$value$$": 999,
        "area": "中南",
        "sub_type": "系固件",
        "type": "办公用品",
      }
    `);
  });
});
