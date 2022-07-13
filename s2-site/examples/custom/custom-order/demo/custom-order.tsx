import React from "react";
import ReactDOM from "react-dom";
import { SheetComponent } from "@antv/s2-react";
import { SortMethod } from "@antv/s2/src";

export enum SortMethodType {
    asc = 'asc',
    desc = 'desc',
    none = 'none',
    manual = 'manual'
}

export const MENUS = [
    { key: SortMethodType.none, text: '不排序' },
    { key: SortMethodType.asc, text: '升序', icon: 'GroupAsc' },
    { key: SortMethodType.desc, text: '降序', icon: 'GroupDesc' },
    { key: SortMethodType.manual, text: '手动排序', icon: 'Trend' },
];


fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
)
    .then((res) => res.json())
    .then((res) => {
        const container = document.getElementById('container');
        const s2DataConfig = {
            fields: {
                rows: [ 'province', 'city' ],
                columns: [ 'type', 'sub_type' ],
                values: [ 'number' ],
            },
            meta: res.meta,
            data: res.data,
        };
        const orderCallback = (meta, key, event:any ) => {
            if (key === SortMethodType.manual) {
                alert('可以在这里实现你手动排序的交互和逻辑哟')
            } else {
                meta.spreadsheet.groupSortByMethod(key as unknown as SortMethod, meta);
            }
        }
        const s2Options = {
            width: 600,
            height: 480,
            // 关闭默认icon
            showDefaultHeaderActionIcon: false,
            // 自定义 icon
            customSVGIcons: [
                {
                    name: 'customKingIcon',
                    svg: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
                },
            ],
            tooltip: {
                showTooltip: true,
                operation: {
                    menus: MENUS
                }
            },
            // 使用刚定义的 icon
            headerActionIcons: [
                {
                    iconNames: [ 'customKingIcon' ],
                    belongsCell: 'colCell',
                    displayCondition: (meta) => meta.level === 2 , // 只修改数值层的 icon
                    action: (props) => {
                        console.log(props, 'header action icons');
                        const { meta, event } = props;
                        // meta.spreadsheet.handleGroupSort(event, meta);
                        const operator = {
                            onClick: ({ key }) => {
                                // 更新被排序的列的排序 action Icon
                                // 这里的回调，用户已经排序了
                                orderCallback(meta, key, event);
                                meta.spreadsheet.hideTooltip();
                            },
                            menus: MENUS,
                        };
                        // 自定义 tooltip 配置，展示 toolTip
                        meta.spreadsheet.showTooltipWithInfo(event, [], {
                            operator,
                            showSingleTips: true,
                            onlyMenu: true,
                        });
                    },
                },
            ],
        };

        // 使用
        ReactDOM.render(
            <SheetComponent dataCfg={s2DataConfig} options={s2Options} />,
            document.getElementById('container'),
        );
    });
