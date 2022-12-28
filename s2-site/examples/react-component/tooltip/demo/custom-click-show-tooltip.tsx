import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent, SheetComponentOptions } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { TargetCellInfo } from '@antv/s2';

fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2a5dbbc8-d0a7-4d02-b7c9-34f6ca63cff6.json',
)
  .then((res) => res.json())
  .then((dataCfg) => {
    const s2Options: SheetComponentOptions = {
      width: 600,
      height: 480,
      tooltip: {
        showTooltip: true,
        rowCell: {
          showTooltip: false,
        },
      },
    };

    const CustomTooltip = () => <div>demo</div>;

    const onColCellClick = (cellInfo: TargetCellInfo) => {
      if (!cellInfo?.viewMeta) {
        return;
      }
      const { spreadsheet, id } = cellInfo.viewMeta;
      if (id === 'root[&]家具') {
        const position = {
          x: cellInfo.event.clientX,
          y: cellInfo.event.clientY,
        };
        spreadsheet.tooltip.show({
          position,
          content: <CustomTooltip />,
        });
      } else {
        spreadsheet.hideTooltip();
      }
    };

    ReactDOM.render(
      <SheetComponent
        sheetType="pivot"
        adaptive={false}
        dataCfg={dataCfg}
        options={s2Options}
        onColCellClick={onColCellClick}
      />,
      document.getElementById('container'),
    );
  });
