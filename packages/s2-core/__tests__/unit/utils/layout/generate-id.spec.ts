import { generateId, resolveId } from '@/utils';

describe('generate id test', () => {
  test('should generate correct id for normal string variables', () => {
    expect(generateId('root', 'child')).toEqual('root[&]child');

    expect(generateId('parent', 'child', 'grandChild')).toEqual(
      'parent[&]child[&]grandChild',
    );
  });

  test('should distinguish null and `null` in id', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(generateId('root', 'child', null, 'null')).toEqual(
      'root[&]child[&]$$null$$[&]null',
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(generateId('root', 'child', undefined, 'undefined')).toEqual(
      'root[&]child[&]$$undefined$$[&]undefined',
    );
  });
});

describe('resolve id test', () => {
  test('should get correct id for normal string variables', () => {
    expect(resolveId('root[&]child')).toEqual(['child']);

    expect(resolveId('parent[&]child[&]grandChild')).toEqual([
      'parent',
      'child',
      'grandChild',
    ]);
  });

  test('should get correct id to distinguish null and `null` in id', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(resolveId('root[&]child[&]$$null$$[&]null')).toEqual([
      'child',
      null,
      'null',
    ]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(resolveId('root[&]child[&]$$undefined$$[&]undefined')).toEqual([
      'child',
      undefined,
      'undefined',
    ]);
  });
});
