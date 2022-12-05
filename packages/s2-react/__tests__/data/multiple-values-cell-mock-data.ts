import type { RawData } from '@antv/s2';

export const multipleDataWithNormal: RawData[] = [
  {
    province: '四川',
    city: '成都',
    type: '洗衣机',
    price: 2000,
    count: 120,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '四川',
    city: '简阳',
    type: '电视',
    price: 2400,
    count: 120,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '四川',
    city: '成都',
    type: '装订机',
    price: 200,
    count: 5000,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '四川',
    city: '成都',
    type: '美术',
    price: 200,
    count: 10,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '重庆',
    city: '重庆',
    type: '洗衣机',
    price: 2000,
    count: 120,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '重庆',
    city: '彭州',
    type: '洗衣机',
    price: 2000,
    count: 120,
    rc: 0.43,
    ac: -0.2,
  },
];

export const multipleDataWithBottom: RawData[] = [
  {
    province: '四川',
    city: '成都',
    type: '洗衣机',
    price: {
      values: [[2000], [0.43], [-0.2]],
    },
    count: 120,
  },
  {
    province: '四川',
    city: '简阳',
    type: '电视',
    price: {
      values: [[2400], [0.43], [-0.2]],
    },
    count: 120,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '四川',
    city: '成都',
    type: '装订机',
    price: {
      values: [[200], [0.43], [-0.2]],
    },
    count: 5000,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '四川',
    city: '成都',
    type: '美术',
    price: {
      values: [[200], [0.43], [-0.2]],
    },
    count: 10,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '重庆',
    city: '重庆',
    type: '洗衣机',
    price: {
      values: [[2000], [0.43], [-0.2]],
    },
    count: 120,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '重庆',
    city: '彭州',
    type: '洗衣机',
    price: {
      values: [[2400], [0.43], [-0.2]],
    },
    count: 120,
    rc: 0.43,
    ac: -0.2,
  },
];

export const multipleDataWithCombine: RawData[] = [
  {
    province: '四川',
    city: '成都',
    type: '洗衣机',
    price: {
      values: [[2000, 0.43, -0.2]],
    },
    count: 120,
  },
  {
    province: '四川',
    city: '简阳',
    type: '电视',
    price: {
      values: [[2400, 0.43, -0.2]],
    },
    count: 120,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '四川',
    city: '成都',
    type: '装订机',
    price: {
      values: [[200, 0.43, -0.2]],
    },
    count: 5000,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '四川',
    city: '成都',
    type: '美术',
    price: {
      values: [[200, 0.43, -0.2]],
    },
    count: 10,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '重庆',
    city: '重庆',
    type: '洗衣机',
    price: {
      values: [[2000, 0.43, -0.2]],
    },
    count: 120,
    rc: 0.43,
    ac: -0.2,
  },
  {
    province: '重庆',
    city: '彭州',
    type: '洗衣机',
    price: {
      values: [[2400, 0.43, -0.2]],
    },
    count: 120,
    rc: 0.43,
    ac: -0.2,
  },
];
