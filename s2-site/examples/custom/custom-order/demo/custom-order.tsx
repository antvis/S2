import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { SheetComponent } from "@antv/s2-react";
import { SortMethod } from "@antv/s2/src";

const SortMethodType = {
    asc: 'asc',
    desc: 'desc',
    none: 'none',
    manual: 'manual'
}

const MENUS = [
    { key: SortMethodType.none, text: '不排序' },
    { key: SortMethodType.asc, text: '升序', icon: 'GroupAsc' },
    { key: SortMethodType.desc, text: '降序', icon: 'GroupDesc' },
    { key: SortMethodType.manual, text: '手动排序', icon: 'Trend' },
];
const s2DataConfig = {
    fields: {
        rows: [ 'province', 'city' ],
        columns: [ 'type', 'sub_type' ],
        values: [ 'number' ],
    },
    meta: undefined,
    data: undefined
};

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
    },
};

const useDataCfg = () => {
    const [ res, setRes ] = useState({ meta: undefined, data: undefined });
    const [ dataCfg, setDataCfg ] = useState(s2DataConfig);

    useEffect(() => {
        fetch(
            'https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json',
        )
            .then((res) => res.json())
            .then((res) => setRes(res));
    }, []);

    useEffect(() => {
        setDataCfg({
            ...s2DataConfig,
            meta: res.meta,
            data: res.data,
        });
    }, [ res ])

    return dataCfg;
}

const App = () => {
    const dataCfg = useDataCfg();
    const [ sortParams, setSortParams ] = useState([]);

    // 使用刚定义的 icon
    const headerActionIcons = [
        {
            // 选择icon,可以是 S2 自带的，也可以是自定义的 icon
            iconNames: [ 'customKingIcon' ],
            // 通过 belongsCell + displayCondition 设置 icon 的展示位置
            belongsCell: 'colCell',
            displayCondition: (meta) => meta.level === 2,
            // icon 点击之后的执行函数
            action: (props) => {
                const { meta, event } = props;
                const operator = {
                    onClick: ({ key }) => {
                        // 更新被排序的列的排序 action Icon
                        // 这里的回调，用户已经排序了
                        handleSortCallback(meta, key);
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
    ];
    //
    const handleSortCallback = (meta, key) => {
        if (key === SortMethodType.manual) {
            const sortParams = [
                { sortFieldId: 'type', sortBy: [ '办公用品', '家具' ] },
                { sortFieldId: 'city', sortMethod: 'ASC' },
            ];
            setSortParams(sortParams)
            console.log('可以在这里实现你手动排序的交互和逻辑哟', sortParams)
        } else {
            // 使用 S2 提供的组内排序方式
            meta.spreadsheet.groupSortByMethod(key as unknown as SortMethod, meta);
        }
    }

    return <SheetComponent dataCfg={ { ...dataCfg, sortParams: sortParams } } options={ {...s2Options, headerActionIcons} }/>;
}

// 使用
ReactDOM.render(
    <App/>,
    document.getElementById('container'),
);

