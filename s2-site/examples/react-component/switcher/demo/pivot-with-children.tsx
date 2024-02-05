import {
  SheetComponent,
  SheetComponentOptions,
  Switcher,
} from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import insertCSS from 'insert-css';
import React, { useState } from 'react';
fetch(
  'https://render.alipay.com/p/yuyan/180020010001215413/s2/pivot-switcher-with-chidlren.json',
)
  .then((res) => res.json())
  .then((data) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
    };

    const defaultFields = {
      rows: ['province', 'city'],
      columns: ['type'],
      values: ['price', 'price-ac', 'price-rc', 'cost', 'cost-ac', 'cost-rc'],
    };

    const defaultSwitcherFields = {
      rows: {
        items: [{ id: 'province' }, { id: 'city' }],
      },
      columns: {
        items: [{ id: 'type' }],
      },
      values: {
        expandable: true,
        selectable: true,
        items: [
          { id: 'price', children: [{ id: 'price-ac' }, { id: 'price-rc' }] },
          { id: 'cost', children: [{ id: 'cost-ac' }, { id: 'cost-rc' }] },
        ],
      },
    };

    // 生成 switcher 所需要的 fields 结构
    function generateSwitcherFields(updatedResult) {
      const values = updatedResult.values.items.reduce((result, item) => {
        if (defaultSwitcherFields.values.items.find((i) => i.id === item.id)) {
          result.push(item);
        } else {
          const parent = result[result.length - 1];

          parent.children = parent.children ? parent.children : [];
          parent.children.push(item);
        }

        return result;
      }, []);

      return {
        rows: { items: updatedResult.rows.items },
        columns: { items: updatedResult.columns.items },
        values: {
          selectable: true,
          expandable: true,
          items: values,
        },
      };
    }

    // 生成 dataCfg fields 结构
    function generateFields(updatedResult) {
      return {
        rows: updatedResult.rows.items.map((i) => i.id),
        columns: updatedResult.columns.items.map((i) => i.id),
        values: updatedResult.values.items
          .filter(
            (i) =>
              !updatedResult.values.hideItems.find((hide) => hide.id === i.id),
          )
          .map((i) => i.id),
      };
    }

    const SwitcherDemo = () => {
      const [fields, setFields] = useState(defaultFields);
      const [switcherFields, setSwitcherFields] = useState(
        defaultSwitcherFields,
      );

      const onSubmit = (result) => {
        setFields(generateFields(result));
        setSwitcherFields(generateSwitcherFields(result));
      };

      return (
        <div>
          <Switcher
            {...switcherFields}
            // 是否允许指标在行列维度之间相互切换
            allowExchangeHeader={true}
            onSubmit={onSubmit}
          />
          <SheetComponent
            sheetType={'pivot'}
            adaptive={false}
            dataCfg={{ data, fields }}
            options={s2Options}
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
