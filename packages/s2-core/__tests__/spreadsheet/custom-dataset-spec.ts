import { pick } from 'lodash';
import { createPivotSheet } from 'tests/util/helpers';
import { Node, PivotDataSet } from '../../src';

describe('SpreadSheet Custom Dataset Tests', () => {
  class CustomDataSet extends PivotDataSet {
    public getFieldName() {
      return 'test';
    }
  }

  const mapNodes = (nodes: Node[]) => {
    return nodes.map((node) => pick(node, ['id', 'value']));
  };

  test('should render custom data set', async () => {
    const s2 = createPivotSheet({
      dataSet: (spreadsheet) => new CustomDataSet(spreadsheet),
    });

    await s2.render();

    const headerNodes = mapNodes(s2.facet.getHeaderNodes());

    expect(headerNodes).toMatchSnapshot();
  });
});
