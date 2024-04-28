import { EMPTY_FIELD_VALUE, Node } from '../../../../src';
import { getDimsCondition } from '../../../../src/utils/layout/get-dims-condition-by-node';

describe('get-dims-condition-by-node test', () => {
  test('should get dimension condition', () => {
    const node = new Node({ field: 'test', id: 'test', value: 'value' });
    const emptyFieldNode = new Node({
      field: EMPTY_FIELD_VALUE,
      id: EMPTY_FIELD_VALUE,
      value: EMPTY_FIELD_VALUE,
    });
    const totalRootNode = new Node({
      field: 'root',
      id: 'root',
      value: 'root',
      isTotalRoot: true,
    });

    expect(getDimsCondition(node)).toEqual({ test: 'value' });
    expect(getDimsCondition(emptyFieldNode)).toEqual({});
    expect(getDimsCondition(totalRootNode)).toEqual({});
  });
});
