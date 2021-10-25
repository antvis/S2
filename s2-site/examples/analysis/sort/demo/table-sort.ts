import { SortMethod, TableSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

fetch('../data/basic.json')
  .then((res) => res.json())
  .then((data) => {
    const container = document.getElementById('container');
    const canConvertToNumber = (sortKey: string) =>
      data.every((item) => {
        const v = item[sortKey];
        return typeof v === 'string' && !Number.isNaN(Number(v));
      });
    const s2DataConfig = {
      fields: {
        columns: ['province', 'city', 'type', 'price'],
      },
      data,
      sortParams: [
        {
          sortFieldId: 'price',
          sortBy: ((obj) =>
            canConvertToNumber('price') ? Number(obj.price) : obj.price) as any,
          sortMethod: 'DESC' as SortMethod,
        },
      ],
    };

    const s2options = {
      width: 600,
      height: 600,
    };
    const s2 = new TableSheet(container, s2DataConfig, s2options);

    s2.render();
  });
