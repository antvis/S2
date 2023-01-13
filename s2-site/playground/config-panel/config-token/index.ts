export default {
  relations: [
    {
      fromAttributeId: 'dataSource',
      toAttributeId: 'rows',
      action: 'disable',
      value: 'localImport',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'dataSource',
      toAttributeId: 'columns',
      action: 'disable',
      value: 'localImport',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'dataSource',
      toAttributeId: 'values',
      action: 'disable',
      value: 'localImport',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'values',
      toAttributeId: 'valueLocation',
      action: 'disable',
      value: [],
      operator: 'EMPTY',
    },
    {
      fromAttributeId: 'sheetType',
      toAttributeId: 'valueLocation',
      action: 'disable',
      value: 'table',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'sheetType',
      toAttributeId: 'hierarchyType',
      action: 'disable',
      value: 'table',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'sheetType',
      toAttributeId: 'frozenRowHeader',
      action: 'disable',
      value: 'table',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'sheetType',
      toAttributeId: 'rowSubTotals',
      action: 'disable',
      value: 'table',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'sheetType',
      toAttributeId: 'rowGrandTotals',
      action: 'disable',
      value: 'table',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'sheetType',
      toAttributeId: 'columnSubTotals',
      action: 'disable',
      value: 'table',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'sheetType',
      toAttributeId: 'columnGrandTotals',
      action: 'disable',
      value: 'table',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'widthChange',
      toAttributeId: 'adaptive',
      action: 'disable',
      value: 'compact',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'widthChange',
      toAttributeId: 'sheetWidth',
      action: 'disable',
      value: 'compact',
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'adaptive',
      toAttributeId: 'sheetWidth',
      action: 'disable',
      value: true,
      operator: 'EQUAL',
    },
    {
      fromAttributeId: 'adaptive',
      toAttributeId: 'sheetHeight',
      action: 'disable',
      value: true,
      operator: 'EQUAL',
    },
  ],
  config: {
    type: 'tab',
    children: [
      {
        type: 'tab-pane',
        displayName: '数据',
        children: [
          {
            type: 'radio',
            displayName: '数据源',
            attributeId: 'dataSource',
            defaultValue: 'exampleData',
            options: [
              {
                label: '样例数据',
                value: 'exampleData',
              },
              {
                label: '本地导入',
                value: 'localImport',
              },
            ],
          },
          {
            type: 'select',
            displayName: '行头',
            attributeId: 'rows',
            placeholder: '请选择行头数据',
            options: [
              {
                label: '省份',
                value: 'province',
              },
              {
                label: '城市',
                value: 'city',
              },
            ],
          },
          {
            type: 'select',
            displayName: '列头',
            attributeId: 'columns',
            placeholder: '请选择列头数据',
            options: [
              {
                label: '类别',
                value: 'type',
              },
              {
                label: '子类别',
                value: 'sub_type',
              },
            ],
          },
          {
            type: 'select',
            displayName: '数值',
            attributeId: 'values',
            placeholder: '请选择数值数据',
            options: [
              {
                label: '数量',
                value: 'number',
              },
              {
                label: '价格',
                value: 'price',
              },
            ],
          },
          {
            type: 'radio',
            displayName: '数值置于',
            attributeId: 'valueLocation',
            defaultValue: 'row',
            options: [
              {
                label: '行头',
                value: 'row',
              },
              {
                label: '列头',
                value: 'column',
              },
            ],
          },
          {
            type: 'radio',
            displayName: '视图',
            attributeId: 'sheetType',
            defaultValue: 'pivot',
            options: [
              {
                label: '透视',
                value: 'pivot',
              },
              {
                label: '明细',
                value: 'table',
              },
            ],
          },
        ],
      },
      {
        type: 'tab-pane',
        displayName: '样式',
        children: [
          {
            type: 'collapse',
            children: [
              {
                type: 'collapse-panel',
                displayName: '主题风格',
                children: [
                  {
                    type: 'radio',
                    displayName: '类型',
                    attributeId: 'hierarchyType',
                    defaultValue: 'grid',
                    options: [
                      {
                        label: '平铺',
                        value: 'grid',
                      },
                      {
                        label: '树状',
                        value: 'tree',
                      },
                    ],
                  },
                  {
                    type: 'radio',
                    displayName: '主题',
                    attributeId: 'theme',
                    defaultValue: 'default',
                    options: [
                      {
                        label: '默认',
                        value: 'default',
                      },
                      {
                        label: '简约灰',
                        value: 'gray',
                      },
                      {
                        label: '多彩蓝',
                        value: 'colorful',
                      },
                    ],
                  },
                  {
                    type: 'color-picker',
                    displayName: '主题色',
                    attributeId: 'themeColor',
                    defaultColor: '#E0E9FD',
                  },
                ],
              },
              {
                type: 'collapse-panel',
                displayName: '显示模式',
                children: [
                  {
                    type: 'radio',
                    displayName: '宽度调整',
                    attributeId: 'widthChange',
                    defaultValue: 'colAdaptive',
                    options: [
                      {
                        label: '列等宽',
                        value: 'colAdaptive',
                      },
                      {
                        label: '列紧凑',
                        value: 'compact',
                      },
                    ],
                  },
                  {
                    type: 'input-number',
                    displayName: '表格宽度',
                    attributeId: 'sheetWidth',
                    defaultValue: 600,
                    step: 1,
                    min: 0,
                  },
                  {
                    type: 'input-number',
                    displayName: '表格高度',
                    attributeId: 'sheetHeight',
                    defaultValue: 480,
                    step: 1,
                    min: 0,
                  },
                  {
                    type: 'switcher',
                    displayName: '冻结行头',
                    attributeId: 'frozenRowHeader',
                    defaultChecked: true,
                  },
                  {
                    type: 'switcher',
                    displayName: '宽高自适应',
                    attributeId: 'adaptive',
                    defaultChecked: true,
                  },
                ],
              },
              {
                type: 'collapse-panel',
                displayName: '行序号和分页',
                children: [
                  {
                    type: 'switcher',
                    displayName: '显示行序号',
                    attributeId: 'showSeriesNumber',
                  },
                  {
                    type: 'switcher',
                    displayName: '显示分页',
                    attributeId: 'showPagination',
                  },
                ],
              },
              {
                type: 'collapse-panel',
                displayName: '行小计/总计',
                children: [
                  {
                    type: 'switcher',
                    displayName: '行小计',
                    attributeId: 'rowSubTotals',
                  },
                  {
                    type: 'switcher',
                    displayName: '行总计',
                    attributeId: 'rowGrandTotals',
                  },
                ],
              },
              {
                type: 'collapse-panel',
                displayName: '列小计/总计',
                children: [
                  {
                    type: 'switcher',
                    displayName: '列小计',
                    attributeId: 'columnSubTotals',
                  },
                  {
                    type: 'switcher',
                    displayName: '列总计',
                    attributeId: 'columnGrandTotals',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
