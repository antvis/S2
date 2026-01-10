import type { S2DataConfig } from '@antv/s2';

export const ChartDataConfig: S2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
    valueInCols: true,
  },
  meta: [
    {
      field: 'number',
      name: '数量',
      description: '数量说明。。',
    },
    {
      field: 'province',
      name: '省份',
      description: '省份说明。。',
    },
    {
      field: 'city',
      name: '城市',
      description: '城市说明。。',
    },
    {
      field: 'type',
      name: '类别',
      description: '类别说明。。',
    },
    {
      field: 'sub_type',
      name: '子类别',
      description: '子类别说明。。',
    },
    {
      field: 'area',
      name: '地区',
      description: '地区说明。。',
    },
    {
      field: 'money',
      name: '金额',
      description: '金额说明。。',
    },
  ],
  data: [
    {
      number: {
        values: {
          // 面积图
          type: 'area',
          autoFit: true,
          data: {
            type: 'fetch',
            value: 'https://assets.antv.antgroup.com/g2/aapl.json',
          },
          encode: {
            x: (d: Record<string, string | number>) => new Date(d['date']),
            y: 'close',
          },
        },
      },
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: {
        // 玉玦图
        values: {
          type: 'interval',
          autoFit: true,
          data: [
            { question: '问题 1', percent: 0.21 },
            { question: '问题 2', percent: 0.4 },
            { question: '问题 3', percent: 0.49 },
            { question: '问题 4', percent: 0.52 },
            { question: '问题 5', percent: 0.53 },
            { question: '问题 6', percent: 0.84 },
            { question: '问题 7', percent: 1 },
            { question: '问题 8', percent: 1.2 },
          ],
          encode: { x: 'question', y: 'percent', color: 'percent' },
          scale: { color: { range: '#BAE7FF-#1890FF-#0050B3' } },
          coordinate: {
            type: 'radial',
            innerRadius: 0.1,
            endAngle: 3.141592653589793,
          },
          style: { stroke: 'white' },
          animate: { enter: { type: 'waveIn', duration: 800 } },
          // animate: false,
          legend: {
            color: {
              length: 400,
              position: 'bottom',
              layout: { justifyContent: 'center' },
            },
          },
        },
      },
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: {
        // 柱形图
        values: {
          type: 'interval',
          autoFit: true,
          data: [
            { genre: 'Sports', sold: 275 },
            { genre: 'Strategy', sold: 115 },
            { genre: 'Action', sold: 120 },
            { genre: 'Shooter', sold: 350 },
            { genre: 'Other', sold: 150 },
          ],
          scale: {
            color: {
              guide: {
                position: 'right',
                size: 80,
              },
            },
          },
          encode: {
            x: 'genre',
            y: 'sold',
            color: 'genre',
          },
        },
      },
      province: '浙江省',
      city: '宁波市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: {
        // 仪表盘
        values: {
          type: 'gauge',
          autoFit: true,
          data: {
            value: {
              target: 159,
              total: 400,
              name: 'score',
              thresholds: [100, 200, 400],
            },
          },
          scale: { color: { range: ['#F4664A', '#FAAD14', 'green'] } },
          style: {
            textContent: (target: number, total: number) => `得分：${target}\
        占比：${(target / total) * 100}%`,
          },
          legend: false,
        },
      },
      province: '浙江省',
      city: '舟山市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: {
        // 雷达图
        values: {
          type: 'view',
          autoFit: true,
          data: [
            { item: 'Design', type: 'a', score: 70 },
            { item: 'Design', type: 'b', score: 30 },
            { item: 'Development', type: 'a', score: 60 },
            { item: 'Development', type: 'b', score: 70 },
            { item: 'Marketing', type: 'a', score: 50 },
            { item: 'Marketing', type: 'b', score: 60 },
            { item: 'Users', type: 'a', score: 40 },
            { item: 'Users', type: 'b', score: 50 },
            { item: 'Test', type: 'a', score: 60 },
            { item: 'Test', type: 'b', score: 70 },
            { item: 'Language', type: 'a', score: 70 },
            { item: 'Language', type: 'b', score: 50 },
            { item: 'Technology', type: 'a', score: 50 },
            { item: 'Technology', type: 'b', score: 40 },
            { item: 'Support', type: 'a', score: 30 },
            { item: 'Support', type: 'b', score: 40 },
            { item: 'Sales', type: 'a', score: 60 },
            { item: 'Sales', type: 'b', score: 40 },
            { item: 'UX', type: 'a', score: 50 },
            { item: 'UX', type: 'b', score: 60 },
          ],
          scale: { x: { padding: 0.5, align: 0 }, y: { tickCount: 5 } },
          coordinate: { type: 'polar' },
          axis: { x: { grid: true }, y: { zIndex: 1, title: false } },
          interaction: { tooltip: { crosshairsLineDash: [4, 4] } },
          children: [
            {
              type: 'area',
              encode: { x: 'item', y: 'score', color: 'type', shape: 'smooth' },
              scale: { y: { domainMax: 80 } },
              style: { fillOpacity: 0.5 },
            },
            {
              type: 'line',
              encode: { x: 'item', y: 'score', color: 'type', shape: 'smooth' },
              style: { lineWidth: 2 },
            },
          ],
        },
      },
      province: '浙江省',
      city: '杭州市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: {
        // 面积图
        values: {
          type: 'box',
          autoFit: true,
          data: [
            { x: 'Oceania', y: [1, 9, 16, 22, 24] },
            { x: 'East Europe', y: [1, 5, 8, 12, 16] },
            { x: 'Australia', y: [1, 8, 12, 19, 26] },
            { x: 'South America', y: [2, 8, 12, 21, 28] },
            { x: 'North Africa', y: [1, 8, 14, 18, 24] },
            { x: 'North America', y: [3, 10, 17, 28, 30] },
            { x: 'West Europe', y: [1, 7, 10, 17, 22] },
            { x: 'West Africa', y: [1, 6, 8, 13, 16] },
          ],
          encode: { x: 'x', y: 'y', color: 'x' },
          scale: {
            x: { paddingInner: 0.6, paddingOuter: 0.3 },
            y: { zero: true },
          },
          style: { stroke: 'black' },
          legend: false,
          tooltip: {
            items: [
              { name: 'min', channel: 'y' },
              { name: 'q1', channel: 'y1' },
              { name: 'q2', channel: 'y2' },
              { name: 'q3', channel: 'y3' },
              { name: 'max', channel: 'y4' },
            ],
          },
        },
      },
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: {
        // 饼图
        values: {
          type: 'view',
          autoFit: true,
          coordinate: { type: 'theta', innerRadius: 0.6 },
          children: [
            {
              type: 'interval',
              data: {
                type: 'fetch',
                value:
                  'https://gw.alipayobjects.com/os/bmw-prod/79fd9317-d2af-4bc4-90fa-9d07357398fd.csv',
              },
              encode: { y: 'value', color: 'name' },
              transform: [{ type: 'stackY' }],
              scale: {
                color: {
                  palette: 'spectral',
                  offset: (t: number) => t * 0.8 + 0.1,
                },
              },
              legend: false,
            },
            {
              type: 'text',
              style: {
                text: 'Donut',
                x: '50%',
                y: '50%',
                fontSize: 40,
                fontWeight: 'bold',
                textAlign: 'center',
              },
            },
            {
              type: 'text',
              style: {
                text: 'chart',
                x: 304,
                y: 360,
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
              },
            },
          ],
        },
      },
      province: '浙江省',
      city: '宁波市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: {
        // 折线图
        values: {
          type: 'line',
          autoFit: true,
          data: {
            type: 'fetch',
            value: 'https://assets.antv.antgroup.com/g2/indices.json',
          },
          encode: {
            x: (d: Record<string, string | number>) => new Date(d['Date']),
            y: 'Close',
            color: 'Symbol',
          },
          transform: [{ type: 'normalizeY', basis: 'first', groupBy: 'color' }],
          scale: { y: { type: 'log' } },
          axis: { y: { title: '↑ Change in price (%)' } },
          labels: [{ text: 'Symbol', selector: 'last', fontSize: 10 }],
          tooltip: { items: [{ channel: 'y', valueFormatter: '.1f' }] },
        },
      },
      province: '浙江省',
      city: '舟山市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: {
        // 柱形图
        values: {
          type: 'interval',
          autoFit: true,
          data: [
            { genre: 'Sports', sold: 275 },
            { genre: 'Strategy', sold: 115 },
            { genre: 'Action', sold: 120 },
            { genre: 'Shooter', sold: 350 },
            { genre: 'Other', sold: 150 },
          ],
          scale: {
            color: {
              guide: {
                position: 'right',
                size: 80,
              },
            },
          },
          encode: {
            x: 'genre',
            y: 'sold',
            color: 'genre',
          },
        },
      },
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: {
        // 漏斗图
        values: {
          type: 'interval',
          autoFit: true,
          data: [
            { action: '浏览网站', pv: 50000 },
            { action: '放入购物车', pv: 35000 },
            { action: '生成订单', pv: 25000 },
            { action: '支付订单', pv: 15000 },
            { action: '完成交易', pv: 8000 },
          ],
          encode: { x: 'action', y: 'pv', color: 'action', shape: 'funnel' },
          transform: [{ type: 'symmetryY' }],
          scale: { x: { padding: 0 } },
          coordinate: { transform: [{ type: 'transpose' }] },
          animate: { enter: { type: 'fadeIn' } },
          axis: false,
          labels: [
            {
              text: (d: Record<string, string | number>) => `${d['action']}\
        ${d['pv']}`,
              position: 'inside',
              transform: [{ type: 'contrastReverse' }],
            },
          ],
        },
      },
      province: '浙江省',
      city: '绍兴市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: {
        // 出现顺序堆叠面积图
        values: {
          type: 'view',
          autoFit: true,
          data: {
            type: 'fetch',
            value:
              'https://gw.alipayobjects.com/os/bmw-prod/f38a8ad0-6e1f-4bb3-894c-7db50781fdec.json',
          },
          interaction: {
            tooltip: {
              filter: (d: Record<string, string>) =>
                parseInt(d['value'], 10) > 0,
            },
          },
          children: [
            {
              type: 'area',
              encode: {
                x: (d: Record<string, string>) => new Date(d['year']),
                y: 'revenue',
                series: 'format',
                color: 'group',
                shape: 'smooth',
              },
              transform: [
                { type: 'stackY', orderBy: 'maxIndex', reverse: true },
              ],
              axis: { y: { labelFormatter: '~s' } },
              tooltip: { items: [{ channel: 'y', valueFormatter: '.2f' }] },
            },
            {
              type: 'line',
              encode: {
                x: (d: Record<string, string>) => new Date(d['year']),
                y: 'revenue',
                series: 'format',
                shape: 'smooth',
                color: 'group',
              },
              transform: [
                { type: 'stackY', orderBy: 'maxIndex', reverse: true, y: 'y1' },
              ],
              style: { stroke: 'white' },
              tooltip: false,
            },
          ],
        },
      },
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: {
        // 密度热力图
        values: {
          type: 'view',
          autoFit: true,
          padding: 0,
          axis: false,
          children: [
            {
              type: 'image',
              style: {
                src: 'https://gw.alipayobjects.com/zos/rmsportal/NeUTMwKtPcPxIFNTWZOZ.png',
                x: '50%',
                y: '50%',
                width: '100%',
                height: '100%',
              },
              tooltip: false,
            },
            {
              type: 'heatmap',
              data: {
                type: 'fetch',
                value: 'https://assets.antv.antgroup.com/g2/heatmap.json',
              },
              encode: { x: 'g', y: 'l', color: 'tmp' },
              style: { opacity: 0 },
              tooltip: false,
            },
          ],
        },
      },
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 1343,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1354,
      province: '浙江省',
      city: '绍兴市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1523,
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1634,
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 1723,
      province: '四川省',
      city: '成都市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 1822,
      province: '四川省',
      city: '绵阳市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 1943,
      province: '四川省',
      city: '南充市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 2330,
      province: '四川省',
      city: '乐山市',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 2451,
      province: '四川省',
      city: '成都市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2244,
      province: '四川省',
      city: '绵阳市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2333,
      province: '四川省',
      city: '南充市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2445,
      province: '四川省',
      city: '乐山市',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 2335,
      province: '四川省',
      city: '成都市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 245,
      province: '四川省',
      city: '绵阳市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 2457,
      province: '四川省',
      city: '南充市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 2458,
      province: '四川省',
      city: '乐山市',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 4004,
      province: '四川省',
      city: '成都市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 3077,
      province: '四川省',
      city: '绵阳市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 3551,
      province: '四川省',
      city: '南充市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 352,
      province: '四川省',
      city: '乐山市',
      type: '办公用品',
      sub_type: '纸张',
    },
  ],
  totalData: [
    {
      number: 26193,
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 49709,
      type: '家具',
    },
    {
      number: 23516,
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 29159,
      type: '办公用品',
    },
    {
      number: 12321,
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 16838,
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 18375,
      province: '浙江省',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 14043,
      province: '浙江省',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 4826,
      province: '浙江省',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 5854,
      province: '浙江省',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 7818,
      province: '四川省',
      type: '家具',
      sub_type: '桌子',
    },
    {
      number: 9473,
      province: '四川省',
      type: '家具',
      sub_type: '沙发',
    },
    {
      number: 7495,
      province: '四川省',
      type: '办公用品',
      sub_type: '笔',
    },
    {
      number: 10984,
      province: '四川省',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: 13132,
      province: '浙江省',
      city: '杭州市',
      type: '家具',
    },
    {
      number: 2288,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
    },
    {
      number: 15420,
      province: '浙江省',
      city: '杭州市',
    },
    {
      number: 2999,
      province: '浙江省',
      city: '绍兴市',
      type: '家具',
    },
    {
      number: 2658,
      province: '浙江省',
      city: '绍兴市',
      type: '办公用品',
    },
    {
      number: 5657,
      province: '浙江省',
      city: '绍兴市',
    },
    {
      number: 11111,
      province: '浙江省',
      city: '宁波市',
      type: '家具',
    },
    {
      number: 2668,
      province: '浙江省',
      city: '宁波市',
      type: '办公用品',
    },
    {
      number: 13779,
      province: '浙江省',
      city: '宁波市',
    },
    {
      number: 5176,
      province: '浙江省',
      city: '舟山市',
      type: '家具',
    },
    {
      number: 3066,
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
    },
    {
      number: 8242,
      province: '浙江省',
      city: '舟山市',
    },
    {
      number: 4174,
      province: '四川省',
      city: '成都市',
      type: '家具',
    },
    {
      number: 6339,
      province: '四川省',
      city: '成都市',
      type: '办公用品',
    },
    {
      number: 10513,
      province: '四川省',
      city: '成都市',
    },
    {
      number: 4066,
      province: '四川省',
      city: '绵阳市',
      type: '家具',
    },
    {
      number: 3322,
      province: '四川省',
      city: '绵阳市',
      type: '办公用品',
    },
    {
      number: 7388,
      province: '四川省',
      city: '绵阳市',
    },
    {
      number: 4276,
      province: '四川省',
      city: '南充市',
      type: '家具',
    },
    {
      number: 6008,
      province: '四川省',
      city: '南充市',
      type: '办公用品',
    },
    {
      number: 10284,
      province: '四川省',
      city: '南充市',
    },
    {
      number: 4775,
      province: '四川省',
      city: '乐山市',
      type: '家具',
    },
    {
      number: 2810,
      province: '四川省',
      city: '乐山市',
      type: '办公用品',
    },
    {
      number: 7585,
      province: '四川省',
      city: '乐山市',
    },
    {
      number: 32418,
      province: '浙江省',
      type: '家具',
    },
    {
      number: 10680,
      province: '浙江省',
      type: '办公用品',
    },
    {
      number: 43098,
      province: '浙江省',
    },
    {
      number: 17291,
      province: '四川省',
      type: '家具',
    },
    {
      number: 18479,
      province: '四川省',
      type: '办公用品',
    },
    {
      number: 35770,
      province: '四川省',
    },
    {
      number: 78868,
    },
  ],
};
