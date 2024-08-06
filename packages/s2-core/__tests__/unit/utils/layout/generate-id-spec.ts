import {
  generateId,
  generateNillString,
  resolveId,
  resolveNillString,
} from '../../../../src/utils/layout/generate-id';

describe('generate-id test', () => {
  test('#generateId()', () => {
    expect(generateId('parent', 'value')).toEqual('parent[&]value');
    expect(generateId('parent', 'null')).toEqual('parent[&]null');
    expect(generateId('parent', 'undefined')).toEqual('parent[&]undefined');
    expect(generateId('parent', null)).toEqual('parent[&]$$null$$');
    expect(generateId('parent', undefined)).toEqual('parent[&]$$undefined$$');
    expect(generateId('parent', 1)).toEqual('parent[&]1');
  });

  test('#resolveId()', () => {
    expect(resolveId('parent[&]value')).toEqual(['parent', 'value']);
    expect(resolveId('parent[&]null')).toEqual(['parent', 'null']);
    expect(resolveId('parent[&]undefined')).toEqual(['parent', 'undefined']);
    expect(resolveId('parent[&]$$null$$')).toEqual(['parent', null]);
    expect(resolveId('parent[&]$$undefined$$')).toEqual(['parent', undefined]);
    expect(resolveId('parent[&]1')).toEqual(['parent', '1']);
  });

  test('#generateNillString()', () => {
    expect(generateNillString('value')).toEqual('value');
    expect(generateNillString(null)).toEqual('$$null$$');
    expect(generateNillString(undefined)).toEqual('$$undefined$$');
    expect(generateNillString(1)).toEqual('1');
  });

  test('#resolveNillString()', () => {
    expect(resolveNillString('value')).toEqual('value');
    expect(resolveNillString('null')).toEqual('null');
    expect(resolveNillString('undefined')).toEqual('undefined');
    expect(resolveNillString('$$null$$')).toEqual(null);
    expect(resolveNillString('$$undefined$$')).toEqual(undefined);
    expect(resolveNillString('1')).toEqual('1');
  });

  test('should generate correct id for normal string variables', () => {
    expect(generateId('root', 'child')).toEqual('root[&]child');

    expect(generateId('parent', 'child', 'grandChild')).toEqual(
      'parent[&]child[&]grandChild',
    );
  });

  test('should distinguish null and `null` in id', () => {
    expect(generateId('root', 'child', null, 'null')).toEqual(
      'root[&]child[&]$$null$$[&]null',
    );

    expect(generateId('root', 'child', undefined, 'undefined')).toEqual(
      'root[&]child[&]$$undefined$$[&]undefined',
    );
  });

  test('should get correct id for normal string variables', () => {
    expect(resolveId('root[&]child')).toEqual(['child']);

    expect(resolveId('parent[&]child[&]grandChild')).toEqual([
      'parent',
      'child',
      'grandChild',
    ]);
  });

  test('should get correct id to distinguish null and `null` in id', () => {
    expect(resolveId('root[&]child[&]$$null$$[&]null')).toEqual([
      'child',
      null,
      'null',
    ]);

    expect(resolveId('root[&]child[&]$$undefined$$[&]undefined')).toEqual([
      'child',
      undefined,
      'undefined',
    ]);
  });
});
