/**
 * Create By Bruce Too
 * On 2021/6/15
 */
export const originData = [
  {
    price: 1,
    province: '辽宁省',
    city: '达州市',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 2,
    province: '辽宁省',
    city: '芜湖市',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 3,
    province: '辽宁省',
    city: '达州市',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 4,
    province: '辽宁省',
    city: '芜湖市',
    category: '家具',
    subCategory: '椅子',
  },

  {
    price: 11,
    province: '四川省',
    city: '眉山市',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 22,
    province: '四川省',
    city: '成都市',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 33,
    province: '四川省',
    city: '眉山市',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 44,
    province: '四川省',
    city: '成都市',
    category: '家具',
    subCategory: '椅子',
  },
];

// 达州市下钻 「县城 country」
export const drillDownData1 = [
  {
    price: 111,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 222,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 333,
    province: '辽宁省',
    city: '达州市',
    country: '县城2',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 444,
    province: '辽宁省',
    city: '达州市',
    country: '县城2',
    category: '家具',
    subCategory: '椅子',
  },
];

// 达州市-县城1 下钻 村 village
export const drillDownData2 = [
  {
    price: 1111,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    village: '新光村1',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 2222,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    village: '新光村1',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 3333,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    village: '新光村2',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 4444,
    province: '辽宁省',
    city: '达州市',
    country: '县城1',
    village: '新光村2',
    category: '家具',
    subCategory: '椅子',
  },
];

// 眉山市下钻 「县城 country」 -- drill down in same level with drillDownData1
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
    price: 1001,
    province: '四川省',
    city: '眉山市',
    country: '县城B',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 1002,
    province: '四川省',
    city: '眉山市',
    country: '县城A',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 1003,
    province: '四川省',
    city: '眉山市',
    country: '县城B',
    category: '家具',
    subCategory: '椅子',
  },
];

// 眉山市下钻 「村 village」
export const drillDownData4 = [
  {
    price: 1000,
    province: '四川省',
    city: '眉山市',
    village: '新光村A',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 1001,
    province: '四川省',
    city: '眉山市',
    village: '新光村B',
    category: '家具',
    subCategory: '桌子',
  },
  {
    price: 1002,
    province: '四川省',
    city: '眉山市',
    village: '新光村A',
    category: '家具',
    subCategory: '椅子',
  },
  {
    price: 1003,
    province: '四川省',
    city: '眉山市',
    village: '新光村B',
    category: '家具',
    subCategory: '椅子',
  },
];
