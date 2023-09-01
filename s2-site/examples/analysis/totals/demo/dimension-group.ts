import { PivotSheet } from '@antv/s2';

fetch('https://gw.alipayobjects.com/os/bmw-prod/6eede6eb-8021-4da8-bb12-67891a5705b7.json')
    .then((res) => res.json())
    .then((data) => {
        const container = document.getElementById('container');
        const s2DataConfig = {
            fields: {
                rows: ['province', 'city', 'type'],
                columns: [],
                values: ['price' ,'cost'],
            },
            meta: [
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
                    name: '商品类别',
                },
                {
                    field: 'price',
                    name: '价格',
                },
                {
                    field: 'cost',
                    name: '成本',
                },
            ],
            data,
        };

        const s2Options = {
            width: 600,
            height: 480,
            // 配置小计总计显示,按维度分组
            totals: {
                row: {
                    showGrandTotals: true,
                    showSubTotals: true,
                    reverseLayout: true,
                    reverseSubLayout: true,
                    subTotalsDimensions: ['province'],
                    calcTotals: {
                        aggregation: 'SUM',
                    },
                    calcSubTotals: {
                        aggregation: 'SUM',
                    },
                    totalsDimensionsGroup: ['city'],
                    subTotalsDimensionsGroup: ['type'],
                },
            },
        };
        const s2 = new PivotSheet(container, s2DataConfig, s2Options);

        s2.render();
    });
