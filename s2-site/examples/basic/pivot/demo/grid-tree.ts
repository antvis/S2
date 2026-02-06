import { PivotSheet, S2Options, setLang } from '@antv/s2';

fetch(
    'https://assets.antv.antgroup.com/s2/expanded-en-data-config.json',
)
    .then((res) => res.json())
    .then(async (dataCfg) => {
        const container = document.getElementById('container');

        const s2Options: S2Options = {
            width: 1200,
            height: 800,
            // grid-tree 模式：平铺布局 + 展开折叠
            // 每个维度层级有独立的列，同时支持展开/折叠子节点
            hierarchyType: 'grid-tree',
            style: {
                rowCell: {
                    // 默认展开第 1 层 (从 0 开始)
                    expandDepth: 1,
                },
            },
            // 配置总计和小计
            totals: {
                row: {
                    showGrandTotals: true,
                    showSubTotals: true,
                    subTotalsDimensions: ['province'],
                    grandTotalsLabel: '总计',
                    subTotalsLabel: '小计',
                    // 自动计算小计和总计
                    calcSubTotals: {
                        aggregation: 'SUM',
                    },
                    calcGrandTotals: {
                        aggregation: 'SUM',
                    },
                    reverseSubTotalsLayout: true,
                },
            },
        };

        setLang('en_US');

        const s2 = new PivotSheet(container!, dataCfg, s2Options);

        await s2.render();
    });
