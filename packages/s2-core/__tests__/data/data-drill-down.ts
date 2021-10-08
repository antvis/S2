import { ID_SEPARATOR } from '@/common/constant';
import { PartDrillDown, PartDrillDownInfo } from '@/components';

export const originData = [
  {
    price: 100,
    province: '辽宁省',
    city: '达州市',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 200,
    province: '辽宁省',
    city: '芜湖市',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 300,
    province: '辽宁省',
    city: '达州市',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 400,
    province: '辽宁省',
    city: '芜湖市',
    category: '家具',
    subCategory: '椅子',
  },

  {
    price: 1100,
    province: '四川省',
    city: '眉山市',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 2200,
    province: '四川省',
    city: '成都',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 3300,
    province: '四川省',
    city: '眉山市',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 4400,
    province: '四川省',
    city: '成都',
    category: '家具',
    subCategory: '椅子',
  },
];

// 达州市下钻 「县城 country」
export const drillDownData1 = [
  {
    price: 60,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 150,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 40,
    province: '辽宁省',
    city: '达州市',
    country: '县城2',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 150,
    province: '辽宁省',
    city: '达州市',
    country: '县城2',
    category: '家具',
    subCategory: '椅子',
  },
];

// 达州市-县城1 下钻 「村 village」
export const drillDownData2 = [
  {
    price: 20,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    village: '新光村1',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 100,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    village: '新光村1',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 40,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    village: '新光村2',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 50,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    village: '新光村2',
    category: '家具',
    subCategory: '椅子',
  },
];

// 眉山市下钻 「县城 country」
export const drillDownData3 = [
  {
    price: 1000,
    province: '四川省',
    city: '眉山市',
    country: '县城A',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 100,
    province: '四川省',
    city: '眉山市',
    country: '县城B',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 1500,
    province: '四川省',
    city: '眉山市',
    country: '县城A',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 1800,
    province: '四川省',
    city: '眉山市',
    country: '县城B',
    category: '家具',
    subCategory: '椅子',
  },
];

// 成都下钻 「县城 country」
export const drillDownData4 = [
  {
    price: 2000,
    province: '四川省',
    city: '成都',
    country: '县城A',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 200,
    province: '四川省',
    city: '成都',
    country: '县城B',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 400,
    province: '四川省',
    city: '成都',
    country: '县城A',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 4000,
    province: '四川省',
    city: '成都',
    country: '县城B',
    category: '家具',
    subCategory: '椅子',
  },
];

// 成都下钻 「村 village」
export const drillDownData5 = [
  {
    price: 1000,
    province: '四川省',
    city: '成都',
    village: '新光村A',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 1200,
    province: '四川省',
    city: '成都',
    village: '新光村B',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 1000,
    province: '四川省',
    city: '成都',
    village: '新光村A',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 3400,
    province: '四川省',
    city: '成都',
    village: '新光村B',
    category: '家具',
    subCategory: '椅子',
  },
];

export const drillData = {
  drillConfig: {
    dataSet: [
      {
        name: '县城',
        value: 'country',
        type: 'text',
      },
      {
        name: '村',
        value: 'village',
        type: 'text',
      },
    ],
  },
  // drillItemsNum: 1,
  fetchData: (meta, drillFields) =>
    new Promise<PartDrillDownInfo>((resolve) => {
      // 弹窗 -> 选择 -> 请求数据
      let drillDownData;
      let field;
      switch (meta.id) {
        case `root${ID_SEPARATOR}辽宁省${ID_SEPARATOR}达州市`:
          if (drillFields[0] !== 'country') return;
          field = 'country';
          drillDownData = drillDownData1;
          break;
        case `root${ID_SEPARATOR}辽宁省${ID_SEPARATOR}达州市${ID_SEPARATOR}县城1`:
          if (drillFields[0] !== 'village') return;
          field = 'village';
          drillDownData = drillDownData2;
          break;
        case `root${ID_SEPARATOR}四川省${ID_SEPARATOR}眉山市`:
          if (drillFields[0] !== 'country') return;
          field = 'country';
          drillDownData = drillDownData3;
          break;
        case `root${ID_SEPARATOR}四川省${ID_SEPARATOR}成都`:
          if (drillFields[0] === 'country') {
            field = 'country';
            drillDownData = drillDownData4;
          } else if (drillFields[0] === 'village') {
            field = 'village';
            drillDownData = drillDownData5;
          }
          break;
        default:
          break;
      }
      resolve({
        drillField: field,
        drillData: drillDownData,
      });
    }),
} as PartDrillDown;
