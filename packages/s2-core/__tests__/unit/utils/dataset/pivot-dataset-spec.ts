import { deleteMetaById } from '@/utils/dataset/pivot-data-set';
describe('deleteMetaById test', () => {
  test('should execute delete the meta information by id', () => {
    const childrenMeta = {
      level: 0,
      children: new Map(),
      childField: 'country',
    };
    const meta = new Map().set('辽宁省', {
      level: 0,
      children: new Map().set('达州市', childrenMeta),
      childField: 'city',
    });

    deleteMetaById(meta, 'root[&]辽宁省');
    const result = meta.get('辽宁省');
    expect(result.childField).toBeUndefined();
    expect(result.children).toBeEmpty();
  });
});
