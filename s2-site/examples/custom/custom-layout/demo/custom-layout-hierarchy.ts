import {
  PivotSheet,
  Node,
  generateId,
  S2DataConfig,
  S2Options,
} from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
  .then((res) => res.json())
  .then(async (res) => {
    const container = document.getElementById('container');
    const s2DataConfig: S2DataConfig = {
      fields: {
        rows: ['province', 'city'],
        columns: ['type', 'sub_type'],
        values: ['number'],
      },
      data: [
        ...res.data,
        ...[
          {
            province: '浙江省',
            city: '宁波A',
            type: '家具',
            sub_type: '桌子',
            number: 1001,
          },
          {
            province: '浙江省',
            city: '宁波A',
            type: '家具',
            sub_type: '沙发',
            number: 1002,
          },
          {
            province: '浙江省',
            city: '宁波A',
            type: '办公用品',
            sub_type: '笔',
            number: 1003,
          },
          {
            province: '浙江省',
            city: '宁波A',
            type: '办公用品',
            sub_type: '纸张',
            number: 1004,
          },
        ],
      ],
      meta: [
        {
          field: 'number',
          name: '数量',
        },
        {
          field: 'province',
          name: '省份',
        },
        {
          field: 'city',
          name: '城市',
        },
        {
          field: 'type',
          name: '类别',
        },
        {
          field: 'sub_type',
          name: '子类别',
        },
      ],
    };

    const s2Options: S2Options = {
      width: 600,
      height: 480,
      layoutHierarchy: (s2, node) => {
        // layoutHierarchy 用于手动控制行列结构的增加、删除的特殊场景。
        // 以 「宁波市」为例，删除其节点，增加宁波A和宁波B节点。
        const { field, value } = node;

        if (field === 'city' && value === '宁波市') {
          const preValue = '宁波A';
          const nextValue = '宁波B';

          const parentNode = node.parent;
          const preUniqueId = generateId(parentNode.id, preValue);
          const nextUniqueId = generateId(parentNode.id, nextValue);
          const preNode = new Node({
            ...node,
            id: preUniqueId,
            value: preValue,
            query: { ...parentNode?.query, [node.field]: preValue },
          });

          const nextNode = new Node({
            ...node,
            id: nextUniqueId,
            value: nextValue,
            query: { ...parentNode?.query, [node.field]: nextValue },
          });

          return {
            push: [nextNode],
            unshift: [preNode],
            delete: true,
          };
        }

        return null;
      },
    };

    const s2 = new PivotSheet(container, s2DataConfig, s2Options);

    await s2.render();
  });
