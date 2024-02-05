import React, { useState } from 'react';
import {
  SheetComponent,
  SheetComponentOptions,
  Switcher,
} from '@antv/s2-react';
import insertCSS from 'insert-css';
import '@antv/s2-react/dist/style.min.css';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
    };

    // 明细表只需要 columns 字段
    const defaultFields = {
      columns: ['province', 'city', 'type', 'sub_type', 'number'],
    };

    const defaultSwitcherFields = {
      columns: {
        selectable: true,
        items: [
          { id: 'province', displayName: '省份 (province)' },
          { id: 'city', displayName: '城市 (city)' },
          { id: 'type', displayName: '类别 (type)' },
          { id: 'sub_type', displayName: '子类别 (sub_type)' },
          { id: 'number', displayName: '数量 (number)' },
        ],
      },
    };

    // 生成 switcher 所需要的 fields 结构
    function generateSwitcherFields(updatedResult) {
      return {
        columns: {
          selectable: true,
          items: updatedResult.columns.items,
        },
      };
    }

    // 生成 dataCfg fields 结构
    function generateFields(updatedResult) {
      return {
        columns: updatedResult.columns.items.map((i) => i.id),
      };
    }

    const SwitcherDemo = () => {
      const [fields, setFields] = useState(defaultFields);
      const [hiddenColumnFields, setHiddenColumnFields] = useState([]);
      const [switcherFields, setSwitcherFields] = useState(
        defaultSwitcherFields,
      );

      const onSubmit = (result) => {
        setFields(generateFields(result));
        setSwitcherFields(generateSwitcherFields(result));
        setHiddenColumnFields(result.columns.hideItems.map((i) => i.id));
      };

      return (
        <div>
          <Switcher sheetType="table" {...switcherFields} onSubmit={onSubmit} />
          <SheetComponent
            sheetType="table"
            adaptive={false}
            dataCfg={{ ...dataCfg, fields }}
            options={{ ...s2Options, interaction: { hiddenColumnFields } }}
          />
        </div>
      );
    };

    reactDOMClient
      .createRoot(document.getElementById('container'))
      .render(<SwitcherDemo />);
  });

insertCSS(`
  .antv-s2-switcher-item.checkable-item {
    align-items: center;
  }
`);
