import type { LayoutResult, SpreadSheet } from '../../../../src';
import { CornerHeader } from '../../../../src/facet/header/corner';
import { createFakeSpreadSheet } from '../../../util/helpers';

describe('Corner Tests', () => {
  let s2: SpreadSheet;

  function createCornerNode() {
    const cornerNodes = CornerHeader.getCornerNodes({
      position: {
        x: 0,
        y: 0,
      },
      width: 100,
      height: 50,
      layoutResult: {
        colsHierarchy: {
          sampleNodesForAllLevels: [],
          sampleNodeForLastLevel: {},
        },
        rowsHierarchy: {
          sampleNodesForAllLevels: [],
        },
      } as unknown as LayoutResult,
      seriesNumberWidth: 50,
      spreadsheet: s2,
    });

    return cornerNodes[0];
  }

  beforeEach(() => {
    s2 = createFakeSpreadSheet();
  });

  test('should get default series number text', () => {
    const cornerNode = createCornerNode();

    expect(cornerNode.value).toEqual('序号');
  });

  test('should get custom series number text', () => {
    s2.options.seriesNumber!.text = 'test';
    const cornerNode = createCornerNode();

    expect(cornerNode.value).toEqual('test');
  });
});
