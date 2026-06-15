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
            // column grid-tree mode: tile layout + expand/collapse for columns
            columnHierarchyType: 'grid-tree',
            style: {
                colCell: {
                    // Default expand depth (starts from 0)
                    expandDepth: 0,
                },
            },
            // Configure col totals
            totals: {
                col: {
                    showGrandTotals: true,
                    showSubTotals: true,
                    subTotalsDimensions: ['type'],
                    grandTotalsLabel: 'Total',
                    subTotalsLabel: 'SubTotal',
                    // Auto calculate
                    calcSubTotals: {
                        aggregation: 'SUM',
                    },
                    calcGrandTotals: {
                        aggregation: 'SUM',
                    },
                },
            },
        };

        setLang('en_US');

        const s2 = new PivotSheet(container!, dataCfg, s2Options);

        await s2.render();
    });
