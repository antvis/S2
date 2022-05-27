import { TableSheet } from '@antv/s2';

const s2Options = {
  width: 600,
  height: 480,
  showSeriesNumber: true,
};

export function generateRawData(row, col) {
  const res = [];

  const rowKeys = Object.keys(row);
  const colKeys = Object.keys(col);

  for (let i = 0; i < row[rowKeys[0]]; i++) {
    for (let j = 0; j < row[rowKeys[1]]; j++) {
      for (let m = 0; m < col[colKeys[0]]; m++) {
        for (let n = 0; n < col[colKeys[1]]; n++) {
          res.push({
            province: `p${i}`,
            city: `c${j}`,
            type: `type${m}`,
            subType: `subType${n}`,
            number: i * n,
          });
        }
      }
    }
  }

  return res;
}

const s2DataConfig = {
  fields: {
    columns: ['province', 'city', 'type', 'subType', 'number'],
  },
  data: generateRawData(
    { province: 100, city: 10 },
    { type: 100, sub_type: 10 },
  ),
};

const container = document.getElementById('container');

const s2 = new TableSheet(container, s2DataConfig, s2Options);

s2.render();
