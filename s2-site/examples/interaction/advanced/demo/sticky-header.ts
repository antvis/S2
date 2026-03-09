import { PivotSheet, S2Options } from '@antv/s2';

function generateData() {
  const provinces = [
    '浙江省',
    '四川省',
    '广东省',
    '江苏省',
    '湖北省',
    '山东省',
    '河南省',
    '福建省',
  ];
  const cities: Record<string, string[]> = {
    浙江省: ['杭州市', '宁波市', '温州市', '绍兴市'],
    四川省: ['成都市', '绵阳市', '德阳市', '宜宾市'],
    广东省: ['广州市', '深圳市', '东莞市', '佛山市'],
    江苏省: ['南京市', '苏州市', '无锡市', '常州市'],
    湖北省: ['武汉市', '宜昌市', '襄阳市', '荆州市'],
    山东省: ['济南市', '青岛市', '烟台市', '潍坊市'],
    河南省: ['郑州市', '洛阳市', '开封市', '南阳市'],
    福建省: ['福州市', '厦门市', '泉州市', '漳州市'],
  };
  const types = ['家具', '办公用品'];
  const subTypes: Record<string, string[]> = {
    家具: ['桌子', '椅子', '沙发', '书架'],
    办公用品: ['笔', '纸张', '文件夹', '订书机'],
  };

  const data: Record<string, string | number>[] = [];

  for (const province of provinces) {
    for (const city of cities[province]) {
      for (const type of types) {
        for (const subType of subTypes[type]) {
          data.push({
            province,
            city,
            type,
            sub_type: subType,
            number: Math.round(Math.random() * 10000),
          });
        }
      }
    }
  }

  return data;
}

const dataCfg = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
  },
  data: generateData(),
};

const container = document.getElementById('container')!;

const s2Options: S2Options = {
  width: 600,
  height: 2000,
  interaction: {
    stickyHeader: {
      enableInteraction: true,
    },
  },
  hierarchyType: 'tree',
};

const s2 = new PivotSheet(container, dataCfg, s2Options);

s2.render();
