import { PivotSheet } from '@antv/s2';
import '@antv/s2/dist/s2.min.css';

const s2options = {
  width: 600,
  height: 400,
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
    rows: ['type', 'subType'],
    columns: ['province', 'city'],
    values: ['number'],
  },
  data: generateRawData(
    { province: 10, city: 100 },
    { type: 10, sub_type: 100 },
  ),
};
const container = document.getElementById('container');

const s2 = new PivotSheet(container, s2DataConfig, s2options);

s2.render();
